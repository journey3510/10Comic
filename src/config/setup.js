/* eslint-disable no-unused-vars */
/* eslint-disable no-eval */
/* eslint-disable no-undef */
import { AppVersion, isDev } from '@/config/index'

// 脚本存储信息
const configDefault = {
  version: AppVersion,
  appLoadDefault: {
    isShowUI: false,
    loadHotKey: 'V', // alt + loadHotKey
    rightSize: 100,
    centerSize: 100
  },
  maxChapterNum: 2,
  maxPictureNum: 3,
  downType: 0,
  maxSplicingHeight: 20000,
  imgIndexBitNum: 3,
  imgSplicingFlag: true,
  imgDownRange: [1, -1], // 章节图片下载范围  第1张至最后1张
  // downHistory: '[]', // 废弃
  userWebInfo: [],
  rootDir: '10Comic'
}

// 网页 localStorage 存储信息
const localStorageDefault = {
  ylComicDownHistory: '[]'
}

// 油猴脚本存储 废弃变量
const abandonDefault = ['downHistory']

export const appLoadinit = () => {
  if (isDev) {
    return
  }

  for (const key in localStorageDefault) {
    if (localStorage.getItem(key) == null) {
      localStorage.setItem(key, localStorageDefault[key])
    }
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

  // 油猴存储 去除废弃变量存储数量
  abandonDefault.forEach(word => {
    if (GM_getValue(word) !== undefined) {
      GM_deleteValue(word)
    }
  })

  GM_setValue('version', AppVersion)
  GM_setValue('maxChapterNum', 2)

  return true
}

export const setinit = async() => {
  return new Promise((resolve, reject) => {
    if (isDev) {
      resolve(false)
    }
    for (const key in configDefault) {
      GM_setValue(key, configDefault[key])
    }
    resolve(true)
  })
}

export const setStorage = (key, value, key2 = null) => {
  // console.log('value: ', value)
  if (key2) {
    const obj = GM_getValue(key)
    obj[key2] = value
    value = obj
  }
  GM_setValue(key, value)
  return true
}

export const getStorage = (key) => {
  return GM_getValue(key)
}
