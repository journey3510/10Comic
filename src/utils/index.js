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

export const request = async function request(...details) {
  let method, url, data, headers, responseType, timeout, useCookie, cookie, onload, onerror, ontimeout, tail
  // 只有一个参数
  if (details.length === 1) {
    ({ method, url, data, headers, responseType, timeout, useCookie, onload, onerror, ontimeout } = details[0])
    useCookie ? cookie = document.cookie : ''
  } else { // 含多个参数时 [*method, *url, data, headers]
    [method, url, ...tail] = details
    if (tail) {
      tail.length > 0 ? (data = tail[0]) : ''
      tail.length > 1 ? (headers = tail[1]) : ''
    }
  }

  // 设置currentComics中的 headers
  if (!headers && currentComics !== null) {
    headers = currentComics.headers
  }

  // 无效地址
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
      headers: (headers || ''),
      data: (data || null),
      responseType,
      timeout: (timeout || 30 * 1000),
      cookie: (cookie || ''),
      onload: (onload || function(res) {
        resolve(res)
      }),
      onerror: (onerror || function(e) {
        resolve('onerror')
      }),
      ontimeout: (ontimeout || function() {
        console.log('ontimeout: ', ontimeout)
        resolve('timeout')
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
  name = name.replace(/\s+/ig, ' ')

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

export const funstrToData = function funstrToData(str, reg) {
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

