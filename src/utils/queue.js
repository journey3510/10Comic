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
  * exeDown(index) {
    const downtype = this.worker[index].type
    const name = this.worker[index].name
    const _this = this
    if (downtype === 1) {
      const imgs = this.worker[index].imgs
      // yield this.downAll(index, name, imgs)
      yield this.downOne(index, name, imgs)
        .then(function() {
          // 任务执行完毕后，再次分配任务并执行任务
          setTimeout(() => {
            _this.worker[index] = undefined
            _this.workeredList.push(name)
            _this.run()
          }, 500)
        })
    } else {
      yield this.downOne2(index)
        .then(function() {
          setTimeout(() => {
            _this.worker[index] = undefined
            _this.workeredList.push(name)
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
      // eslint-disable-next-line no-undef
      GM_xmlhttpRequest({
        method: 'get',
        url: imgurl,
        responseType: 'blob',
        onload: function(gmRes) {
          _this.worker[index].currentnum = _this.worker[index].currentnum + 1
          _this.worker[index].progress = parseInt(_this.worker[index].currentnum / _this.worker[index].number * 100)
          _this.refresh()
          resolve(gmRes.response)
        },
        onerror: function(e) {
          resolve(1)
        },
        ontimeout: function() {
          resolve(0)
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

        if (item.type === 1) {
          const worker = {
            name: item.name,
            currentnum: 0,
            number: 0,
            imgs: [],
            progress: 0,
            type: item.type,
            func: this.exeDown(i)
          }
          this.workerimg[i] = []
          this.worker[i] = worker

          this.list.pop()
          const imgs = await getHtml(item.url)
          this.worker[i].imgs = imgs
          this.worker[i].number = imgs.length
        } else {
          const worker = {
            name: item.name,
            currentnum: 0,
            number: 0,
            url: item.url,
            progress: 0,
            type: item.type,
            func: this.exeDown(i)
          }
          this.workerimg[i] = []
          this.worker[i] = worker
          this.list.pop()
        }
        runIndex.push(i)
      }
    }

    // 执行任务
    for (const index of runIndex) {
      this.worker[index].func.next()
    }
  }

  // 压缩
  async makeZip(workerId) {
    const name = this.worker[workerId].name
    return new Promise((resolve, reject) => {
      const zip = new JSZip()

      this.workerimg[workerId].forEach((imgblob, index) => {
        if (imgblob === 1 || imgblob === 0) {
          zip.file(parseInt(index + 1) + '.jpg', '', { blob: true })
          return
        }
        zip.file(parseInt(index + 1) + '.jpg', imgblob, { blob: true })
      })

      zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9
        }
      }).then((zipblob) => {
        this.downloadFile(name, zipblob)
        resolve()
        return
      })
    })
  }
}
