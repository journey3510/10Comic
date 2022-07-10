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
    chapterCss: '#detail-list-select-1',
    type: 1,
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
    chapterCss: '.fed-play-item.fed-drop-item.fed-visible .fed-part-rows:nth-child(2)',
    type: 1,
    getImgs: async function(context) {
      const txtUrl = context.match(/http(\S*).txt/gi)[0]
      const txtRes = await request('get', txtUrl)
      const txtContext = txtRes.responseText
      const imgReg = /http(\S*)jpg/g
      return txtContext.match(imgReg)
    }
  },
  {
    domain: 'm.wuxiamh.com',
    homepage: 'https://m.wuxiamh.com/',
    webName: '武侠漫画',
    comicNameCss: '.view-sub.autoHeight .title',
    chapterCss: '#chapter-list-1',
    type: 0,
    nextpageRgeCss: '.action-list li:nth-child(3) a',
    getImgs: async function(context) {
      const imgobj = context.matchAll(/><mip-img src="(https:\/\/[\s\S]+?jpg)/g)
      const imgUrl = []
      for (const item of imgobj) {
        imgUrl.push(item[1])
      }

      const number = context.match(/<span id="k_total" class="curPage">(\d+)<\/span>/)[1]
      const context1 = context.match(/class="action-list">[\s\S]+?<mip-link href="(https:\/\/[\s\S]+?html)">下一页/g)[0]
      let nextPageUrl = context1.match(/http(\S*)html/g)[2]
      nextPageUrl = nextPageUrl.indexOf('-') !== -1 ? nextPageUrl : ''
      return { imgUrl, nextPageUrl, number }
    }
  },
  {
    domain: 'www.kawazhuyy.com',
    homepage: 'https://www.kawazhuyy.com/',
    webName: '土豪漫画',
    comicNameCss: '.cy_title',
    chapterCss: '#mh-chapter-list-ol-0',
    type: 1,
    getImgs: async function(context) {
      const context1 = context.match(/var (pages = [\s\S]+?)\<\/script>/g)[0]
      const imgReg = /url[\S]?(https:\/\/[\s\S]+?jpg)/g
      const imgobj = context1.matchAll(imgReg)
      const imgs = []
      for (const result of imgobj) {
        imgs.push(result[1])
      }
      return imgs
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
        eval(context.match(/(eval\([\s\S]+?)<\/script/)[1] + `newImgs.map(a => console.log(a)).join('\n')`)
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
  let hname = ''
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
}

