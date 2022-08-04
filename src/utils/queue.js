import JSZip from 'jszip'
import { getHtml, downFile, setLocalData, getLocalData } from '@/utils/index'

// 多个任务并行执行的队列
// https://juejin.cn/post/6844903961728647181

export default class Queue {
  constructor(workerLen, maxPictureNum, zipDownFlag, vue) {
    this.workerLen = workerLen || 3 // 同时执行的任务数
    this.pictureNum = maxPictureNum || 2 // 章节最大下载图片数量
    this.zipDownFlag = zipDownFlag || false // 是否压缩下载
    this.list = [] // 任务队列
    this.worker = new Array(this.workerLen) // 正在执行的任务
    this.workerimg = new Array(this.workerLen) // 存储下载的图片数据
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
    const readtype = this.worker[index].type
    const chapterName = this.worker[index].chapterName
    const _this = this

    function afterDown(index) {
      const { comicName, hasError } = _this.worker[index]
      const comicPageUrl = window.location.href
      let historyData = getLocalData('10AppDownHistory') || '[]'
      historyData = JSON.parse(historyData)
      historyData.unshift({ comicName, chapterName, comicPageUrl, hasError })
      historyData = JSON.stringify(historyData)
      setLocalData('10AppDownHistory', historyData)
      _this.Vue.getHistoryData()
      _this.worker[index] = undefined
      _this.run()
    }

    if (readtype === 1) {
      const url = this.worker[index].url
      let imgs = []
      try {
        imgs = await getHtml(url)
      } catch (error) {
        this.worker[index].hasError = true
      }
      this.worker[index].imgs = imgs
      this.worker[index].number = imgs.length

      if (this.zipDownFlag) {
        yield this.zipDown(index)
          .then(function() {
            afterDown(index)
          })
      } else {
        yield this.directDown(index)
          .then(function() {
            afterDown(index)
          })
      }
    } else {
      if (this.zipDownFlag) {
        yield this.zipDown2(index)
          .then(function() {
            afterDown(index)
          })
      } else {
        yield this.directDown2(index)
          .then(function() {
            afterDown(index)
          })
      }
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
    // this.worker.splice(0, 0)
    this.worker.push('')
    this.worker.pop()
  }

  // 下载图片 Promise
  addImgDownPromise(index, imgurl, name) {
    return new Promise((resolve, reject) => {
      const _this = this

      const suffix = this.getSuffix(imgurl)
      const newName = this.worker[index].comicName + '\\' + this.worker[index].chapterName + '\\' + name + '.' + suffix
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
          console.log('onerror: ', result)
          resolve(false)
        },
        ontimeout: result => {
          console.log('ontimeout: ', result)
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

  // 网站翻页阅读方式  压缩下载
  async zipDown2(workerId) {
    const url = this.worker[workerId].url
    const { imgUrl, nextPageUrl, number } = await getHtml(url)
    this.worker[workerId].number = number

    while (imgUrl.length > 0) {
      // eslint-disable-next-line prefer-const
      let promise = []
      for (let index = this.pictureNum; index > 0; index--) {
        if (imgUrl[0] === undefined) {
          break
        }
        promise.push(this.addImgPromise(workerId, imgUrl[0]))
        imgUrl.shift()
      }

      const res = await Promise.all(promise)
      res.forEach(element => {
        this.workerimg[workerId].push(element)
      })
    }

    if (nextPageUrl !== '') {
      this.worker[workerId].url = nextPageUrl
      return this.zipDown2(workerId)
    }

    const result = await this.makeZip(workerId)
    return new Promise((resolve, reject) => {
      resolve(result)
    })
  }

  // 网站卷轴阅读方式  压缩下载
  async zipDown(workerId) {
    const imgs = this.worker[workerId].imgs
    const promise = []
    let len = imgs.length
    let pictureNum = this.pictureNum
    while (pictureNum--) {
      if (len > 0) {
        promise.push(this.addImgPromise(workerId, imgs[0]))
        this.worker[workerId].imgs.shift()
        len--
      }
    }
    const res = await Promise.all(promise)
    res.forEach(element => {
      this.workerimg[workerId].push(element)
    })

    if (this.worker[workerId].imgs.length > 0) {
      return this.zipDown(workerId)
    }

    const result = await this.makeZip(workerId)
    return new Promise((resolve, reject) => {
      resolve(result)
    })
  }

  // 网站卷轴阅读方式  直接下载
  async directDown(workerId) {
    const imgs = this.worker[workerId].imgs
    const promise = []
    let len = imgs.length
    let pictureNum = this.pictureNum
    while (pictureNum--) {
      if (len > 0) {
        const name = this.worker[workerId].imgIndex + 1
        promise.push(this.addImgDownPromise(workerId, imgs[0], name))
        this.worker[workerId].imgIndex++
        this.worker[workerId].imgs.shift()
        len--
      }
    }
    await Promise.all(promise)
    if (this.worker[workerId].imgs.length > 0) {
      return this.directDown(workerId)
    }

    return new Promise((resolve, reject) => {
      resolve(1)
    })
  }

  // 网站翻页阅读方式  直接下载
  async directDown2(workerId) {
    const url = this.worker[workerId].url
    const { imgUrl, nextPageUrl, number } = await getHtml(url)
    this.worker[workerId].number = number

    while (imgUrl.length > 0) {
      // eslint-disable-next-line prefer-const
      let promise = []
      for (let index = this.pictureNum; index > 0; index--) {
        if (imgUrl[0] === undefined) {
          break
        }
        const name = this.worker[workerId].imgIndex + 1
        promise.push(this.addImgDownPromise(workerId, imgUrl[0], name))
        imgUrl.shift()
      }
      await Promise.all(promise)
    }

    if (nextPageUrl !== '') {
      this.worker[workerId].url = nextPageUrl
      return this.directDown2(workerId)
    }

    return new Promise((resolve, reject) => {
      resolve(1)
    })
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
          type: item.type,
          func: this.exeDown(i),
          imgIndex: 0,
          hasError: false
        }
        this.workerimg[i] = []
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
    const comicName = this.worker[workerId].comicName
    const chapterName = this.worker[workerId].chapterName

    return new Promise((resolve, reject) => {
      const zip = new JSZip()

      this.workerimg[workerId].forEach((item, index) => {
        const imgblob = item.blob
        const suffix = item.suffix
        if (imgblob === 1 || imgblob === 0) {
          zip.file(parseInt(index + 1) + '.xx', '', { blob: true })
          return
        }
        zip.file(parseInt(index + 1) + '.' + suffix, imgblob, { blob: true })
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
