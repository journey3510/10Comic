/* eslint-disable no-undef */
import { AppVersion, isDev } from '@/config/index'

const configDefault = {
  version: AppVersion,
  maxChapterNum: 3,
  testdata: 'eee'
}

export const appinit = () => {
  if (isDev) {
    return
  }
  console.log(`GM_getValue('version'): `, GM_getValue('version') !== undefined)
  // 如条件全为false, 则更新设置
  if (GM_getValue('version') !== undefined && GM_getValue('version') === AppVersion) {
    console.log(`GM_getValue('version'): `, GM_getValue('version'))
    return
  }
  for (const key in configDefault) {
    // 不存在，添加
    if (GM_getValue(key) === undefined) {
      console.log('添加', configDefault[key])
      GM_setValue(key, configDefault[key])
    }
  }
  GM_setValue('version', AppVersion)
}

export const setinit = () => {
  if (isDev) {
    return
  }
  for (const key in configDefault) {
    const element = configDefault[key]
    console.log('修改')
    GM_setValue(key, configDefault[key])
    console.log('element: ', element)
  }
}
