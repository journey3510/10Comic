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

export const getDataType = (obj) => {
  const type = typeof obj
  if (type !== 'object') {
    return type
  }
  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1')
}

export const getImage = async(url, isPay) => {
  try {
    let response = ''
    if (!currentComics.getComicInfo) {
      const data = await request({ method: 'get', url, useCookie: isPay })
      response = data.response
    }
    const imgs = await currentComics.getImgs(response, { url, isPay })
    return new Promise((resolve, reject) => {
      resolve(imgs)
    })
  } catch (error) {
    console.log('getImageError: ', error)
    return new Promise((resolve, reject) => {
      reject([])
    })
  }
}

export const request = async(...details) => {
  let method, url, data, responseType, timeout, useCookie, cookie
  if (details.length === 1) {
    ({ method, url, data, responseType, timeout, useCookie } = details[0])
    useCookie ? cookie = document.cookie : ''
  } else {
    method = details[0]
    url = details[1]
    data = details[2]
  }

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    GM_xmlhttpRequest({
      method,
      url,
      data: (data || null),
      responseType,
      timeout: (timeout || 15 * 1000),
      cookie: (cookie || ''),
      onload: function(res) {
        resolve(res)
      },
      onerror: function(e) {
        reject('onerror')
      },
      ontimeout: function() {
        reject('timeout')
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

export const funstrToData = (str, reg) => {
  const group = str.matchAll(reg)
  const func = []
  for (const item of group) {
    func.push(item[1])
    func.push(item[2])
  }
  const code = '(' + func[0] + ')' + func[1]
  // eslint-disable-next-line no-eval
  const data = eval(code)
  return data
}

