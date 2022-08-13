/* eslint-disable no-eval */
/* eslint-disable no-undef */
import { AppVersion, isDev } from '@/config/index'

const configDefault = {
  version: AppVersion,
  maxChapterNum: 3,
  maxPictureNum: 3,
  zipDownFlag: true,
  imgSplicingFlag: true,
  downHistory: '[]',
  userWebInfo: [
    {
      domain: 'manhua.dmzj.com',
      homepage: 'https://manhua.dmzj.com/',
      webName: '动漫之家',
      comicNameCss: '.odd_anim_title_m .anim_title_text h1',
      chapterCss: '.cartoon_online_border',
      readtype: 1,
      testReg: '/dsadde/g',
      getImgs: `async function(context) {
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
      }`
    }
  ]
}

export const appinit = async() => {
  return new Promise((resolve, reject) => {
    if (isDev) {
      return
    }
    // 如条件全为false, 则更新设置
    if (GM_getValue('version') !== undefined && GM_getValue('version') === AppVersion) {
      console.log('不需要更新数据')
      return
    }
    for (const key in configDefault) {
      // 不存在，添加
      if (GM_getValue(key) === undefined) {
        GM_setValue(key, configDefault[key])
      }
    }
    GM_setValue('version', AppVersion)
    GM_setValue('maxChapterNum', 2)
    resolve(1)
  })
}

export const setinit = async() => {
  if (isDev) {
    return
  }
  return new Promise((resolve, reject) => {
    for (const key in configDefault) {
      GM_setValue(key, configDefault[key])
    }
    resolve(true)
  })
}

export const setStorage = async(key, value) => {
  return new Promise((resolve, reject) => {
    GM_setValue(key, value)
    resolve(true)
  })
}

export const getStorage = async(key) => {
  return new Promise((resolve, reject) => {
    const value = GM_getValue(key)
    resolve(value)
  })
}
