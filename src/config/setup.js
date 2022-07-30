/* eslint-disable no-undef */
import { AppVersion, isDev } from '@/config/index'

const configDefault = {
  version: AppVersion,
  maxChapterNum: 3,
  maxPictureNum: 3,
  imgSplicing: true
}

export const appinit = () => {
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
