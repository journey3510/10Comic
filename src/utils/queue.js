import JSZip from 'jszip'
import axios from 'axios'
// import { currentComics } from '@/utils/comics'
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
  * executionFunc(index) {
    const name = this.worker[index].name
    const imgs = this.worker[index].imgs
    // const imgs = [
    //   'https://i0.hdslb.com/bfs/album/bd8e36b1f93e4efb51ae1544a04b8d2eb559819d.jpg@1139w.webp',
    //   'https://i0.hdslb.com/bfs/album/4fe2af34cae57a5cb742fee6c1a647237188c298.jpg@1139w.webp']

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
      const img = new Image()
      img.src = imgurl
      //  + '?time=' + new Date().valueOf()

      img.setAttribute('crossOrigin', 'Anonymous')

      img.onload = () => {
        this.worker[index].currentnum = this.worker[index].currentnum + 1
        this.worker[index].progress = parseInt(this.worker[index].currentnum / this.worker[index].number * 100)
        this.worker.push('')
        this.worker.pop()

        resolve(img)

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
        this.worker[index].currentnum = this.worker[index].currentnum + 1
        this.worker[index].progress = parseInt(this.worker[index].currentnum / this.worker[index].number * 100)
        this.worker.push('')
        this.worker.pop()
        console.log('img: ', img)
        img.removeAttribute('crossOrigin')

        const dom = document.getElementById('xxxxxxxxxxxxx')
        // dom.innerHTML = img
        // const img = document.createElement('img')
        // img.src = imgurl

        dom.appendChild(img)

        resolve(img)

        // const canvas = document.createElement('canvas')
        // const context = canvas.getContext('2d')
        // canvas.width = img.width
        // canvas.height = img.height
        // context.drawImage(img, 0, 0, img.width, img.height)
        // canvas.toBlob(imgblob => {
        //   resolve(imgblob)
        // })
      }

      // axios({
      //   method: 'get',
      //   url: imgurl
      // })
      // // responseType: 'blob'
      // // responseType: 'text/html'
      //   .then(function(res) {
      //     console.log(res)
      //     resolve()
      //     // const imgs = currentComics.getImgs(res.data)
      //     // console.log('imgs: ', imgs)
      //     // resolve(imgs)
      //   })
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
          zip.file(index + '.jpg', imgblob, { blob: true })
        })
        console.log('zip: ', zip)

        zip.generateAsync({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: {
            level: 9
          }
        }).then((zipblob) => {
          console.log('zipblob: ', zipblob)
          // return
          // this.downloadFile(name, zipblob)
          resolve()
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
        console.log('this.worker[i]: ', this.worker[i])
        const imgs = await getHtml(this.list[len - 1].url)
        // console.log('imgs: ', imgs)

        // 需要执行的任务
        const worker = {
          name: this.list[len - 1].name,
          currentnum: 0,
          number: imgs.length,
          imgs: imgs,
          progress: 0,
          func: this.executionFunc(i)
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
