import axios from 'axios'

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

export const setValue = (key, val) => {
  GM_setValue(key, val)
}

