
const comicsWebInfo = [
  {
    domain: 'www.kmwu6.com',
    homepage: 'http://www.kmwu6.com/',
    webName: '酷漫屋6',
    reg: /g/,
    chapterCssID: 'detail-list-select-1',
    getImgs: function(context) {
      const reg = /var km[^>]*_img_url='[^>]*'/gi
      const s1 = context.match(reg)
      const base64Context = s1[0].match(/'(\S*)'/)[1]
      let imgstr = window.atob(base64Context)
      // eslint-disable-next-line no-eval
      imgstr = eval(imgstr).toString()
      const imgArray = imgstr.match(/https:(\S*)jpg/g)
      return imgArray
    }
  },
  {
    domain: 'www.kmwu5.com',
    homepage: '',
    webName: '酷漫屋5',
    reg: /g/,
    chapterCssID: '',
    getImgs: function(context) {

    }
  }
]

export const getWebList = () => {
  const list = []
  comicsWebInfo.forEach(element => {
    list.push({
      name: element.webName,
      url: element.homepage
    })
  })
  return list
}

export let currentComics = null

export const matchWeb = (url) => {
  let hname = ''
  // let hname = window.location.host
  var domain = url.split('/')
  if (domain[2]) {
    hname = domain[2]
  } else {
    hname = ''
  }
  for (let i = 0; i < comicsWebInfo.length; i++) {
    if (comicsWebInfo[i].domain === hname) {
      currentComics = comicsWebInfo[i]
      break
    }
  }
  console.log('已匹配')
}

