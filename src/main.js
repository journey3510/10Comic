/* eslint-disable no-undef */
import Vue from 'vue'
import App from './app.vue'

import './styles/global.scss'
import './styles/global.less'

import { isDev } from './config'
import { loadStyle2 } from './utils'
import { getStorage, appLoadinit, setinit } from '@/config/setup'

var id = null
var appLoadDefault = null
try {
  appLoadinit()
  appLoadDefault = getStorage('appLoadDefault')
  GM_registerMenuCommand(`加载UI (Alt + ${appLoadDefault.loadHotKey})`, loadUI)
  GM_registerMenuCommand(`重置所有数据`, setinit)
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toUpperCase() === appLoadDefault.loadHotKey.toUpperCase()) {
      loadUI()
    }
  })
  if (appLoadDefault.isShowUI) {
    loadUI()
  }
} catch (error) {
  console.log('loadError: ', error)
  loadUI()
}

async function loadUI() {
  if (id !== null) {
    return
  }
  var Vant = await import('vant')
  // import ('vant/lib/index.css')
  Vue.use(Vant)

  id = `app_vue_${Date.now()}`
  const root = document.createElement('div')
  root.id = id
  document.body.appendChild(root)
  Vue.prototype.$bus = new Vue()

  if (isDev) {
    loadStyle2('https://unpkg.com/vant@2.12/lib/index.css').then((res) => {
      new Vue({
        el: `#${id}`,
        render: h => h(App)
      })
    })
  } else {
  // eslint-disable-next-line no-undef
    GM_addStyle(GM_getResourceText('vantcss'))
    new Vue({
      el: `#${id}`,
      render: h => h(App)
    })
  }
}
