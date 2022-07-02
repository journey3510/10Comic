import JSZip from 'jszip'
// import saveAs from 'file-saver'
import axios from 'axios'

const zip = new JSZip()

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
  * executionFunc(index, fn, ...args) {
    console.log('args: ', args)
    const _this = this
    yield this.downtest(index, args[1], args[3])
      .then(function() {
        // 任务执行完毕后，再次分配任务并执行任务
        _this.worker[index].xx = 100
        setTimeout(() => {
          _this.worker[index] = undefined
          _this.workeredList.push(args[3])
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

  downtest(id, time, name) {
    return new Promise((resolve) => {
      const _this = this
      let thenum = 0

      const pageTimer = setInterval(() => {
        thenum = thenum + 0.1
        _this.worker[id].xx = parseInt(thenum / time * 100)
        console.log('_this.worker[{$id}].xx: ', _this.worker[id].xx)
      }, 100)

      setTimeout(() => {
        clearInterval(pageTimer)
        resolve()
      }, (time + 1) * 1000)
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
        // 需要执行的任务
        const worker = {
          name: this.list[len - 1][4],
          number: 20,
          time: this.list[len - 1][3],
          xx: 4,
          func: this.executionFunc(i, ...this.list[len - 1])
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

//   zip.generateAsync({
//     type: 'blob',
//     compression: 'DEFLATE',
//     compressionOptions: {
//       level: 9
//     }
//   }).then((res) => {
//     console.log('压缩包: ', res)
//     saveAs(res, '压缩包.zip')
//   })
