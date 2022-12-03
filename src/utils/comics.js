/* eslint-disable no-undef */
/* eslint-disable no-empty */
/* eslint-disable no-eval */

import { request, parseToDOM, funstrToData } from '@/utils/index'
import { getStorage } from '@/config/setup'

export const searchFunTemplate_1 = async(data, keyword) => {
  // eslint-disable-next-line prefer-const
  let { search_add_url, search_pre, alllist_dom_css, minlist_dom_css, namelink_index, img_src, use_background } = data.searchTemplate_1
  namelink_index ? namelink_index-- : namelink_index = 0
  let searchUrl = ''
  if (search_pre) {
    searchUrl = search_pre + search_add_url + keyword
  } else {
    searchUrl = data.homepage + search_add_url + keyword
  }
  let headers = ''
  data.headers ? headers = data.headers : ''
  // 调试使用
  // data.webName === '' ? console.log('') : ''
  const { responseText } = await request({ method: 'get', url: searchUrl, data: '', headers })
  const dom = parseToDOM(responseText).querySelector(alllist_dom_css)

  const domList = dom.querySelectorAll(minlist_dom_css)
  const searchList = []
  domList.forEach(element => {
    const obj = {}
    try {
      obj.name = element.querySelector('a').title
      const pathname = element.querySelector('a').pathname
      obj.url = data.homepage + pathname.slice(1, pathname.length)
      // 获取封面图片地址
      if (!use_background) {
        const reg2 = eval('/' + img_src + `=('|")(.*?)('|")` + '/')
        obj.imageUrl = element.innerHTML.match(reg2)[2]
        // obj.imageUrl = element.querySelector('img').getAttribute(img_src)
      } else {
        obj.imageUrl = element.innerHTML.match(/background.*?(url)\('?(.*?)'?\)/)[2]
      }

      // 名称修正？
      if (obj.name === '') {
        let titleArr = element.innerHTML.match(/title=('|")(.*?)('|")/);

        (titleArr && titleArr.length >= 2) ? (obj.name = titleArr[2])
          : (titleArr = element.innerHTML.match(/alt=('|")(.*?)('|")/),
          (titleArr && titleArr.length >= 2) ? obj.name = titleArr[2] : '')
        // 文本 name  innerText
        obj.name === '' ? obj.name = element.querySelectorAll('a')[namelink_index].innerText : ''
      }
    } catch (error) {
      console.log('error: ', data.webName, error)
    }
    searchList.push(obj)
  })
  return new Promise((resolve, reject) => {
    resolve(searchList)
  })
}

export const comicsWebInfo = [
  {
    domain: 'manhua.dmzj.com',
    homepage: 'https://manhua.dmzj.com/',
    webName: '动漫之家',
    comicNameCss: '.odd_anim_title_m .anim_title_text h1',
    chapterCss: '.cartoon_online_border',
    chapterCss_2: '.cartoon_online_border_other',
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'tags/search.shtml?s=',
      alllist_dom_css: '.tcaricature_block',
      minlist_dom_css: 'ul',
      img_src: 'src'
    },
    getImgs: async function(context) {
      let imgStr = funstrToData(context, /(function[\s\S]+?return \S})(\([\s\S]+?{}\))/g)
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
    chapterCss: '.tab-content-selected .list_con_li.autoHeight',
    readtype: 1,
    getImgs: async function(context) {
      const imgStr = funstrToData(context, /(function[\s\S]+?return \S})(\([\s\S]+?{}\))/g)
      const info = JSON.parse(imgStr.match(/{.*}/)[0])
      let imgArray = info['page_url'].split('\r\n')
      if (imgArray[0].search('http') === -1) {
        imgArray = imgArray.map((item) => {
          return 'https://images.dmzj.com/' + item
        })
      }
      return imgArray
    }
  },
  {
    domain: 'www.mangabz.com',
    homepage: 'http://www.mangabz.com/',
    webName: 'Mangabz',
    comicNameCss: 'p.detail-info-title',
    chapterCss: '#chapterlistload',
    headers: {
      referer: 'http://www.mangabz.com/'
    },
    readtype: 0,
    searchTemplate_1: {
      search_add_url: 'search?title=',
      alllist_dom_css: '.container .mh-list',
      minlist_dom_css: 'li',
      img_src: 'src'
    },
    getImgs: async function(context, processData) {
      let group; let page = 1
      if (processData.otherData) {
        group = processData.otherData.group
      } else {
        group = context.match(/MANGABZ_MID=(\d+?);.*MANGABZ_CID=(\d+?);.*MANGABZ_IMAGE_COUNT=(\d+?);.*MANGABZ_VIEWSIGN="(.*?)".*MANGABZ_VIEWSIGN_DT="(.*?)"/)
      }
      if (processData.imgIndex !== undefined) {
        page = processData.imgIndex + 1
      }
      const reqUrl = `http://www.mangabz.com/m${group[2]}/chapterimage.ashx?cid=${group[2]}&page=${page}&key=&_cid=${group[2]}&_mid=${group[1]}&_dt=${group[5]}&_sign=${group[4]}`

      const { responseText } = await request('get', reqUrl)
      const codeText = funstrToData(responseText, /(function.*return .*?})(\(.*?{}\))/g)
      const imgUrlArr = funstrToData(codeText, /(function.*return .*?})/g)
      const otherData = { group }
      return { imgUrlArr, nextPageUrl: null, imgCount: group[3], otherData }
    }
  }, {
    domain: 'www.qiman58.com',
    homepage: 'http://www.qiman58.com/',
    webName: '奇漫屋',
    comicNameCss: 'h1.name_mh',
    chapterCss: '#chapter-list1',
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'search.php?keyword=',
      alllist_dom_css: '.bookList_3',
      minlist_dom_css: 'div',
      img_src: 'src'
    },
    getImgs: async function(context) {
      let imgStr = funstrToData(context, /(function[\s\S]+?return \S})(\([\s\S]+?{}\))/g)
      imgStr = imgStr.match(/\[[\s\S]+?\]/)[0]
      return JSON.parse(imgStr)
    }
  },
  {
    domain: 'ac.qq.com',
    homepage: 'https://ac.qq.com/',
    webName: '腾讯漫画',
    comicNameCss: '.works-intro-title.ui-left strong',
    chapterCss: '.chapter-page-all.works-chapter-list',
    headers: '',
    readtype: 1,
    hasSpend: true,
    freeCss: '.ui-icon-free',
    payCss: '.ui-icon-pay',
    searchTemplate_1: {
      search_add_url: 'Comic/searchList?search=',
      alllist_dom_css: '.mod_book_list',
      minlist_dom_css: 'li',
      img_src: 'data-original'
    },
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
    domain: 'www.kumw5.com',
    homepage: 'http://www.kumw5.com/',
    webName: '酷漫屋',
    comicNameCss: '.info h1',
    chapterCss: '.view-win-list',
    readtype: 1,
    iswork: true,
    searchTemplate_1: {
      search_add_url: 'search.php?keyword=',
      alllist_dom_css: '.box.container > div > ul',
      minlist_dom_css: 'li',
      img_src: 'data-src'
    },
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
    domain: 'manga.bilibili.com',
    homepage: 'https://manga.bilibili.com/',
    webName: '哔哩哔哩',
    comicNameCss: '.manga-info h1.manga-title',
    chapterCss: '.episode-list .list-header',
    headers: {
      referer: 'https://manga.bilibili.com/'
    },
    readtype: 1,
    searchFun: async function(keyword) {
      const searchUrl = 'https://manga.bilibili.com/twirp/comic.v1.Comic/Search?device=pc&platform=web'
      const data = new FormData()
      data.append('key_word', keyword)
      data.append('page_num', 1)
      data.append('page_size', 8)
      const { responseText } = await request('post', searchUrl, data, this.headers)
      const list = JSON.parse(responseText).data.list
      const searchList = []
      list.forEach(element => {
        const obj = {}
        obj.name = element.org_title
        obj.url = this.homepage + 'detail/mc' + element.id
        obj.imageUrl = element.vertical_cover
        searchList.push(obj)
      })
      return new Promise((resolve, reject) => {
        resolve(searchList)
      })
    },
    getComicInfo: async function() {
      const comicid = window.location.href.match(/detail\/(\D*)(\d*)/)[2]
      const data = new FormData()
      data.append('comic_id', parseInt(comicid))
      const getUrl = 'https://manga.bilibili.com/twirp/comic.v1.Comic/ComicDetail?device=pc&platform=web'
      const { responseText } = await request('post', getUrl, data)
      const comic = JSON.parse(responseText)
      const comicName = comic.data.title
      const comic_list = comic.data.ep_list
      const allList = []
      comic_list.forEach(element => {
        const url = `https://manga.bilibili.com/mc${comicid}/${element.id}`
        const data = {
          comicName: comicName,
          chapterName: element.short_title + ' ' + element.title,
          url,
          readtype: this.readtype,
          isPay: element.is_locked
        }
        allList.push(data)
      })
      return allList.reverse()
    },
    getImgs: async function(context, processData) {
      const { url, isPay } = processData
      const chapter_id = parseInt(url.match(/.com\/(\D*)(\d*)\/(\d*)/)[3])
      const data = new FormData()
      data.append('ep_id', chapter_id)
      const postUrl = 'https://manga.bilibili.com/twirp/comic.v1.Comic/GetImageIndex?device=pc&platform=web'
      const { responseText } = await request({ method: 'post', url: postUrl, data, useCookie: isPay })
      const imgArray = JSON.parse(responseText).data.images

      const saveImg = []
      const query = []
      const imgPostUrl = 'https://manga.bilibili.com/twirp/comic.v1.Comic/ImageToken?device=pc&platform=web'
      imgArray.forEach(item => {
        query.push(item.path)
      })
      const img_data = new FormData()
      img_data.append('urls', JSON.stringify(query))
      const img_data_res = await request('post', imgPostUrl, img_data)
      const imgObjArr = JSON.parse(img_data_res.responseText).data
      imgObjArr.forEach(imgObj => {
        saveImg.push(`${imgObj.url}?token=${imgObj.token}`)
      })
      return saveImg
    }
  },
  {
    domain: 'www.darpou.com',
    homepage: 'https://www.darpou.com/',
    webName: '百漫谷(简)',
    comicNameCss: '.fed-part-eone.fed-font-xvi a',
    chapterCss: '.fed-play-item.fed-drop-item.fed-visible .fed-part-rows:nth-child(2)',
    readtype: 1,
    // searchTemplate_1: {
    //   search_add_url: 'vodsearch/-------------.html?wd=',
    //   alllist_dom_css: '.fed-part-layout.fed-back-whits',
    //   minlist_dom_css: 'dl.fed-deta-info',
    //   namelink_index: 2,
    //   img_src: 'data-original'
    // },
    getImgs: async function(context) {
      const txtUrl = context.match(/http(\S*).txt/gi)[0]
      const txtRes = await request('get', txtUrl)
      const txtContext = txtRes.responseText
      const imgReg = /http(\S*)jpg/g
      return txtContext.match(imgReg)
    }
  },
  {
    domain: 'darpou.com',
    homepage: 'https://darpou.com/',
    webName: '百漫谷(繁)',
    comicNameCss: '.fed-part-eone.fed-font-xvi a',
    chapterCss: '.fed-play-item.fed-drop-item.fed-visible .fed-part-rows:nth-child(2)',
    readtype: 1,
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
    readtype: 1,
    nextpageRgeCss: '.action-list li:nth-child(3) a',
    getImgs: async function(context) {
      const imgobj = context.matchAll(/<mip-img src="(https:\/\/[\s\S]+?(jpg|webp))/g)
      const imgUrlArr = []
      for (const item of imgobj) {
        imgUrlArr.push(item[1])
      }
      return imgUrlArr
    }
  },
  {
    domain: 'www.wuxiamh.com',
    homepage: 'https://www.wuxiamh.com/',
    webName: '武侠漫画网（电脑）',
    comicNameCss: '.title h1',
    chapterCss: '#chapter-list-1',
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'search/?keywords=',
      alllist_dom_css: 'div.dmList ul',
      minlist_dom_css: 'li.item-lg',
      img_src: 'src'
    },
    getImgs: async function(context) {
      const imgStr = context.match(/var chapterImages = ([[\s\S]+?])[\s\S]+?var chapterPath/)[1]
      const imgs = eval(imgStr)
      return imgs
    }
  },
  {
    domain: 'qiximh3.com',
    homepage: 'http://qiximh3.com/',
    webName: '七夕漫画',
    comicNameCss: '.comic_name .name',
    chapterCss: '.catalog_list.row_catalog_list',
    readtype: 1,
    searchFun: async function(keyword) {
      const searchUrl = 'http://qiximh3.com/search.php'
      const data = new FormData()
      data.append('keyword', keyword)
      const { responseText } = await request('post', searchUrl, data, '')
      const resJson = JSON.parse(responseText)
      const searchList = []
      resJson.search_data.forEach(element => {
        const obj = {}
        obj.name = element.name
        obj.url = this.homepage + element.id + '/'
        obj.imageUrl = element.imgs
        searchList.push(obj)
      })
      return new Promise((resolve, reject) => {
        resolve(searchList)
      })
    },
    getImgs: function(context) {
      let imgStr = funstrToData(context, /(function[\s\S]+?return \S})(\([\s\S]+?{}\))/g)
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
    readtype: 1,
    iswork: false,
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
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'search/?keywords=',
      alllist_dom_css: '.book-list',
      minlist_dom_css: 'li',
      img_src: 'src'
    },
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
    readtype: 1,
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
    domain: 'www.txydd.com',
    homepage: 'http://www.txydd.com/',
    webName: '滴滴漫画',
    comicNameCss: '.content h1',
    chapterCss: '#j_chapter_list',
    readtype: 1,
    getImgs: async function(context) {
      const group = context.matchAll(/chapter-pid(\s|\S)*?(src)="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[3])
      }
      return imgArray
    }
  },
  {
    domain: 'www.cnanjie.com',
    homepage: 'https://www.cnanjie.com/',
    webName: '好看的漫画网',
    comicNameCss: '.title h1',
    chapterCss: '#chapter-list-1',
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'search/?keywords=',
      alllist_dom_css: '#dmList ul',
      minlist_dom_css: 'li',
      img_src: 'src'
    },
    getImgs: async function(context) {
      const group = context.matchAll(/chapterImages = (.*?);var chapterPath = "(.*?)"/g)
      const strArr = []
      for (const item of group) {
        strArr.push(item[1])
      }
      let imgarr = JSON.parse(strArr[0])
      if (imgarr[0].search('http') === -1) {
        const josnRes = await request('get', this.homepage + 'js/config.js')
        const josnContext = josnRes.responseText
        const imageDomian = josnContext.match(/"domain":\["(.*?)"]/)[1]
        imgarr = imgarr.map((item) => {
          return imageDomian + item
        })
      }
      return imgarr
    }
  },
  {
    domain: 'comic.acgn.cc',
    homepage: 'https://comic.acgn.cc/',
    webName: '动漫戏说',
    comicNameCss: '.list_navbox h3 a',
    chapterCss: '#comic_chapter > ul',
    readtype: 1,
    getImgs: async function(context) {
      const group = context.matchAll(/_src="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  },
  {
    domain: 'www.77mh.xyz',
    homepage: 'https://www.77mh.xyz/',
    webName: '新新漫画',
    comicNameCss: '.ar_list_coc h1',
    chapterCss: '.ar_list_coc .ar_rlos_bor',
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'k.php?k=',
      search_pre: 'https://so.77mh.xyz/',
      alllist_dom_css: '.ar_list_co ul',
      minlist_dom_css: 'dl',
      img_src: 'src'
    },
    getImgs: async function(context) {
      const imgStr = funstrToData(context, /(function[\s\S]+?return \S})(\([\s\S]+?{}\))/g)
      const params = imgStr.match(/var atsvr="(.*?)";var msg='(.*?)'.*img_s=(.*?);.*colist_(.*?).htm/)
      let imgArray = params[2].split('|')

      const coid = window.location.href.match(/colist_(\d*?).html/)[1]
      const reqUrl = `https://css.gdbyhtl.net:5443/img_v1/cncf_svr.asp?z=${params[1]}&s=${params[3]}&cid=${params[4]}&coid=${coid}`

      const { responseText } = await request('get', reqUrl)
      const getImgPre = responseText.match(/= "(.*?)"/)[1]

      if (imgArray[0].search('http') === -1) {
        imgArray = imgArray.map((item) => {
          return getImgPre + item
        })
      }
      return imgArray
    }
  },
  {
    domain: 'www.mhxqiu2.com',
    homepage: 'http://www.mhxqiu2.com/',
    webName: '漫画星球',
    comicNameCss: '.cy_title h1',
    chapterCss: '.cy_plist #mh-chapter-list-ol-0',
    readtype: 1,
    // searchTemplate_1: {
    //   search_add_url: 'search.php?keyword=',
    //   alllist_dom_css: 'div.cy_list_mh',
    //   minlist_dom_css: 'ul',
    //   img_src: 'src'
    // },
    getImgs: function(context) {
      let imgStr = funstrToData(context, /(function.*?return \S})(\(.*?{}\))/g)
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
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'index.php/search?key=',
      alllist_dom_css: '.acgn-comic-list',
      minlist_dom_css: 'li.acgn-item',
      img_src: 'src',
      use_background: true
    },
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
    domain: 'www.mhua5.com',
    homepage: 'https://www.mhua5.com/',
    webName: '漫画屋',
    comicNameCss: '.comic-title.j-comic-title',
    chapterCss: '.chapter__list-box.clearfix',
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'index.php/search?key=',
      alllist_dom_css: '.cate-comic-list',
      minlist_dom_css: '.common-comic-item',
      img_src: 'data-original'
    },
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
    readtype: 1,
    iswork: false,
    getImgs: async function(context) {
      const imgStr = context.match(/var chapterImages = ([[\s\S]+?])[\s\S]+?var chapterPath/)[1]
      const imgs = eval(imgStr)
      return imgs
    }
  },
  {
    domain: 'www.zuimh.com',
    homepage: 'https://www.zuimh.com/',
    webName: '最漫画',
    comicNameCss: '.book-detail .book-title h1 span',
    chapterCss: '.chapter-body.clearfix #chapter-list-1',
    readtype: 1,
    readCssText: '.img_info {display: none;}.tbCenter img {border: 0px;}',
    searchTemplate_1: {
      search_add_url: 'search/?keywords=',
      alllist_dom_css: '.book-list',
      minlist_dom_css: 'li.item-lg',
      img_src: 'src'
    },
    getImgs: async function(context) {
      const imgStr = context.match(/var chapterImages = ([[\s\S]+?])[\s\S]+?var chapterPath/)[1]
      const imgs = eval(imgStr)
      return imgs
    }
  },
  {
    domain: 'www.qianwee.com',
    homepage: 'https://www.qianwee.com/',
    webName: '前未漫画',
    comicNameCss: '.comic_deCon.autoHeight h1',
    chapterCss: '.zj_list_con #chapter-list-1',
    readtype: 1,
    readCssText: '.img_info {display: none;}.comic_wraCon img {border: 0px;margin-top:0px;}',
    getImgs: async function(context) {
      const imgStr = context.match(/var chapterImages = ([[\s\S]+?])[\s\S]+?var chapterPath/)[1]
      const imgs = eval(imgStr)
      return imgs
    }
  },
  {
    domain: 'www.sixmh7.com',
    homepage: 'http://www.sixmh7.com/',
    webName: '六漫画',
    comicNameCss: '#intro_l > div.cy_title > h1',
    chapterCss: '.cy_zhangjie .cy_plist',
    readtype: 1,
    getImgs: async function(context) {
      let imgStr = funstrToData(context, /(function[\s\S]+?return \S})(\([\s\S]+?{}\))/g)
      imgStr = imgStr.match(/\[[\s\S]+?\]/)[0]
      const imgArray = JSON.parse(imgStr)
      return imgArray
    }
  },
  {
    domain: 'www.mhxin.com',
    homepage: 'https://www.mhxin.com/',
    webName: '漫画芯',
    comicNameCss: '.wrap_intro_l_comic .comic_deCon h1',
    chapterCss: '.zj_list_con #chapter-list-1',
    readtype: 1,
    readCssText: '.img_info {display: none;}.comic_wraCon img {border: 0px;margin-top:0px;}',
    searchTemplate_1: {
      search_add_url: 'search/?keywords=',
      alllist_dom_css: '.list_con_li',
      minlist_dom_css: 'li.list-comic',
      img_src: 'src'
    },
    getImgs: async function(context) {
      const group = context.matchAll(/chapterImages = (.*?);var chapterPath = "(.*?)"/g)
      const strArr = []
      for (const item of group) {
        strArr.push(item[1])
        strArr.push(item[2])
      }
      let imgarr = JSON.parse(strArr[0])
      if (imgarr[0].search('http') === -1) {
        const josnRes = await request('get', this.homepage + 'js/config.js')
        const josnContext = josnRes.responseText
        const imageDomian = josnContext.match(/"domain":\["(.*?)"]/)[1]
        imgarr = imgarr.map((item) => {
          return imageDomian + '/' + strArr[1] + item
        })
      }
      return imgarr
    }
  },
  {
    domain: 'cn.baozimh.com',
    homepage: 'https://cn.baozimh.com/',
    webName: '包子漫画',
    comicNameCss: 'h1.comics-detail__title',
    chapterCss: '.comics-detail > .l-content:nth-of-type(3)',
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'search/?keyword=',
      alllist_dom_css: '.pure-g.classify-items',
      minlist_dom_css: 'div.comics-card',
      img_src: 'src'
    },
    getImgs: async function(context) {
      const group = context.matchAll(/<img.*src="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  },
  {
    domain: 'www.aiguoman.com',
    homepage: 'https://www.aiguoman.com/',
    webName: '爱国漫',
    comicNameCss: '.detail-info > .detail-info-title',
    chapterCss: '#chapterlistload',
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'search?key=',
      alllist_dom_css: '.container .mh-list',
      minlist_dom_css: 'li',
      img_src: 'src'
    },
    getImgs: async function(context) {
      const group = context.matchAll(/<img.*src="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
      return imgArray
    }
  },
  {
    domain: 'www.maofly.com',
    homepage: 'https://www.maofly.com/',
    webName: '漫画猫',
    comicNameCss: 'h1.comic-title',
    chapterCss: 'ol.links-of-books.num_div',
    readtype: 1,
    webState: 2,
    searchTemplate_1: {
      search_add_url: 'search.html?q=',
      alllist_dom_css: '.comic-main-section.bg-white .row.m-0',
      minlist_dom_css: 'div.col-4',
      img_src: 'data-original'
    },
    getImgs: async function(context) {
      const img_data = context.match(/let img_data = "(.*?)"/)[1]
      const asset_domain = context.match(/data-chapter-domain="(.*?)"/)[1]
      const { responseText } = await request('get', this.homepage + 'static/js/string.min.js')

      const LZStringFun = funstrToData(responseText, /(function[\s\S]+?return \S})(\(\))/g)
      const img_data_arr = LZStringFun.decompressFromBase64(img_data).split(',')

      let imgArray = []
      imgArray = img_data_arr.map((item) => {
        return asset_domain + '/uploads/' + item
      })
      return imgArray
    }
  }
]

export const getWebList = () => {
  const userWebInfo = eval(getStorage('userWebInfo') || [])
  const originalInfo = comicsWebInfo
  return { originalInfo, userWebInfo }
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
  // 原漫画列表匹配
  for (let i = 0; i < comicsWebInfo.length; i++) {
    if (comicsWebInfo[i].domain === hname) {
      currentComics = comicsWebInfo[i]
      break
    }
  }
  // 导入规则列表匹配
  if (currentComics === null) {
    const userWebInfo = eval(getStorage('userWebInfo') || [])
    for (let a = 0; a < userWebInfo.length; a++) {
      if (userWebInfo[a].domain === hname) {
        currentComics = userWebInfo[a]
        break
      }
    }
    if (currentComics !== null && typeof currentComics.getImgs === 'string') {
      // eslint-disable-next-line no-eval
      currentComics.getImgs = eval('(function(){return ' + currentComics.getImgs + ' })()')
    }
  }
}

