/* eslint-disable no-undef */
/* eslint-disable no-empty */
/* eslint-disable no-eval */

import { request } from '@/utils/index'

const comicsWebInfo = [
  {
    domain: 'manhua.dmzj.com',
    homepage: 'https://manhua.dmzj.com/',
    webName: '动漫之家',
    comicNameCss: '.odd_anim_title_m .anim_title_text h1',
    chapterCss: '.cartoon_online_border',
    type: 1,
    getImgs: async function(context) {
      const group = context.matchAll(/(function[\s\S]+?return \S})(\([\s\S]+?{}\))/g)
      const func = []
      for (const item of group) {
        func.push(item[1])
        func.push(item[2])
      }
      const code = '(' + func[0] + ')' + func[1]
      let imgStr = eval(code)
      imgStr = imgStr.match(/\[[\s\S]+?\]/)[0]
      let imgArray = JSON.parse(imgStr)
      if (imgArray[0].search('http') === -1) {
        imgArray = imgArray.map((item) => {
          return 'https://images.dmzj.com/' + item
        })
      }
      return imgArray
    }
  }, {
    domain: 'www.dmzj.com',
    homepage: 'https://www.dmzj.com/',
    webName: '动漫之家2',
    comicNameCss: '.comic_deCon h1 a',
    chapterCss: '.list_con_li.autoHeight',
    type: 1,
    getImgs: async function(context) {
      const group = context.matchAll(/(function[\s\S]+?return \S})(\([\s\S]+?{}\))/g)
      const func = []
      for (const item of group) {
        func.push(item[1])
        func.push(item[2])
      }
      console.log('func: ', func)
      const code = '(' + func[0] + ')' + func[1]
      let imgStr = eval(code)
      console.log('imgStr: ', imgStr)
      imgStr = imgStr.match(/\[[\s\S]+?\]/)[0]
      let imgArray = JSON.parse(imgStr)
      if (imgArray[0].search('http') === -1) {
        imgArray = imgArray.map((item) => {
          return 'https://images.dmzj.com/' + item
        })
      }
      return imgArray
    }
  },
  {
    domain: 'www.kumw5.com',
    homepage: 'http://www.kumw5.com/',
    webName: '酷漫屋',
    comicNameCss: '.info h1',
    chapterCss: '#detail-list-select-1',
    type: 1,
    getImgs: function(context) {
      const reg = /var km[^>]*_img_url='[^>]*'/gi
      const s1 = context.match(reg)
      const base64Context = s1[0].match(/'(\S*)'/)[1]
      let imgstr = window.atob(base64Context)
      imgstr = eval(imgstr).toString()
      const imgArray = imgstr.matchAll(/(http[\s\S]+?),/g)
      const imgUrl = []
      for (const item of imgArray) {
        imgUrl.push(item[1])
      }
      return imgUrl
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
    webName: '武侠漫画（手机）',
    comicNameCss: '.view-sub.autoHeight .title',
    chapterCss: '#chapter-list-1',
    type: 0,
    nextpageRgeCss: '.action-list li:nth-child(3) a',
    getImgs: async function(context) {
      const imgobj = context.matchAll(/><mip-img src="(https:\/\/[\s\S]+?(jpg|webp))/g)
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
    domain: 'www.wuxiamh.com',
    homepage: 'https://www.wuxiamh.com/',
    webName: '武侠漫画网（电脑）',
    comicNameCss: '.title h1',
    chapterCss: '#chapter-list-1',
    type: 1,
    getImgs: async function(context) {
      const imgStr = context.match(/var chapterImages = ([[\s\S]+?])[\s\S]+?var chapterPath/)[1]
      const imgs = eval(imgStr)
      return imgs
    }

  },
  {
    domain: 'qiximh1.com',
    homepage: 'http://qiximh1.com',
    webName: '七夕漫画',
    comicNameCss: '.comic_name .name',
    chapterCss: '.catalog_list.row_catalog_list',
    type: 1,
    getImgs: function(context) {
      const group = context.matchAll(/(function[\s\S]+?return \S})(\([\s\S]+?{}\))/g)
      const func = []
      for (const item of group) {
        func.push(item[1])
        func.push(item[2])
      }
      const code = '(' + func[0] + ')' + func[1]
      let imgStr = eval(code)
      imgStr = imgStr.match(/\[[\s\S]+?\]/)[0]
      const imgArray = JSON.parse(imgStr)
      return imgArray
    }
  },
  {
    domain: 'www.36manga.com',
    homepage: 'https://www.36manga.com/',
    webName: '36漫画网',
    comicNameCss: '.book-title h1 span',
    chapterCss: '#chapter-list-4 li:not(:first-of-type)',
    type: 1,
    getImgs: function(context) {
      const group = context.matchAll(/chapterImages = ([\s\S]+?);var chapterPath = "([\s\S]+?)";var chapterPrice/g)
      let imgarr = []
      let middleStr = ''
      for (const item of group) {
        imgarr = JSON.parse(item[1])
        middleStr = item[2]
      }
      if (imgarr[0].search('http') === -1) {
        imgarr = imgarr.map((item) => {
          return 'https://img001.arc-theday.com/' + middleStr + item
        })
      }
      return imgarr
    }
  },
  {
    domain: 'www.gufengmanhua.com',
    homepage: 'https://www.gufengmanhua.com/',
    webName: '古风漫画网',
    comicNameCss: '.book-title h1 span',
    chapterCss: '#chapter-list-1,#chapter-list-10',
    type: 1,
    getImgs: function(context) {
      const imgStr = context.match(/chapterImages = ([\s\S]+?);var chapterPath/)[1]
      let imgarr = JSON.parse(imgStr)
      if (imgarr[0].search('http') === -1) {
        imgarr = imgarr.map((item) => {
          return 'https://res5.gufengmanhua.com' + item
        })
      }
      return imgarr
    }
  },
  {
    domain: 'www.123gf.com',
    homepage: 'https://www.123gf.com/',
    webName: '古风漫画网 2',
    comicNameCss: '.book-title h1 span',
    chapterCss: '#chapter-list-1,#chapter-list-10',
    type: 1,
    readCssText: '.img_info {display: none;}.tbCenter img {border: 0px;}',
    getImgs: async function(context) {
      const group = context.matchAll(/chapterImages = (.*?);var chapterPath = "(.*?)"/g)
      const strArr = []
      for (const item of group) {
        strArr.push(item[1])
        strArr.push(item[2])
      }
      const josnRes = await request('get', this.homepage + 'js/config.js')
      const josnContext = josnRes.responseText
      const imageDomian = josnContext.match(/"domain":\["(.*?)"]/)[1]
      let imgarr = JSON.parse(strArr[0])
      if (imgarr[0].search('http') === -1) {
        imgarr = imgarr.map((item) => {
          return imageDomian + '/' + strArr[1] + item
        })
      }
      return imgarr
    }
  },
  {
    domain: 'ac.qq.com',
    homepage: 'https://ac.qq.com/',
    webName: '腾讯漫画',
    comicNameCss: '.works-intro-title.ui-left strong',
    chapterCss: '.chapter-page-all.works-chapter-list',
    type: 1,
    hasSpend: true,
    freeCss: '.ui-icon-free',
    payCss: '.ui-icon-pay',
    getImgs: function(context) {
      let nonce = context.match(/<script>\s*window.*?=(.*?)?;/)[1]
      nonce = eval(nonce)
      const dataStr = context.match(/DATA.*?'(.*)?'/)[1]
      const data = dataStr.split('')
      nonce = nonce.match(/\d+[a-zA-Z]+/g)
      let len = nonce.length
      let locate = null
      let str = ''
      while (len--) {
        locate = parseInt(nonce[len]) & 255
        str = nonce[len].replace(/\d+/g, '')
        data.splice(locate, str.length)
      }
      const chapterStr = data.join('')
      const chapterObj = JSON.parse(window.atob(chapterStr))
      const imgarr = []
      chapterObj.picture.forEach(element => {
        imgarr.push(element.url)
      })
      return imgarr
    }
  },
  {
    domain: 'www.mhxqiu1.com',
    homepage: 'http://www.mhxqiu1.com/',
    webName: '漫画星球',
    comicNameCss: '.cy_title h1',
    chapterCss: '.cy_plist #mh-chapter-list-ol-0',
    type: 1,
    getImgs: function(context) {
      const group = context.matchAll(/(function.*?return \S})(\(.*?{}\))/g)
      const func = []
      for (const item of group) {
        func.push(item[1])
        func.push(item[2])
      }
      const code = '(' + func[0] + ')' + func[1]
      let imgStr = eval(code)
      imgStr = imgStr.match(/\[[\s\S]+?\]/)[0]
      const imgArray = JSON.parse(imgStr)
      return imgArray
    }
  },
  {
    domain: 'www.haoman8.com',
    homepage: 'https://www.haoman8.com/',
    webName: '好漫8',
    comicNameCss: '.content .title',
    chapterCss: '#j_chapter_list',
    type: 1,
    getImgs: function(context) {
      const group = context.matchAll(/data-echo="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  },
  {
    domain: 'www.mh5.org',
    homepage: 'https://www.mh5.org/',
    webName: '漫画屋',
    comicNameCss: '.comic-title.j-comic-title',
    chapterCss: '.chapter__list-box.clearfix',
    type: 1,
    getImgs: function(context) {
      const group = context.matchAll(/data-original="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  },
  {
    domain: 'www.2mzx.com',
    homepage: 'https://www.2mzx.com/',
    webName: '27漫画网',
    comicNameCss: '.bar .position strong',
    chapterCss: '#play_0 #chapter-list-1',
    type: 1,
    getImgs: async function(context) {
      const imgStr = context.match(/var chapterImages = ([[\s\S]+?])[\s\S]+?var chapterPath/)[1]
      const imgs = eval(imgStr)
      return imgs
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

