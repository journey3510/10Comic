import axios from 'axios'

import { currentComics } from '@/utils/comics'

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

export const getHtml = async(url) => {
  console.log('url: ', url)
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url
    })
    // responseType: 'text/html'
      .then(function(res) {
        // console.log(res.data)
        const imgs = currentComics.getImgs(res.data)
        console.log('imgs: ', imgs)
        resolve(imgs)
      })
  })
}

export const request = async(method, url, responseType) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    GM_xmlhttpRequest({
      method,
      url,
      responseType,
      onload: function(res) {
        resolve(res)
      },
      onerror: function(e) {
        reject(e)
      },
      ontimeout: function() {
        console.log()
      }
    })
  })
}
