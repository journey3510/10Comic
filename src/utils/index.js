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

export const getImage = async(processData) => {
  try {
    const url = processData.url
    console.log('url: ', url)
    let response = ''
    // 获取网页内容
    if (!currentComics.getComicInfo) {
      const data = await request({ method: 'get', url, useCookie: processData.isPay })
      response = data.response
    }
    const imgs = await currentComics.getImgs(response, processData)
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
  const headers = currentComics.headers
  let method, url, data, newHeaders, responseType, timeout, useCookie, cookie, onload, onerror, ontimeout
  if (details.length === 1) {
    ({ method, url, data, newHeaders, responseType, timeout, useCookie, onload, onerror, ontimeout } = details[0])
    useCookie ? cookie = document.cookie : ''
  } else {
    method = details[0]
    url = details[1]
    data = details[2]
  }
  if (url === null || url === '') {
    return new Promise((resolve, reject) => {
      resolve('')
    })
  }

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    GM_xmlhttpRequest({
      method,
      url,
      headers: (newHeaders || headers || ''),
      data: (data || null),
      responseType,
      timeout: (timeout || 15 * 1000),
      cookie: (cookie || ''),
      onload: (onload || function(res) {
        resolve(res)
      }),
      onerror: (onerror || function(e) {
        reject('onerror')
      }),
      ontimeout: (ontimeout || function() {
        reject('timeout')
      })
    })
  })
}

export const downFile = async(...detail) => {
  let url, name, headers, onload, onerror, ontimeout
  if (detail.length === 1) {
    ({ url, name, headers, onload, onerror, ontimeout } = detail[0])
  } else {
    url = detail[0]
    name = detail[1]
  }

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    GM_download({
      url,
      name,
      headers: headers,
      onload: (onload || function(res) {
        resolve(true)
      }),
      onerror: (onerror || function(e) {
        console.log('onerror: ', onerror)
        resolve(false)
      }),
      ontimeout: (ontimeout || function() {
        resolve(false)
      })
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
  if (!func[1]) {
    func[1] = '()'
  }
  const code = '(' + func[0] + ')' + func[1]
  // eslint-disable-next-line no-eval
  const data = eval(code)
  return data
}

