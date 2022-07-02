import axios from 'axios'

// import { Base64 } from 'js-base64'
/**
 * load style file
 * @param {String} url
 */
export const loadStyle = (url) => {
  const head = document.getElementsByTagName('head')[0]
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.href = url
  link.media = 'all'
  head.appendChild(link)
}

// 下载
export const down = (id, time, name) => {
  console.log('开始id', id)
  return new Promise((resolve) => {
    setTimeout(() => {
      axios({
        method: 'get',
        url: 'https://i1.hdslb.com/bfs/face/a400ed7897693fca5c3537e9ba1f7791edd21d40.jpg@100Q.webp',
        responseType: 'blob'
      })
        .then(function(response) {
          console.log('结束id', id)
          // console.log('response: ', response)
          resolve()
        })
    }, time * 1000)
  })
}

export const downtest = (id, time, name) => {
  console.log('开始id', id)
  return new Promise((resolve) => {
    let thenum = 0
    setInterval(() => {
      thenum++
    }, 1000)
    setTimeout(() => {
      resolve()
    }, time * 1000)
  })
}

export const getChapterLinks = (url) => {

}

export const getHtml = (url) => {
  console.log('url: ', url)
  // responseType: 'text/html'
  axios({
    method: 'get',
    url: url
  })
    .then(function(res) {
      // console.log(res.data)
      getImg(res.data)
      // console.log('response: ', response)
      // resolve()
    })
}

const getImg = (context) => {

}

