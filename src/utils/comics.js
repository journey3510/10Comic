/* eslint-disable no-undef */
/* eslint-disable no-empty */
/* eslint-disable no-eval */
import { request } from '@/utils/index'

const comicsWebInfo = [
  {
    domain: 'www.kmwu6.com',
    homepage: 'http://www.kmwu6.com/',
    webName: '酷漫屋6',
    comicNameCss: '.info h1',
    reg: /g/,
    chapterCss: '#detail-list-select-1',
    getImgs: function(context) {
      const reg = /var km[^>]*_img_url='[^>]*'/gi
      const s1 = context.match(reg)
      const base64Context = s1[0].match(/'(\S*)'/)[1]
      let imgstr = window.atob(base64Context)
      imgstr = eval(imgstr).toString()
      const imgArray = imgstr.match(/https:(\S*)jpg/g)
      return imgArray
    }
  },
  {
    domain: 'darpou.com',
    homepage: 'https://darpou.com/',
    webName: '百漫谷',
    comicNameCss: '.fed-part-eone.fed-font-xvi a',
    reg: /g/,
    chapterCss: '.fed-play-item.fed-drop-item.fed-visible .fed-part-rows:nth-child(2)',
    getImgs: async function(context) {
      const txtUrl = context.match(/http(\S*).txt/gi)[0]
      const txtRes = await request('get', txtUrl)
      const txtContext = txtRes.responseText
      const imgReg = /http(\S*)jpg/g
      return txtContext.match(imgReg)
    }
  },
  {
    domain: 'qiximh1.com',
    homepage: 'http://qiximh1.com',
    webName: '七夕漫画',
    comicNameCss: '.comic_name .name',
    reg: /g/,
    chapterCss: '.catalog_list.row_catalog_list',
    getImgs: function(context) {
      // console.log('context: ', context)

      try {
        const newImgs = []
        console.log(9999999999999)
        eval(context.match(/(eval\([\s\S]+?)<\/script/)[1] + `newImgs.map(a => console.log(a)).join('\n')`)

        // console.log('newImgs: ', newImgs)
        return newImgs
      } catch (e) {
        console.log('e: ', e)
      }
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
  console.log('url: ', url)
  let hname = ''
  // let hname = window.location.host
  var domain = url.split('/')
  if (domain[2]) {
    hname = domain[2]
  } else {
    hname = ''
  }
  console.log('hname: ', hname)
  for (let i = 0; i < comicsWebInfo.length; i++) {
    if (comicsWebInfo[i].domain === hname) {
      currentComics = comicsWebInfo[i]
      break
    }
  }
  console.log('currentComics: ', currentComics)
}

