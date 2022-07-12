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
    domain: 'manhua.dmzj.com',
    homepage: 'https://manhua.dmzj.com/',
    webName: '动漫之家',
    comicNameCss: '.odd_anim_title_m .anim_title_text h1',
    chapterCss: '.cartoon_online_border',
    type: 1,
    nextpageRgeCss: '.action-list li:nth-child(3) a',
    getImgs: async function(context) {
      var pages = '11ddd1'
      eval(function(p, a, c, k, e, d) {
        e = function(c) { return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) }; if (!''.replace(/^/, String)) { while (c--) { d[e(c)] = k[c] || e(c) }k = [function(e) { return d[e] }]; e = function() { return '\\w+' }; c = 1 } while (c--) { if (k[c]) { p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]) } }
        console.log('p', p)
        pages = p
        return p
      }('J q=q=\'["j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/z%0%2%x%A%B%C.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/D.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/s.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/r.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/t.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/u.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/v.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/w.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/y.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/Q.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/M.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/N.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/O.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/P.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/E.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/L.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/K.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/G.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/F.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/H.e","j\\/%4%f%a%0%b%2%4%c%9%0%5%6%0%8%7%0%d%i%3%n%p%3%o%m%0%2%k%0%g%l\\/1.h\\/I.e"]\';', 53, 53, 'E5||B0|E7|E6|AE|B6|AF|8F|A0|A1|88|97|BD|jpg|8D|B9|1_1654569389|92||91|B4|8E|9A|BE|84|pages|04|03|05|06|07|08|81|09|00|E9|9D|A2|02|15|19|18|20|21|var|17|16|11|12|13|14|10'.split('|'), 0, {}))

      console.log('pages: ', pages)

      // return { imgUrl, nextPageUrl, number }
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

