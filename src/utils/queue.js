import JSZip from 'jszip'
import { getHtml } from '@/utils/index'

// 多个任务并行执行的队列
// https://juejin.cn/post/6844903961728647181

export default class Queue {
  constructor(workerLen) {
    this.workerLen = workerLen || 3 // 同时执行的任务数
    this.list = [] // 任务队列
    this.workeredList = [] // 已完成的任务
    this.worker = new Array(this.workerLen) // 正在执行的任务
    this.workerimg = new Array(this.workerLen) // 存储下载的图片数据
  }

  downloadFile(fileName, content) {
    const a = document.createElement('a')
    const url = window.URL.createObjectURL(content)
    a.href = url
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(url)
  }

  /**
     * 执行一个任务
     * @param { number } index
     */
  async * exeDown(index) {
    const downtype = this.worker[index].type
    const chapterName = this.worker[index].chapterName
    const _this = this
    if (downtype === 1) {
      const url = this.worker[index].url
      const imgs = await getHtml(url)
      this.worker[index].imgs = imgs
      this.worker[index].number = imgs.length

      // yield this.downAll(index, chapterName, imgs)
      yield this.downOne(index, chapterName, imgs)
        .then(function() {
          // 任务执行完毕后，再次分配任务并执行任务
          setTimeout(() => {
            _this.worker[index] = undefined
            _this.workeredList.push(chapterName)
            _this.run()
          }, 500)
        })
    } else {
      yield this.downOne2(index)
        .then(function() {
          setTimeout(() => {
            _this.worker[index] = undefined
            _this.workeredList.push(chapterName)
            _this.run()
          }, 500)
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
    this.worker.push('')
    this.worker.pop()
  }

  // 请求图片
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
          console.log('gmRes: ', gmRes)
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

  // 网站单页阅读方式  下载
  async downOne2(workerId) {
    const url = this.worker[workerId].url
    const { imgUrl, nextPageUrl, number } = await getHtml(url)
    this.worker[workerId].number = number
    for (let index = 0; index < imgUrl.length; index++) {
      const res = await this.addImgPromise(workerId, imgUrl[index])
      this.workerimg[workerId].push(res)
    }

    if (nextPageUrl !== '') {
      this.worker[workerId].url = nextPageUrl
      return this.downOne2(workerId)
    }

    const result = await this.makeZip(workerId)
    return new Promise((resolve, reject) => {
      resolve(result)
    })
  }

  // 网站卷轴阅读方式  下载
  async downOne(workerId) {
    const imgs = this.worker[workerId].imgs
    const res = await this.addImgPromise(workerId, imgs[0])

    this.workerimg[workerId].push(res)
    this.worker[workerId].imgs.shift()

    if (this.worker[workerId].imgs.length > 0) {
      return this.downOne(workerId)
    }

    const result = await this.makeZip(workerId)
    return new Promise((resolve, reject) => {
      resolve(result)
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
          func: this.exeDown(i)
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
        this.downloadFile(comicName + '_' + chapterName, zipblob)
        resolve()
        return
      })
    })
  }
}
