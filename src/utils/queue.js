import JSZip from 'jszip'
// import { currentComics } from '@/utils/comics'
import { getHtml } from '@/utils/index'

//
export default class Queue {
  constructor(workerLen) {
    this.workerLen = workerLen || 3 // 同时执行的任务数
    this.list = [] // 任务队列
    this.workeredList = [] // 已完成的任务
    this.statu = 1 // 执行状态
    this.worker = new Array(this.workerLen) // 正在执行的任务
    this.workerimg = new Array(this.workerLen) // 存储下载的图片数据
  }

  pause() {
    this.statu = 0
  }

  downloadFile(fileName, content) {
    const a = document.createElement('a')
    const url = window.URL.createObjectURL(content)
    a.href = url
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(url)
  }

  start() {
    this.statu = 1
    console.log(this.statu)
  }

  /**
     * 执行一个任务
     * @param { number } index
     * @param { Function } fn: 执行的函数
     * @param { Array<any> } args: 传递给执行函数的参数
     */
  * exeDown(index) {
    const name = this.worker[index].name
    const imgs = this.worker[index].imgs
    const _this = this
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
  }

  * exeDown2(index) {
    const name = this.worker[index].name

    const _this = this
    yield this.downOne2(index)
      .then(function() {
        setTimeout(() => {
          _this.worker[index] = undefined
          _this.workeredList.push(name)
          _this.run()
        }, 500)
      })
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

  // 请求图片
  addImgPromise(index, imgurl) {
    return new Promise((resolve, reject) => {
      const _this = this
      // eslint-disable-next-line no-undef
      GM_xmlhttpRequest({
        method: 'get',
        url: imgurl,
        responseType: 'blob',
        onload: function(gmres) {
          _this.worker[index].currentnum = _this.worker[index].currentnum + 1
          _this.worker[index].progress = parseInt(_this.worker[index].currentnum / _this.worker[index].number * 100)
          _this.worker.push('')
          _this.worker.pop()

          resolve(gmres.response)
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

  async downOne2(workerId) {
    console.log(1111111111111111)
    const url = this.worker[workerId].url
    const { imgUrl, nextPageUrl, number } = await getHtml(url)
    this.worker[workerId].number = number
    console.log('imgUrl: ', imgUrl)
    for (let index = 0; index < imgUrl.length; index++) {
      const res = await this.addImgPromise(workerId, imgUrl[index])
      this.workerimg[workerId].push(res)
    }

    if (nextPageUrl !== '') {
      this.worker[workerId].url = nextPageUrl
      return this.downOne2(workerId)
    }

    const zip = new JSZip()
    this.workerimg[workerId].forEach((imgblob, index) => {
      if (imgblob === 1) {
        return
      }
      zip.file(parseInt(index + 1) + '.jpg', imgblob, { blob: true })
    })
    console.log('zip: ', zip)

    return new Promise((resolve, reject) => {
      const name = this.worker[workerId].name
      zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9
        }
      }).then((zipblob) => {
        console.log('下载zipblob: ', zipblob)
        this.downloadFile(name, zipblob)
        resolve()
        return
      })
    })
  }

  // 请求一张图片得到后 再请求下一张图片
  async downOne(workerId) {
    const imgs = this.worker[workerId].imgs
    const res = await this.addImgPromise(workerId, imgs[0])
    this.workerimg[workerId].push(res)
    this.worker[workerId].imgs.shift()

    if (this.worker[workerId].imgs.length > 0) {
      return this.downOne(workerId)
    }
    const zip = new JSZip()
    this.workerimg[workerId].forEach((imgblob, index) => {
      if (imgblob === 1) {
        return
      }
      zip.file(parseInt(index + 1) + '.jpg', imgblob, { blob: true })
    })
    console.log('zip: ', zip)

    return new Promise((resolve, reject) => {
      const name = this.worker[workerId].name
      zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9
        }
      }).then((zipblob) => {
        console.log('下载zipblob: ', zipblob)
        this.downloadFile(name, zipblob)
        resolve()
        return
      })
    })
  }

  // ___________________________________________________ //
  // ___________________________________________________ //

  // 一次请求所有图片
  downAll(workerId, name, imgs) {
    return new Promise((resolve) => {
      const que = []
      for (let i = 0; i < imgs.length; i++) {
        que.push(this.addImgPromise(workerId, imgs[i]))
      }
      Promise.all(que).then(res => {
        console.log('allres: ', res)

        const zip = new JSZip()
        res.forEach((imgblob, index) => {
          if (imgblob === 1) {
            return
          }
          zip.file(parseInt(index + 1) + '.jpg', imgblob, { blob: true })
        })
        console.log('zip: ', zip)

        zip.generateAsync({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: {
            level: 9
          }
        }).then((zipblob) => {
          console.log('下载zipblob: ', zipblob)
          this.downloadFile(name, zipblob)
          resolve()
          return
        })
      })
    })
  }

  // 分配并执行任务
  async run() {
    if (this.statu !== 1) {
      return
    }
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
          // 从任务队列内删除任务
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
            func: this.exeDown2(i)
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

  async makeZip(res) {
    return new Promise((resolve, reject) => {
      const zip = new JSZip()
      res.forEach((imgblob, index) => {
        if (imgblob === 1) {
          return
        }
        zip.file(parseInt(index + 1) + '.jpg', imgblob, { blob: true })
      })
      console.log('zip: ', zip)

      zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9
        }
      }).then((zipblob) => {
        console.log('下载zipblob: ', zipblob)
        this.downloadFile(name, zipblob)
        resolve()
        return
      })
    })
  }
}
