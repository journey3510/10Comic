/* eslint-disable no-undef */
/* eslint-disable no-empty */
/* eslint-disable no-eval */

import { request, parseToDOM, funstrToData, getType, trimSpecial, getdomain } from '@/utils/index'
import { getStorage } from '@/config/setup'

export const searchFunTemplate_1 = async(data, keyword) => {
  // eslint-disable-next-line prefer-const
  let { search_add_url, search_pre, alllist_dom_css, minlist_dom_css, namelink_index, img_src, use_background, img_reg, match_reg_num } = data.searchTemplate_1
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
        if (!img_reg) {
          const reg2 = eval('/' + img_src + `=('|")(.*?)('|")` + '/')
          obj.imageUrl = element.innerHTML.match(reg2)[2]
        } else {
          obj.imageUrl = element.innerHTML.match(img_reg)[match_reg_num]
        }
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
    domain: ['manhua.idmzj.com', 'm.dmzj.com', 'm.idmzj.com'],
    homepage: 'https://manhua.idmzj.com/',
    webName: '动漫之家',
    comicNameCss: 'h1',
    webDesc: '需要登录',
    readtype: 1,
    // searchTemplate_1: {
    //   search_add_url: 'tags/search.shtml?s=',
    //   alllist_dom_css: '.tcaricature_block',
    //   minlist_dom_css: 'ul',
    //   img_src: 'src'
    // },
    getComicInfo: async function(comic_name) {
      const domain = getdomain()
      let text = ''
      if (domain === 'm.idmzj.com') {
        text = document.body.outerHTML
      } else {
        const arr = window.location.href.split('/')
        let name = arr[arr.length - 1] ? arr[arr.length - 1] : arr[arr.length - 2]
        name = name.split('.')[0]
        const comicUrl = `https://m.idmzj.com/info/${name}.html`
        const htmldata = await request('get', comicUrl)
        text = htmldata.responseText
      }

      const str2 = text.match(/initIntroData\((.*)\)/)[1]
      const comic_list = JSON.parse(str2)[0].data
      let comic_list_2 = []
      if (JSON.parse(str2)[1]) {
        comic_list_2 = JSON.parse(str2)[1].data
      }
      const allList = []
      comic_list.forEach(element => {
        const url = `https://m.idmzj.com/view/${element.comic_id}/${element.id}.html/`
        const data = {
          comicName: comic_name,
          chapterName: trimSpecial(element.chapter_name),
          chapterNumStr: '',
          url,
          readtype: this.readtype,
          isPay: false,
          isSelect: false,
          characterType: 'one'
        }
        allList.push(data)
      })
      comic_list_2.forEach(element => {
        const url = `https://m.idmzj.com/view/${element.comic_id}/${element.id}.html/`
        const data = {
          comicName: comic_name,
          chapterName: trimSpecial(element.chapter_name),
          chapterNumStr: '',
          url,
          readtype: this.readtype,
          isPay: false,
          isSelect: false,
          characterType: 'many'
        }
        allList.push(data)
      })
      return allList
    },
    getImgs: async function(context, processData) {
      const str = context.match(/mReader.initData\(.*"page_url":(.*?"]).*\)/)[1]
      const imgs = JSON.parse(str)
      return imgs
    }
  },
  {
    domain: ['comic.idmzj.com', 'www.idmzj.com'],
    homepage: 'https://comic.idmzj.com/',
    webName: '动漫之家(访客)',
    comicNameCss: 'h1',
    chapterCss: '.cartoon_online_border, .list_con_li',
    readtype: 1,
    getImgs: async function(context, processData) {
      const group = processData.url.match(/idmzj.com\/(.*?)\/(\d+)/)
      const DATA = funstrToData(context, /(function[\s\S]+?return [\s\S]*?}})(\([\s\S]+?\))/g)
      const params = DATA.pinia['app-store'].publicParams

      let reqUrl = `https://comic.idmzj.com/api/v1/s_comic/chapter/detail?channel=${params.channel}&app_name=${params.app_name}&version=${params.timestamp}&timestamp=${params.timestamp}&uid&comic_py=${group[1]}&chapter_id=${group[2]}`
      if (unsafeWindow.location.host.includes('www')) {
        const comic_id = unsafeWindow.__NUXT__.data.getcationDeatils.comicInfo.id
        reqUrl = `https://www.idmzj.com/api/v1/comic1/chapter/detail?channel=${params.channel}&app_name=${params.app_name}&version=1.0.0&timestamp=${params.timestamp}&uid&comic_id=${comic_id}&chapter_id=${group[2]}`
      }

      const { response } = await request('get', reqUrl)
      const imgs = JSON.parse(response).data.chapterInfo.page_url
      return imgs
    }
  },
  {
    domain: ['mangabz.com', 'www.mangabz.com'],
    homepage: 'https://mangabz.com/',
    webName: 'Mangabz',
    comicNameCss: 'p.detail-info-title',
    chapterCss: '#chapterlistload',
    headers: {
      referer: 'https://mangabz.com/'
    },
    downHeaders: {
      referer: 'https://mangabz.com/'
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
      const reqUrl = `https://mangabz.com/m${group[2]}/chapterimage.ashx?cid=${group[2]}&page=${page}&key=&_cid=${group[2]}&_mid=${group[1]}&_dt=${group[5]}&_sign=${group[4]}`

      const { responseText } = await request('get', reqUrl)
      const codeText = funstrToData(responseText, /(function.*return .*?})(\(.*?{}\))/g)
      const imgUrlArr = funstrToData(codeText, /(function.*return .*?})/g)

      const otherData = { group }
      return { imgUrlArr, nextPageUrl: null, imgCount: group[3], otherData }
    }
  },
  {
    domain: 'www.dm5.com',
    homepage: 'https://www.dm5.com/',
    webName: '动漫屋',
    comicNameCss: '.banner_detail_form > .info > p.title',
    chapterCss: '#detail-list-select-1',
    hasSpend: true,
    payKey: '-lock',
    readtype: 0,
    headers: {
      referer: 'https://www.dm5.com/'
    },
    downHeaders: {
      referer: ''
    },
    searchTemplate_1: {
      search_add_url: 'search?title=',
      alllist_dom_css: '.mh-list',
      minlist_dom_css: 'li',
      use_background: true
    },
    getImgs: async function(context, processData) {
      let group; let page = 1
      if (processData.otherData) {
        group = processData.otherData.group
      } else {
        group = context.match(/DM5_MID=(\d+?);.*DM5_CID=(\d+?);.*DM5_IMAGE_COUNT=(\d+?);.*DM5_VIEWSIGN="(.*?)".*DM5_VIEWSIGN_DT="(.*?)"/)
      }
      if (processData.imgIndex !== undefined) {
        page = processData.imgIndex + 1
      }
      const reqUrl = `https://www.dm5.com/ch1-${group[2]}/chapterfun.ashx?cid=${group[2]}&page=${page}&key=&language=1&gtk=6&_cid=${group[2]}&_mid=${group[1]}&_dt=${group[5].replaceAll(' ', '+').replaceAll(':', '%3A')}&_sign=${group[4]}`
      const { responseText } = await request({ method: 'get', url: reqUrl, useCookie: processData.isPay })

      const codeText = funstrToData(responseText, /(function.*return .*?})(\(.*?{}\))/g)
      const imgUrlArr = funstrToData(codeText, /(function.*return .*?})/g)
      const otherData = { group }
      return { imgUrlArr, nextPageUrl: null, imgCount: group[3], otherData }
    }
  },
  {
    domain: 'www.dmhua8.com',
    homepage: 'https://www.dmhua8.com/',
    webName: 'dmhua8',
    comicNameCss: '.book-detail.pr.fr .book-title h1 span',
    chapterCss: '.chapter-body.clearfix',
    readtype: 1,
    getImgs: async function(context) {
      const imgStr = context.match(/var chapterImages = ([[\s\S]+?])[\s\S]+?var chapterPath/)[1]
      let imgarr = eval(imgStr)
      const josnRes = await request('get', this.homepage + 'js/config.js')
      const josnContext = josnRes.responseText
      const imageDomian = josnContext.match(/"domain":\["(.*?)"]/)[1]
      imgarr = imgarr.map((item) => {
        if (item.search('http') === -1) {
          return imageDomian + item
        }
        return item
      })
      return imgarr
    }
  },
  {
    domain: 'tel.dm5.com',
    homepage: 'https://tel.dm5.com/',
    webName: '动漫屋2',
    comicNameCss: '.banner_detail_form > .info > p.title',
    chapterCss: '#detail-list-select-1',
    hasSpend: true,
    payKey: '-lock',
    readtype: 0,
    headers: {
      referer: 'https://tel.dm5.com/'
    },
    downHeaders: {
      referer: ''
    },
    getImgs: async function(context, processData) {
      let group; let page = 1
      if (processData.otherData) {
        group = processData.otherData.group
      } else {
        group = context.match(/DM5_MID=(\d+?);.*DM5_CID=(\d+?);.*DM5_IMAGE_COUNT=(\d+?);.*DM5_VIEWSIGN="(.*?)".*DM5_VIEWSIGN_DT="(.*?)"/)
      }
      if (processData.imgIndex !== undefined) {
        page = processData.imgIndex + 1
      }
      const reqUrl = `https://tel.dm5.com/ch1-${group[2]}/chapterfun.ashx?cid=${group[2]}&page=${page}&key=&language=1&gtk=6&_cid=${group[2]}&_mid=${group[1]}&_dt=${group[5].replaceAll(' ', '+').replaceAll(':', '%3A')}&_sign=${group[4]}`
      const { responseText } = await request({ method: 'get', url: reqUrl, useCookie: processData.isPay })
      const codeText = funstrToData(responseText, /(function.*return .*?})(\(.*?{}\))/g)
      const imgUrlArr = funstrToData(codeText, /(function.*return .*?})/g)
      const otherData = { group }
      return { imgUrlArr, nextPageUrl: null, imgCount: group[3], otherData }
    }
  },
  {
    domain: 'www.qiman59.com',
    homepage: 'http://www.qiman59.com/',
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
    domain: 'cn.godamanga.art',
    homepage: 'https://cn.godamanga.art/',
    webName: 'GoDa',
    comicNameCss: 'h1.stk-block-heading__text',
    chapterCss: 'ul.main',
    chapterNameReg: />(.*?)<span/,
    readtype: 1,
    getImgs: async function(context) {
      const dom = parseToDOM(context).querySelector('div.stk-block-content.stk-inner-blocks.stk-7a98277-inner-blocks')
      const imgTag = dom.querySelectorAll('img')
      const img = []
      imgTag.forEach(element => {
        if (!element.src.includes('data:image')) {
          img.push(element.src)
        } else {
          img.push(element.dataset.src)
        }
      })
      return img
    }
  },
  {
    domain: 'www.dongmanmanhua.cn',
    homepage: 'https://www.dongmanmanhua.cn/',
    webName: '咚漫',
    comicNameCss: 'h1.subj',
    chapterCss: '#_listUl',
    chapterNameReg: /alt="(.*?)"/,
    readtype: 1,
    headers: {
      referer: 'https://www.dongmanmanhua.cn/'
    },
    getImgs: async function(context) {
      const str = context.match(/class="viewer_lst[\s\S]*?input/)[0]
      const imgobj = str.matchAll(/img src[\s\S]*?data-url="(.*?)"/g)
      const imgUrlArr = []
      for (const item of imgobj) {
        imgUrlArr.push(item[1])
      }
      return imgUrlArr
    }
  },
  {
    domain: 'www.webtoons.com',
    homepage: 'https://www.webtoons.com/',
    webName: 'webtoons',
    comicNameCss: 'h1.subj',
    chapterCss: '#_listUl',
    chapterNameReg: /alt="(.*?)"/,
    readtype: 1,
    webDesc: '？需要魔法？',
    headers: {
      referer: 'https://www.webtoons.com/'
    },
    getImgs: async function(context) {
      const str = context.match(/class="viewer_lst[\s\S]*?class="viewer_ad_area"/)[0]
      const imgobj = str.matchAll(/img src[\s\S]*?data-url="(.*?)"/g)
      const imgUrlArr = []
      for (const item of imgobj) {
        imgUrlArr.push(item[1])
      }
      return imgUrlArr
    }
  },
  {
    domain: 'www.manshiduo.net',
    homepage: 'https://www.manshiduo.net/',
    webName: '漫士多',
    comicNameCss: '.comic-title',
    chapterCss: 'ul.chapter__list-box',
    readtype: 1,
    getImgs: async function(context) {
      const imgobj = context.matchAll(/data-original="(.*?)"/g)
      const imgUrlArr = []
      for (const item of imgobj) {
        imgUrlArr.push(item[1])
      }
      return imgUrlArr
    }
  },
  {
    domain: 'comic.naver.com',
    homepage: 'https://comic.naver.com/',
    webName: 'comic.naver',
    comicNameCss: '#content > div.EpisodeListInfo__comic_info--yRAu0 > div > h2',
    chapterCss: '#content ul',
    chapterNameReg: /span.*?>(.*?)<\/span>/,
    webDesc: '找到漫画目录页再使用, 新打开页面需“重载列表”',
    readtype: 1,
    headers: {
      referer: 'https://comic.naver.com/'
    },
    getImgs: async function(context) {
      const str = context.match(/class="wt_viewer"[\s\S]*?(<\/div>)/)[0]
      const imgobj = str.matchAll(/img src="(.*?)"/g)
      const imgUrlArr = []
      for (const item of imgobj) {
        imgUrlArr.push(item[1])
      }
      return imgUrlArr
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
    webDesc: '2023.3.2起, 需要APP观看的章节无法完整下载',
    hasSpend: true,
    payKey: 'ui-icon-pay',
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
    domain: 'www.kumw8.com',
    homepage: 'http://www.kumw8.com/',
    webName: '酷漫屋',
    comicNameCss: '.info h1',
    chapterCss: '.view-win-list',
    readtype: 1,
    useFrame: true,
    searchTemplate_1: {
      search_add_url: 'search.php?keyword=',
      alllist_dom_css: '.box.container > div > ul',
      minlist_dom_css: 'li',
      img_src: 'data-src'
    },
    getImgs: function(context, processData) {
      const str = document.getElementById(processData.frameId).contentDocument.body.outerHTML
      const imgStr = str.match(/main_img[\s\S]*?class="chapend/)[0]
      const group = imgStr.matchAll(/data-src="(.*?)"/g)
      const imgarr = []
      for (const item of group) {
        imgarr.push(item[1])
      }
      document.getElementById(processData.frameId).remove()
      return imgarr
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
      const comicName = trimSpecial(comic.data.title)
      const comic_list = comic.data.ep_list
      const allList = []
      comic_list.forEach(element => {
        const url = `https://manga.bilibili.com/mc${comicid}/${element.id}`
        const data = {
          comicName: comicName,
          chapterName: trimSpecial(element.short_title + ' ' + element.title),
          chapterNumStr: '',
          url,
          readtype: this.readtype,
          isPay: element.is_locked,
          isSelect: false
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
    domain: 'www.bilibilicomics.com',
    homepage: 'https://www.bilibilicomics.com/',
    webName: '哔哩哔哩漫画国际版',
    comicNameCss: 'h1.manga-title',
    chapterCss: '.episode-list .list-header',
    headers: {
      referer: 'https://www.bilibilicomics.com/'
    },
    webDesc: '？需要魔法？',
    readtype: 1,
    getComicInfo: async function() {
      const comicid = window.location.href.match(/detail\/(\D*)(\d*)/)[2]
      const data = new FormData()
      data.append('comic_id', parseInt(comicid))
      const getUrl = 'https://www.bilibilicomics.com/twirp/comic.v1.Comic/ComicDetail?device=pc&platform=web'
      const { responseText } = await request('post', getUrl, data)
      const comic = JSON.parse(responseText)
      const comicName = trimSpecial(comic.data.title)
      const comic_list = comic.data.ep_list
      const allList = []
      comic_list.forEach(element => {
        const url = `https://www.bilibilicomics.com/mc${comicid}/${element.id}`
        const data = {
          comicName: comicName,
          chapterName: trimSpecial(element.short_title + ' ' + element.title),
          chapterNumStr: '',
          url,
          readtype: this.readtype,
          isPay: element.is_locked,
          isSelect: false
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
      const postUrl = 'https://www.bilibilicomics.com/twirp/comic.v1.Comic/GetImageIndex?device=pc&platform=web'
      const { responseText } = await request({ method: 'post', url: postUrl, data, useCookie: isPay })
      const imgArray = JSON.parse(responseText).data.images

      const saveImg = []
      const query = []
      const imgPostUrl = 'https://www.bilibilicomics.com/twirp/comic.v1.Comic/ImageToken?device=pc&platform=web'
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
    domain: 'komiic.com',
    homepage: 'https://komiic.com/',
    webName: 'Komiic漫画',
    comicNameCss: 'h1.ComicMain__title',
    chapterCss: '.container .v-window-item .container .row',
    chapterNameReg: /ComicChapters__serial">(\d*\.?\d*)</,
    webDesc: 'SPA页面, 新页面需“重载列表”重新匹配新名称',
    headers: {
      referer: 'https://komiic.com/'
    },
    readtype: 1,
    getImgs: async function(context, processData) {
      const { url } = processData
      const chapter_id = url.match(/chapter\/(\d*)\/images/)[1]
      const postUrl = 'https://komiic.com/api/query'
      const data = {
        'operationName': 'imagesByChapterId',
        'variables': {
          'chapterId': chapter_id
        },
        'query': 'query imagesByChapterId($chapterId: ID!) {\n  imagesByChapterId(chapterId: $chapterId) {\n    id\n    kid\n    height\n    width\n    __typename\n  }\n}\n'
      }
      const headers = { 'Content-Type': 'application/json' }
      const { responseText } = await request({ method: 'post', url: postUrl, headers, data: JSON.stringify(data) })
      const img_data = JSON.parse(responseText).data.imagesByChapterId
      const saveImg = []
      img_data.forEach(element => {
        saveImg.push('https://komiic.com/api/image/' + element.kid)
      })
      return saveImg
    }
  },
  {
    domain: ['www.darpou.com', 'darpou.com'],
    homepage: 'https://www.darpou.com/',
    webName: '百漫谷',
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
  // {
  //   domain: 'm.wuxiamh.com',
  //   homepage: 'https://m.wuxiamh.com/',
  //   webName: '武侠漫画（手机）',
  //   comicNameCss: '.view-sub.autoHeight .title',
  //   chapterCss: '#chapter-list-1',
  //   readtype: 0,
  //   getImgs: async function(context) {
  //     const imgobj = context.matchAll(/<mip-img src="(https:\/\/[\s\S]+?(jpg|webp))/g)
  //     const imgUrlArr = []
  //     for (const item of imgobj) {
  //       imgUrlArr.push(item[1])
  //     }
  //     const nextPageUrl = context.match(/<mip-link href="(.*?)">下一页/)[1]
  //     return { imgUrlArr, nextPageUrl }
  //   }
  // },
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
      let imgarr = eval(imgStr)
      const josnRes = await request('get', this.homepage + 'js/config.js')
      const josnContext = josnRes.responseText
      const imageDomian = josnContext.match(/"domain":\["(.*?)"]/)[1]
      imgarr = imgarr.map((item) => {
        if (item.search('http') === -1) {
          return imageDomian + item
        }
        return item
      })
      return imgarr
    }
  },
  {
    domain: ['qiximh2.com', 'www.qiximh2.com'],
    homepage: 'http://www.qiximh2.com/',
    webName: '七夕漫画',
    comicNameCss: '.cy_title h1',
    chapterCss: '.cy_plist ul',
    readtype: 1,
    useFrame: true,
    searchTemplate_1: {
      search_add_url: 'search?keyword=',
      alllist_dom_css: '.cy_list_r .cy_list_mh',
      minlist_dom_css: 'ul',
      img_src: 'src'
    },
    getImgs: function(context, processData) {
      const str = document.getElementById(processData.frameId).contentDocument.body.outerHTML
      const imgStr = str.match(/main_img[\s\S]*?class="cy_intro_r/)[0]
      const group = imgStr.matchAll(/data-src="(.*?)"/g)
      const imgarr = []
      for (const item of group) {
        imgarr.push(item[1])
      }
      document.getElementById(processData.frameId).remove()
      return imgarr
    }
  },
  {
    domain: ['manhuagui.com'],
    homepage: 'https://www.manhuagui.com/',
    webName: '漫画柜',
    comicNameCss: '.book-title h1',
    chapterCss: '.chapter-list',
    readtype: 1,
    // context 章节请求正文
    getImgs: function(context) {
      // 获取到 html请求正文 context 的一段js代码字符 并执行这代码获取到 图片地址信息
      // window["\x65\x76\x61\x6c"]  => eval
      // (function[\s\S]+?return \S*?}) 匿名函数部分
      // (\([\s\S]+?{}\)) 需要的参数
      const dataStr = funstrToData(context, /window\["\\x65\\x76\\x61\\x6c"\]\((function[\s\S]+?return \S*?})(\([\s\S]+?{}\))/g)
      const matchObj = /"files":(?<files>.*?),"finished".*"path":"(?<path>.*?)".*"e":(?<e>\d*),"m":"(?<m>.*)"}/g.exec(dataStr)
      var { files, path, e, m } = matchObj.groups
      files = JSON.parse(files)
      const image = files.map(ele => {
        return 'https://i.hamreus.com' + path + ele + '?e=' + e + '&m=' + m
      })
      return image
    }
  },
  {
    domain: 'www.36manga.com',
    homepage: 'https://www.36manga.com/',
    webName: '36漫画网',
    comicNameCss: '.book-title h1 span',
    chapterCss: '#chapter-list-4 li:not(:first-of-type)',
    readtype: 1,
    webDesc: '？可访问 ？',
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
    domain: 'www.gufengmh.com',
    homepage: 'https://www.gufengmh.com/',
    webName: '古风漫画网',
    comicNameCss: '.book-title h1 span',
    chapterCss: '#chapter-list-1,#chapter-list-10',
    readtype: 1,
    readCssText: '.img_info {display: none;}.tbCenter img {border: 0px;}',
    searchTemplate_1: {
      search_add_url: 'search/?keywords=',
      alllist_dom_css: '.book-list',
      minlist_dom_css: 'li',
      img_src: 'src'
    },
    getImgs: async function(context) {
      const group = context.matchAll(/chapterImages = (.*?);var chapterPath = "(.*?)"/g)
      const strArr = []
      for (const item of group) {
        strArr.push(item[1])
        strArr.push(item[2])
      }
      const josnRes = await request('get', this.homepage + 'js/config.js')
      const josnContext = josnRes.responseText
      const imageDomian = josnContext.match(/domain:\["(.*?)"]/)[1]
      let imgarr = JSON.parse(strArr[0])
      imgarr = imgarr.map((item) => {
        if (imgarr[0].search('http') === -1) {
          return imageDomian + '/' + strArr[1] + item
        }
        return item
      })
      return imgarr
    }
  },
  {
    domain: 'kanbook.net',
    homepage: 'https://kanbook.net/',
    webName: '快岸漫画',
    comicNameCss: 'h2.comic-title.one-line',
    chapterCss: 'ol.links-of-books.num_div',
    readtype: 1,
    hasSpend: true,
    useFrame: true,
    webDesc: '首次打开网站章节页可能需自行输入验证码',
    searchTemplate_1: {
      search_add_url: 'search/',
      alllist_dom_css: '.row.m-0 ul',
      minlist_dom_css: 'li',
      img_src: 'data-src'
    },
    getImgs: async function(context, processData) {
      const iframe = document.getElementById(processData.frameId).contentWindow
      const part_url = processData.url.match(/comic\/(\d+\/\d+\/\d+)/)[1]
      const code1 = funstrToData(context, /(function\(p,a.*?d\){e[\s\S]+?return \S})(\([\s\S]+?{}\))/g)
      // const x_tokens = code1.match(/host="(.*?)";var x_tokens=(.*?);/)[2]
      const host = code1.match(/host="(.*?)"/)[1]
      const x_tokens = iframe.x_tokens
      const imgs = []
      for (var i in x_tokens) {
        imgs.push(host + part_url + '/' + iframe.my_sha2(x_tokens[i]))
      }
      document.getElementById(processData.frameId).remove()
      return imgs
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
    domain: 'www.qianmh.com',
    homepage: 'https://www.qianmh.com/',
    webName: '前未漫画',
    comicNameCss: 'h1',
    chapterCss: '#chapter-list-1',
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
    // searchTemplate_1: {
    //   search_add_url: 'search/?keywords=',
    //   alllist_dom_css: '.list_con_li',
    //   minlist_dom_css: 'li.list-comic',
    //   img_src: 'src'
    // },
    getImgs: async function(context) {
      const group = context.matchAll(/chapterImages = (.*?);var chapterPath = "(.*?)"/g)
      const strArr = []
      for (const item of group) {
        strArr.push(item[1])
        strArr.push(item[2])
      }
      let imgarr = JSON.parse(strArr[0])
      const josnRes = await request('get', this.homepage + 'js/config.js')
      const josnContext = josnRes.responseText
      const imageDomian = josnContext.match(/"domain":\["(.*?)"]/)[1]
      imgarr = imgarr.map((item) => {
        if (imgarr[0].search('http') === -1) {
          return imageDomian + '/' + strArr[1] + item
        }
        return item
      })
      return imgarr
    }
  },
  {
    domain: 'cn.baozimh.com',
    homepage: 'https://cn.baozimh.com/',
    webName: '包子漫画',
    comicNameCss: 'h1.comics-detail__title',
    chapterCss: '.comics-detail > .l-content:nth-of-type(3) #chapter-items',
    chapterCss_2: '.comics-detail > .l-content:nth-of-type(3) .pure-g',
    readtype: 1,
    searchTemplate_1: {
      search_add_url: 'search/?keyword=',
      alllist_dom_css: '.pure-g.classify-items',
      minlist_dom_css: 'div.comics-card',
      img_reg: /src=('|")(.*?)\?/,
      match_reg_num: 2
    },
    getImgs: async function(context, processData) {
      const imgArray = []
      const nextReg = /next_chapter"><a href="(.*)?"[\s\S]{1,10}点击进入下一页/
      let hasNext = false
      let nextHtml = ''
      do {
        const group = context.matchAll(/<img.*src="(.*?)"/g)
        for (const item of group) {
          if (!imgArray.includes(item[1])) {
            imgArray.push(item[1])
          }
        }
        hasNext = nextReg.test(context)
        if (hasNext) {
          nextHtml = context.match(nextReg)[1]
          const { responseText } = await request('get', nextHtml)
          context = responseText
        }
      } while (hasNext)
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
    domain: 'www.kuaikanmanhua.com',
    homepage: 'https://www.kuaikanmanhua.com/',
    webName: '快看漫画',
    comicNameCss: 'h3.title',
    chapterCss: '.episode-title',
    readtype: 1,
    hasSpend: true,
    useFrame: true,
    getComicInfo: async function() {
      const list = unsafeWindow.__NUXT__.data[0].comics
      const comicName = unsafeWindow.__NUXT__.data[0].topicInfo.title
      const newList = []
      list.forEach(element => {
        const url = `https://www.kuaikanmanhua.com/web/comic/${element.id}/`
        const data = {
          comicName: comicName,
          chapterName: element.title,
          chapterNumStr: '',
          url,
          readtype: this.readtype,
          isPay: element.locked,
          isSelect: false
        }
        newList.push(data)
      })
      return newList
    },
    getImgs: async function(context, processData) {
      const str = document.getElementById(processData.frameId).contentDocument.body.outerHTML
      const data = funstrToData(str, /(function.*}})(\(.*)\);<\/script>/g)
      let comicImages = data.data[0].comicInfo.comicImages
      const imgarr = []
      if (!comicImages) {
        comicImages = data.data[0].imgList
      }
      comicImages.forEach(element => {
        imgarr.push(element.url)
      })
      document.getElementById(processData.frameId).remove()
      return imgarr
    }
  },
  {
    domain: 'm.kuaikanmanhua.com',
    homepage: 'https://m.kuaikanmanhua.com/',
    webName: '快看漫画m',
    comicNameCss: '.mask p.title',
    chapterCss: '',
    readtype: 1,
    hasSpend: true,
    showInList: false,
    useFrame: true,
    getComicInfo: async function() {
      const code = document.body.outerHTML.match(/\(function\(a,b,c.*?(\)\))/g)[0]
      const data = eval(code)
      const list = data.data[0].comicList
      const comicName = trimSpecial(data.data[0].topicInfo.title)
      const newlist = list.map((item) => {
        return {
          comicName: comicName,
          chapterName: trimSpecial(item.title),
          chapterNumStr: '',
          url: 'https://m.kuaikanmanhua.com/mobile/comics/' + item.id,
          readtype: 1,
          isPay: !item.is_free,
          isSelect: false
        }
      })
      return newlist
    },
    getImgs: async function(context, processData) {
      const str = document.getElementById(processData.frameId).contentDocument.body.outerHTML
      const data = funstrToData(str, /(function.*}})(\(.*)\);<\/script>/g)
      let comicImages = data.data[0].comicInfo.comicImages
      const imgarr = []
      if (!comicImages) {
        comicImages = data.data[0].imgList
      }
      comicImages.forEach(element => {
        imgarr.push(element.url)
      })
      document.getElementById(processData.frameId).remove()
      return imgarr
    }
  },
  {
    domain: 'www.maofly.com',
    homepage: 'https://www.maofly.com/',
    webName: '漫画猫',
    comicNameCss: 'h1.comic-title',
    chapterCss: 'ol.links-of-books.num_div',
    readtype: 1,
    webDesc: '?可访问?',
    // searchTemplate_1: {
    //   search_add_url: 'search.html?q=',
    //   alllist_dom_css: '.comic-main-section.bg-white .row.m-0',
    //   minlist_dom_css: 'div.col-4',
    //   img_src: 'data-original'
    // },
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
  },
  {
    domain: 'www.haoman8.com',
    homepage: 'https://www.haoman8.com/',
    webName: '好漫8',
    comicNameCss: '.content .title',
    chapterCss: '#j_chapter_list',
    readtype: 1,
    // searchTemplate_1: {
    //   search_add_url: 'index.php/search?key=',
    //   alllist_dom_css: '.acgn-comic-list',
    //   minlist_dom_css: 'li.acgn-item',
    //   img_src: 'src',
    //   use_background: true
    // },
    getImgs: function(context) {
      const group = context.matchAll(/data-echo="(.*?)"/g)
      const imgArray = []
      for (const item of group) {
        imgArray.push(item[1])
      }
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

// 网站匹配
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
    if (hname.includes(comicsWebInfo[i].domain)) {
      currentComics = comicsWebInfo[i]
      break
    }

    if (getType(comicsWebInfo[i].domain) === 'Array') {
      if (comicsWebInfo[i].domain.includes(hname)) {
        currentComics = comicsWebInfo[i]
        break
      }
    }
  }
  // 导入规则列表匹配
  if (currentComics === null) {
    const userWebInfo = eval(getStorage('userWebInfo') || [])
    for (let a = 0; a < userWebInfo.length; a++) {
      if (hname.includes(userWebInfo[a].domain)) {
        currentComics = userWebInfo[a]
        break
      }

      if (getType(comicsWebInfo[i].domain) === 'Array') {
        if (comicsWebInfo[i].domain.includes(hname)) {
          currentComics = comicsWebInfo[i]
          break
        }
      }
    }
    if (currentComics !== null && typeof currentComics.getImgs === 'string') {
      window.request = request
      currentComics.getImgs = funSplicing(currentComics.getImgs)
    }
  }
}

function funSplicing(funStr) {
  const getImgsGroup = funStr.match(/((async )?function\(.*{)([\s\S]*)/)
  const funHead = getImgsGroup[1]
  const funTail = getImgsGroup[3]
  let insertCode = ''
  if (funStr.includes('funstrToData')) {
    insertCode = insertCode + funstrToData.toString() + '\n'
  }
  if (funStr.includes('request')) {
    insertCode = insertCode + 'const request = window.request' + '\n'
  }
  const code = `
  (function(){
    return ${funHead}
  // 注入开始
  ${insertCode}
  // 注入结束
  ${funTail}
  })()`
  const fun = eval(code)
  // console.log('fun: ', fun.toString())
  return fun
}

