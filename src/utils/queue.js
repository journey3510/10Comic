import JSZip from 'jszip'
// import axios from 'axios'
import { currentComics } from '@/utils/comics'
import { getHtml } from '@/utils/index'

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
  * executionFunc(index, item) {
    const _this = this
    yield this.downtest(index, item.name, item.url, item.time, item.imgs)
      .then(function() {
        // 任务执行完毕后，再次分配任务并执行任务

        setTimeout(() => {
          _this.worker[index] = undefined
          _this.workeredList.push(item.name)
          _this.run()
        }, 1000)
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

  addPromise(index, url, time) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = url
      img.setAttribute('crossOrigin', 'Anonymous')
      img.onload = () => {
        this.worker[index].currentnum = this.worker[index].currentnum + 1
        this.worker[index].progress = parseInt(this.worker[index].currentnum / this.worker[index].number * 100)
        this.worker.push('')
        this.worker.pop()

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        context.drawImage(img, 0, 0, img.width, img.height)
        canvas.toBlob(imgblob => {
          resolve(imgblob)
        })
      }
      img.onerror = () => {
        resolve(1)
      }
    })
  }

  downtest(workerId, name, url, time, imgs) {
    return new Promise((resolve) => {
      const que = []
      for (let i = 0; i < imgs.length; i++) {
        que.push(this.addPromise(workerId, imgs[i], time))
      }
      Promise.all(que).then(res => {
        console.log('res: ', res)
        const zip = new JSZip()

        res.forEach((imgblob, index) => {
          if (imgblob === 1) {
            return
          }
          zip.folder(name).file(index + '.jpg', imgblob, { blob: true })
        })

        zip.generateAsync({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: {
            level: 9
          }
        }).then((zipblob) => {
          resolve()
          return
          this.downloadFile(name, zipblob)
        })
      })
    })
  }

  // 分配并执行任务
  run() {
    if (this.statu !== 1) {
      return
    }
    const runIndex = []

    for (let i = 0; i < this.workerLen; i++) {
      const len = this.list.length

      if (!this.worker[i] && len > 0) {
        console.log('this.worker[i]: ', this.worker[i])
        const imgs = getHtml()

        // 需要执行的任务
        const worker = {
          name: this.list[len - 1].name,
          currentnum: 0,
          number: this.list[len - 1].imgs.length,
          imgs: imgs,
          progress: 0,
          func: this.executionFunc(i, this.list[len - 1])
        }
        this.worker[i] = worker

        runIndex.push(i)

        // 从任务队列内删除任务
        if (this.statu === 1) {
          this.list.pop()
          // return
        }
      }
    }

    // 执行任务
    for (const index of runIndex) {
      this.worker[index].func.next()
    }
  }
}
