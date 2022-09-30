import JSZip from 'jszip'
import { getImage, downFile, addZeroForNum, request } from '@/utils/index'
import { setStorage, getStorage } from '@/config/setup'

// 多个任务并行执行的队列
// https://juejin.cn/post/6844903961728647181

export default class Queue {
  constructor(workerLen, maxPictureNum, imgIndexBitNum, vue) {
    this.workerLen = workerLen || 3 // 同时执行的任务数
    this.pictureNum = maxPictureNum || 2 // 章节最大下载图片数量
    this.list = [] // 任务队列
    this.worker = new Array(this.workerLen) // 正在执行的任务
    this.workerDownInfo = new Array(this.workerLen) // 存储下载信息
    this.imgIndexBitNum = imgIndexBitNum // 图片序号位数
    this.Vue = vue
  }

  // 压缩下载方式
  async downloadFile(fileName, content) {
    const url = window.URL.createObjectURL(content)
    await downFile(url, fileName)
    window.URL.revokeObjectURL(url)
  }

  /**
     * 执行一个任务
     * @param { number } index
     */
  async * exeDown(index) {
    const { readtype, chapterName } = this.worker[index]
    const _this = this

    async function afterDown(index) {
      const { comicName, hasError } = _this.worker[index]
      const comicPageUrl = window.location.href
      let historyData = getStorage('downHistory') || '[]'
      historyData = JSON.parse(historyData)
      const id = (new Date()).getTime()
      historyData.unshift({ id, comicName, chapterName, comicPageUrl, hasError })
      historyData = JSON.stringify(historyData)
      setStorage('downHistory', historyData)
      _this.Vue.getHistoryData()
      _this.worker[index] = undefined
      // 休息下？
      setTimeout(() => {
        _this.run()
      }, 2000)
    }

    if (readtype === 1) {
      const url = this.worker[index].url
      let imgs = []
      try {
        imgs = await getImage(url)
      } catch (error) {
        this.worker[index].hasError = true
      }
      imgs === [] ? this.worker[index].hasError = true : ''
      this.worker[index].imgs = imgs
      this.worker[index].number = imgs.length
      yield this.down(index)
        .then(function() {
          afterDown(index)
        })
        //
    } else {
      yield this.down2(index)
        .then(function() {
          afterDown(index)
        })
    }
  }

  /**
     * 添加到任务队列
     * @param { Array<Array<any>> } list: 任务队列
     */
  addList(list) {
    for (const item of list) {
      this.list.unshift(item)
    }
  }

  refresh() {
    this.worker.splice(0, 0)
  }

  // 下载图片 Promise
  addImgDownPromise(index, imgurl, imgIndex) {
    return new Promise((resolve, reject) => {
      const _this = this
      const suffix = this.getSuffix(imgurl)
      const newName = this.worker[index].comicName + '\\' + this.worker[index].chapterName + '\\' + addZeroForNum(imgIndex, this.imgIndexBitNum) + '.' + suffix
      // eslint-disable-next-line no-undef
      GM_download({
        url: imgurl,
        name: newName,
        onload: result => {
          _this.worker[index].currentnum = _this.worker[index].currentnum + 1
          _this.worker[index].progress = parseInt(_this.worker[index].currentnum / _this.worker[index].number * 100)
          _this.refresh()
          resolve(true)
        },
        onerror: result => {
          if (result.error === 'not_whitelisted') {
            // 重新请求
            request({
              method: 'get',
              url: imgurl,
              responseType: 'blob'
            }).then((res) => {
              const name_2 = this.worker[index].comicName + '\\' + this.worker[index].chapterName + '\\' + addZeroForNum(imgIndex, this.imgIndexBitNum) + '.' + this.getSuffix(res.finalUrl)
              _this.worker[index].currentnum = _this.worker[index].currentnum + 1
              _this.worker[index].progress = parseInt(_this.worker[index].currentnum / _this.worker[index].number * 100)
              _this.refresh()
              if (res === 'onerror' || res === 'timeout') {
                resolve(false)
              }
              this.downloadFile(name_2, res.response).then((downRes) => {
                if (downRes) {
                  resolve(true)
                } else {
                  resolve(false)
                }
              })
            })
          } else {
            console.log('onerror: ', result)
            resolve(false)
          }
        },
        ontimeout: result => {
          console.log('ontimeoutError: ', result)
          resolve(false)
        }
      })
    })
  }

  // 请求图片 Promise
  addImgPromise(index, imgurl) {
    return new Promise((resolve, reject) => {
      const _this = this
      const suffix = this.getSuffix(imgurl)
      // eslint-disable-next-line no-undef
      GM_xmlhttpRequest({
        method: 'get',
        url: imgurl,
        responseType: 'blob',
        onload: function(gmRes) {
          _this.worker[index].currentnum = _this.worker[index].currentnum + 1
          _this.worker[index].progress = parseInt(_this.worker[index].currentnum / _this.worker[index].number * 100)
          _this.refresh()
          resolve({
            blob: gmRes.response,
            suffix: suffix })
        },
        onerror: function(e) {
          resolve({
            blob: 1,
            suffix: '' })
        },
        ontimeout: function() {
          resolve({
            blob: 0,
            suffix: '' })
        }
      })
    })
  }

