/* eslint-disable no-eval */
/* eslint-disable no-undef */
import { AppVersion, isDev } from '@/config/index'

const configDefault = {
  version: AppVersion,
  maxChapterNum: 2,
  maxPictureNum: 3,
  zipDownFlag: true,
  imgSplicingFlag: true,
  downHistory: '[]',
  userWebInfo: []
}

export const appLoadinit = () => {
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
  return
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

export const setStorage = (key, value) => {
  GM_setValue(key, value)
  return true
}

export const getStorage = (key) => {
  return GM_getValue(key)
}
