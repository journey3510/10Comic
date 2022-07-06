import JSZip from 'jszip'
import axios from 'axios'
// import { currentComics } from '@/utils/comics'
import { getHtml, request } from '@/utils/index'

//
export default class Queue {
  constructor(workerLen) {
    this.workerLen = workerLen || 3 // 同时执行的任务数
    this.list = [] // 任务队列
    this.workeredList = [] // 已完成的任务
    this.statu = 1 // 执行状态
    this.worker = new Array(this.workerLen) // 正在执行的任务
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
  * executionFunc(index) {
    const name = this.worker[index].name
    const imgs = this.worker[index].imgs
    const _this = this
    yield this.downtest(index, name, imgs)
      .then(function() {
        // 任务执行完毕后，再次分配任务并执行任务
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

  addPromise(index, imgurl) {
    return new Promise((resolve, reject) => {
      const _this = this
      // eslint-disable-next-line no-undef
      GM_xmlhttpRequest({
        method: 'get',
        url: imgurl,
        responseType: 'blob',
        onload: function(gmres) {
          // console.log(this)
          _this.worker[index].currentnum = _this.worker[index].currentnum + 1
          _this.worker[index].progress = parseInt(_this.worker[index].currentnum / _this.worker[index].number * 100)
          _this.worker.push('')
          _this.worker.pop()

          resolve(gmres.response)
        },
        onerror: function(e) {
          resolve(1)

          console.log(e)
        },
        ontimeout: function() {
          resolve(1)

          console.log()
        }
      })
    })
  }

  async downx(workerId, name, imgs) {
    const que = []
    const imgaa = imgs
    if (imgaa.length > 0) {
      const res = await request('get', imgs[0], 'blob')
    }
    for (let i = 0; i < imgs.length; i++) {
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

        return
        this.downloadFile(name, zipblob)
      })
    })
  }

  downtest(workerId, name, imgs) {
    return new Promise((resolve) => {
      const que = []
      for (let i = 0; i < imgs.length; i++) {
        que.push(this.addPromise(workerId, imgs[i]))
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
          resolve()
          return
          this.downloadFile(name, zipblob)
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
        console.log(4444444444444444)

        // 需要执行的任务
        const worker = {
          name: this.list[len - 1].name,
          currentnum: 0,
          number: 0,
          imgs: [],
          progress: 0,
          func: this.executionFunc(i)
        }
        // 从任务队列内删除任务
        const url = this.list[len - 1].url
        if (this.statu === 1) {
          this.list.pop()
          // return
        }
        this.worker[i] = worker

        const imgs = await getHtml(url)
        console.log('imgs: ', imgs)
        this.worker[i].imgs = imgs
        this.worker[i].number = imgs.length

        runIndex.push(i)
      }
    }

    // 执行任务
    for (const index of runIndex) {
      this.worker[index].func.next()
    }
  }
}