  // 网站翻页阅读方式
  async down2(workerId) {
    const { url, zipDownFlag } = this.worker[workerId]
    const { imgUrl, nextPageUrl, number } = await getImage(url)
    this.worker[workerId].number = number

    while (imgUrl.length > 0) {
      // eslint-disable-next-line prefer-const
      let promise = []
      for (let index = this.pictureNum; index > 0; index--) {
        if (imgUrl[0] === undefined) {
          break
        }
        if (zipDownFlag) {
          promise.push(this.addImgPromise(workerId, imgUrl[0]))
        } else {
          const imgIndex = ++this.worker[workerId].imgIndex
          promise.push(this.addImgDownPromise(workerId, imgUrl[0], imgIndex))
        }
        imgUrl.shift()
      }

      const res = await Promise.all(promise)
      res.forEach(element => {
        this.workerDownInfo[workerId].push(element)
      })
    }

    if (nextPageUrl !== '') {
      this.worker[workerId].url = nextPageUrl
      return new Promise((resolve, reject) => {
        // 休息一下？
        setTimeout(() => {
          resolve(this.down2(workerId))
        }, 1000)
      })
    }

    // 是否压缩
    if (zipDownFlag) {
      const result = await this.makeZip(workerId)
      return new Promise((resolve, reject) => {
        resolve(result)
      })
    } else {
      return new Promise((resolve, reject) => {
        resolve(1)
      })
    }
  }

  // 网站卷轴阅读方式
  async down(workerId) {
    const { imgs, zipDownFlag } = this.worker[workerId]
    const promise = []
    let len = imgs.length
    let pictureNum = this.pictureNum

    while (pictureNum-- && len > 0) {
      // 是否压缩
      if (zipDownFlag) {
        promise.push(this.addImgPromise(workerId, imgs[0]))
      } else {
        const imgIndex = this.worker[workerId].imgIndex + 1
        promise.push(this.addImgDownPromise(workerId, imgs[0], imgIndex))
        this.worker[workerId].imgIndex++
      }
      this.worker[workerId].imgs.shift()
      len--
    }
    const res = await Promise.all(promise)

    res.forEach(element => {
      this.workerDownInfo[workerId].push(element)
    })

    if (this.worker[workerId].imgs.length > 0) {
      return new Promise((resolve, reject) => {
        // 休息一下？
        setTimeout(() => {
          resolve(this.down(workerId))
        }, 1000)
      })
    }

    // 是否压缩
    if (zipDownFlag) {
      const result = await this.makeZip(workerId)
      return new Promise((resolve, reject) => {
        resolve(result)
      })
    } else {
      return new Promise((resolve, reject) => {
        resolve(1)
      })
    }
  }

  // 分配并执行任务
  async run() {
    const runIndex = []
    for (let i = 0; i < this.workerLen; i++) {
      const len = this.list.length
      if (!this.worker[i] && len > 0) {
        // 需要执行的任务
        const item = this.list[len - 1]

        const worker = {
          comicName: item.comicName,
          chapterName: item.chapterName,
          currentnum: 0,
          number: 0,
          imgs: [],
          url: item.url,
          progress: 0,
          readtype: item.readtype,
          func: this.exeDown(i),
          zipDownFlag: item.zipDownFlag,
          imgIndex: 0,
          hasError: false
        }
        this.workerDownInfo[i] = []
        this.worker[i] = worker
        this.list.pop()
        runIndex.push(i)
      }
    }
    // 执行任务
    for (const index of runIndex) {
      this.worker[index].func.next()
    }
  }

  getSuffix(url) {
    const testurl = url.toLowerCase()
    const imgtype = ['jpg', 'jpeg', 'webp', 'png', 'gif', 'bmp', 'tiff', 'svg', 'ico']
    for (let i = 0; i < imgtype.length; i++) {
      const a = testurl.search(imgtype[i])
      if (a !== -1) {
        return imgtype[i]
      }
    }
    // 可能网址没有图片后缀
    return 'jpg'
  }

  // 压缩
  async makeZip(workerId) {
    const { comicName, chapterName } = this.worker[workerId]
    return new Promise((resolve, reject) => {
      const zip = new JSZip()
      this.workerDownInfo[workerId].forEach((item, index) => {
        const imgblob = item.blob
        const suffix = item.suffix
        if (imgblob === 1 || imgblob === 0) {
          zip.file(addZeroForNum(index + 1, this.imgIndexBitNum) + '.xx', '', { blob: true })
          return
        }
        zip.file(addZeroForNum(index + 1, this.imgIndexBitNum) + '.' + suffix, imgblob, { blob: true })
      })

      zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9
        }
      }).then((zipblob) => {
        const name = comicName + '\\' + chapterName + '.zip'
        this.downloadFile(name, zipblob)
        resolve()
        return
      })
    })
  }
}
