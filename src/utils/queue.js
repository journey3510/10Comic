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
      const { url, isPay } = this.worker[index]
      const processData = { url, isPay }
      let imgs = []
      try {
        imgs = await getImage(processData)
      } catch (error) {
        this.worker[index].hasError = true
      }
      imgs === [] ? this.worker[index].hasError = true : ''
      this.worker[index].imgs = imgs
      this.worker[index].totalNumber = imgs.length
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

  // 直接下载图片 Promise
  addImgDownPromise(index, imgurl, imgIndex) {
    return new Promise((resolve, reject) => {
      const _this = this
      const suffix = this.getSuffix(imgurl)
      const newName = this.worker[index].comicName + '\\' + this.worker[index].chapterName + '\\' + addZeroForNum(imgIndex, this.imgIndexBitNum) + '.' + suffix

      downFile({
        url: imgurl,
        name: newName,
        headers: {
          referer: this.worker[index].url
        },
        onload: result => {
          _this.worker[index].successNum = _this.worker[index].successNum + 1
          _this.worker[index].progress = parseInt(_this.worker[index].imgIndex / _this.worker[index].totalNumber * 100)
          _this.refresh()
          resolve(true)
        },
        onerror: result => {
          if (imgurl !== '') {
            // 失败重新请求
            request({
              method: 'get',
              url: imgurl,
              responseType: 'blob',
              headers: {
                referer: this.worker[index].url
              }
            }).then((res) => {
              const name_2 = this.worker[index].comicName + '\\' + this.worker[index].chapterName + '\\' + addZeroForNum(imgIndex, this.imgIndexBitNum) + '.' + this.getSuffix(res.finalUrl)
              _this.worker[index].successNum = _this.worker[index].successNum + 1
              _this.worker[index].progress = parseInt(_this.worker[index].imgIndex / _this.worker[index].totalNumber * 100)
              _this.refresh()
              if (res === 'onerror' || res === 'timeout') {
                _this.worker[index].hasError = true
                resolve(false)
              }
              const newurl = window.URL.createObjectURL(res.response)
              downFile(newurl, name_2).then((downRes) => {
                if (downRes) {
                  resolve(true)
                } else {
                  _this.worker[index].hasError = true
                  resolve(false)
                }
              })
            })
          } else {
            console.log('onerror: ', result)
            _this.worker[index].hasError = true
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

  // 请求图片Blob Promise (后用于压缩)
  addImgPromise(index, imgurl) {
    return new Promise((resolve, reject) => {
      const _this = this
      const suffix = this.getSuffix(imgurl)

      request({
        method: 'get',
        url: imgurl,
        responseType: 'blob',
        headers: {
          referer: _this.worker[index].url
        },
        onload: function(gmRes) {
          _this.worker[index].successNum = _this.worker[index].successNum + 1
          _this.worker[index].progress = parseInt(_this.worker[index].imgIndex / _this.worker[index].totalNumber * 100)
          _this.refresh()
          resolve({
            blob: gmRes.response,
            suffix: suffix })
        },
        onerror: function(e) {
          _this.worker[index].hasError = true
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

  /**
     * 下载图片
     * @param { workerId } workerId: 任务id
     */

  // 网站翻页阅读
  async down2(workerId) {
    const { url, zipDownFlag, totalNumber, isPay, imgIndex } = this.worker[workerId]

    const processData = { url, imgIndex, totalNumber, isPay }
    processData.otherData = this.worker[workerId].otherData

    const { imgUrlArr, nextPageUrl, imgCount, otherData } = await getImage(processData)
    this.worker[workerId].otherData = otherData

    this.worker[workerId].totalNumber = parseInt(imgCount)
    const beforeDownLen = imgUrlArr.length
    // console.log('下载前', beforeDownLen, imgIndex, totalNumber)

    while (imgUrlArr.length > 0) {
      // eslint-disable-next-line prefer-const
      let promise = []
      for (let index = this.pictureNum; index > 0; index--) {
        if (imgUrlArr[0] === undefined) {
          break
        }
        const imgIndex = ++this.worker[workerId].imgIndex
        if (zipDownFlag) {
          promise.push(this.addImgPromise(workerId, imgUrlArr[0]))
        } else {
          promise.push(this.addImgDownPromise(workerId, imgUrlArr[0], imgIndex))
        }
        imgUrlArr.shift()
      }

      const res = await Promise.all(promise)
      res.forEach(element => {
        this.workerDownInfo[workerId].push(element)
      })
    }

    const newImgIndex = this.worker[workerId].imgIndex
    if (beforeDownLen !== 0 && nextPageUrl !== '' && newImgIndex < parseInt(imgCount)) {
      this.worker[workerId].url = nextPageUrl
      return new Promise((resolve, reject) => {
        // 休息一下？
        setTimeout(() => {
          resolve(this.down2(workerId))
        }, 1000)
      })
    } else {
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
  }

  // 网站卷轴阅读
  async down(workerId) {
    const { imgs, zipDownFlag } = this.worker[workerId]
    const promise = []
    let len = imgs.length
    let pictureNum = this.pictureNum

    while (pictureNum-- && len > 0) {
      // 是否压缩
      const imgIndex = ++this.worker[workerId].imgIndex
      if (zipDownFlag) {
        promise.push(this.addImgPromise(workerId, imgs[0]))
      } else {
        promise.push(this.addImgDownPromise(workerId, imgs[0], imgIndex))
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
          url: item.url,
          isPay: item.isPay, // 是否付费章节
          imgIndex: 0, // 图片序号
          successNum: 0, // 下载成功数量
          totalNumber: 0, // 图片总数
          imgs: [],
          progress: 0, // 进度百分比
          readtype: item.readtype, // 阅读(下载)方式类型
          func: this.exeDown(i),
          zipDownFlag: item.zipDownFlag, // 是否压缩
          hasError: false,
          otherData: undefined // 自定义存储其他下载数据
        }
        this.worker[i] = worker
        this.workerDownInfo[i] = []
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
