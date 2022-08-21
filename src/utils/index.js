import { currentComics } from '@/utils/comics'

export const loadStyle = (url, name, text) => {
  const head = document.getElementsByTagName('head')[0]
  const style = document.createElement('style')
  style.name = name
  style.id = name
  style.innerText = text
  head.appendChild(style)
}

export const loadStyle2 = (url) => {
  return new Promise((resolve, reject) => {
    const head = document.getElementsByTagName('head')[0]
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = url
    link.media = 'all'
    head.appendChild(link)
    setTimeout(() => {
      resolve(true)
    }, 1200)
  })
}

export const getImage = async(url) => {
  const { response } = await request('get', url)
  try {
    const imgs = await currentComics.getImgs(response)
    return new Promise((resolve, reject) => {
      resolve(imgs)
    })
  } catch (error) {
    console.log('error: ', error)
    return new Promise((resolve, reject) => {
      reject([])
    })
  }
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
        console.log('超时')
      }
    })
  })
}

export const downFile = async(url, name) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    GM_download({
      url,
      name,
      onload: result => {
        resolve(true)
      },
      onerror: result => {
        resolve(false)
      },
      ontimeout: result => {
        resolve(false)
      }
    })
  })
}

export const addZeroForNum = (num, bitNum) => {
  let newNum = num + ''
  if (newNum.length < bitNum) {
    const zeroStr = new Array(bitNum + 1).join('0')
    newNum = zeroStr + newNum
    newNum = newNum.slice(-bitNum)
    return newNum
  }
  return newNum
}

export const parseToDOM = (str) => {
  var div = document.createElement('div')
  if (typeof str === 'string') {
    div.innerHTML = str
  }
  return div
}
