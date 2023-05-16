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
  addImgDownPromise(index, imgurl, imgIndex, newHeaders, retryTimes) {
    const headers = {
      referer: this.worker[index].url
    }
    return new Promise((resolve, reject) => {
      const _this = this
      if (!imgurl) {
        _this.worker[index].progress = parseInt(_this.worker[index].imgIndex / _this.worker[index].totalNumber * 100)
        _this.refresh()
        resolve(false)
      }

      request({
        method: 'get',
        url: imgurl,
        responseType: 'blob',
        headers: newHeaders || headers,
        timeout: 60 * 1000
      }).then((res) => {
        const name = this.worker[index].comicName + '\\' + this.worker[index].chapterName + '\\' +
        addZeroForNum(imgIndex, this.imgIndexBitNum) + '.'

        let suffix = this.getSuffix(res.finalUrl)

        _this.worker[index].successNum = _this.worker[index].successNum + 1
        _this.worker[index].progress = parseInt(_this.worker[index].imgIndex / _this.worker[index].totalNumber * 100)
        _this.refresh()

        let newurl = ''
        if (res === 'onerror' || res === 'timeout') {
          if (retryTimes !== 2) {
            if (retryTimes === undefined) retryTimes = 0
            return resolve(_this.addImgDownPromise(index, imgurl, imgIndex, newHeaders, ++retryTimes))
          }

          _this.worker[index].hasError = true
          suffix = 'txt'
          const newBlob = new Blob([imgurl], { type: 'text/plain' })
          newurl = window.URL.createObjectURL(newBlob)
        } else {
          newurl = window.URL.createObjectURL(res.response)
        }
        downFile(newurl, name + suffix).then((downRes) => {
          if (downRes) {
            resolve(true)
          } else {
            _this.worker[index].hasError = true
            resolve(false)
          }
        })
      })
    })
  }

  // 请求图片Blob Promise (后用于压缩)
  addImgPromise(index, imgurl, newHeaders, retryTimes) {
    const headers = {
      referer: this.worker[index].url
    }
    return new Promise((resolve, reject) => {
      const _this = this
      if (imgurl === '' || imgurl === undefined) {
        _this.worker[index].hasError = true
        return resolve({
          blob: 1,
          imgurl,
          suffix: '' })
      }

      const suffix = this.getSuffix(imgurl)
      request({
        method: 'get',
        url: imgurl,
        responseType: 'blob',
        headers: newHeaders || headers,
        timeout: 60 * 1000,
        onload: function(gmRes) {
          _this.worker[index].successNum = _this.worker[index].successNum + 1
          _this.worker[index].progress = parseInt(_this.worker[index].imgIndex / _this.worker[index].totalNumber * 100)
          _this.refresh()
          resolve({
            blob: gmRes.response,
            suffix: suffix })
        },
        onerror: function(e) {
          if (retryTimes !== 2) {
            if (retryTimes === undefined) retryTimes = 0
            return resolve(_this.addImgPromise(index, imgurl, newHeaders, ++retryTimes))
          }
          _this.worker[index].hasError = true
          resolve({
            blob: 1,
            imgurl,
            suffix: '' })
        },
        ontimeout: function() {
          if (retryTimes !== 2) {
            if (retryTimes === undefined) retryTimes = 0
            return resolve(_this.addImgPromise(index, imgurl, newHeaders, ++retryTimes))
          }
          resolve({
            blob: 0,
            imgurl,
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
    const { url, downType, totalNumber, isPay, imgIndex, downHeaders } = this.worker[workerId]

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
        if (downType) {
          promise.push(this.addImgPromise(workerId, imgUrlArr[0], downHeaders))
        } else {
          promise.push(this.addImgDownPromise(workerId, imgUrlArr[0], imgIndex, downHeaders))
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
      // 压缩
      if (downType === 1) {
        const result = await this.makeZip(workerId)
        return new Promise((resolve, reject) => {
          resolve(result)
        })
      } else if (downType === 2) { // 拼接
        await this.combineImages(workerId)
        return new Promise((resolve, reject) => {
          resolve()
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
    const { imgs, downType, downHeaders } = this.worker[workerId]
    const promise = []
    let len = imgs.length
    let pictureNum = this.pictureNum

    while (pictureNum-- && len > 0) {
      // 是否压缩
      const imgIndex = ++this.worker[workerId].imgIndex
      if (downType) {
        promise.push(this.addImgPromise(workerId, imgs[0], downHeaders))
      } else {
        promise.push(this.addImgDownPromise(workerId, imgs[0], imgIndex, downHeaders))
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

    // 压缩
    if (downType === 1) {
      const result = await this.makeZip(workerId)
      return new Promise((resolve, reject) => {
        resolve(result)
      })
    } else if (downType === 2) { // 拼接
      await this.combineImages(workerId)
      return new Promise((resolve, reject) => {
        resolve()
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
          downType: item.downType, // 下载方式 0：直接  1：压缩  2：拼接
          hasError: false,
          downHeaders: item.downHeaders,
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
    if (url) {
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
    return false
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
          const txtBlob = new Blob([item.imgurl], { type: 'text/plain' })
          zip.file(addZeroForNum(index + 1, this.imgIndexBitNum) + '.txt', txtBlob, { blob: true })
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

  async combineImages(workerId) {
    const maxSplicingHeight = getStorage('maxSplicingHeight')
    const { comicName, chapterName } = this.worker[workerId]
    let imgNum = 0
    let curHeight = 0
    let totalHeight = 0
    const saveImg = []

    async function asyncLoadImg(src) {
      return new Promise((resolve, reject) => {
        const img = document.createElement('img')
        img.onload = () => {
          resolve(img)
        }
        img.onerror = () => {
          const error = new Error(`图片加载失败，url：${src}`)
          console.log('combineImages-e: ', error)
          reject('')
        }
        img.src = src
      })
    }

    async function asyncCanvas(canvas, name) {
      return new Promise((resolve, reject) => {
        canvas.toBlob(async function(imgblob) {
          await _this.downloadFile(name, imgblob)
          resolve()
        }, 'image/jpeg', 0.8)
      })
    }

    for (let index = 0; index < this.workerDownInfo[workerId].length; index++) {
      const imgblob = this.workerDownInfo[workerId][index].blob
      if (imgblob === 1 || imgblob === 0) {
        continue
      }
      const newurl = window.URL.createObjectURL(imgblob)
      const image = await asyncLoadImg(newurl)
      if (image === '') {
        continue
      }
      if (totalHeight === 0) {
        const obj = { num: imgNum, width: image.width, height: image.height, img: [image] }
        curHeight = image.height
        totalHeight += image.height
        saveImg.push(obj)
        continue
      }
      if (curHeight + image.height > maxSplicingHeight) {
        const newobj = { num: ++imgNum, width: image.width, height: image.height, img: [image] }
        curHeight = image.height
        saveImg.push(newobj)
      } else {
        curHeight += image.height
        saveImg[imgNum].height += image.height
        saveImg[imgNum].img.push(image)
      }
      totalHeight += image.height
    }

    const _this = this

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    let offsetY = 0
    for (let i = 0; i < saveImg.length; i++) {
      const item = saveImg[i]
      canvas.width = item.width
      canvas.height = item.height
      offsetY = 0

      for (let len = 0; len < item.img.length; len++) {
        const element = item.img[len]
        context.drawImage(element, 0, offsetY, element.width, element.height)
        offsetY = offsetY + parseInt(element.height)
      }
      const name = comicName + '\\' + chapterName + '\\' + addZeroForNum(item.num + 1, this.imgIndexBitNum) + '.jpg'
      await asyncCanvas(canvas, name)
    }

    return new Promise((resolve, reject) => {
      resolve(true)
    })
  }
}
