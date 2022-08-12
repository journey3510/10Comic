import Vue from 'vue'
import App from './app.vue'

import { isDev } from './config'
import { loadStyle2 } from './utils'

import './styles/global.scss'
import './styles/global.less'

import Vant from 'vant'
// import 'vant/lib/index.css'
Vue.use(Vant)

const id = `app_vue_${Date.now()}`
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
  // 下面引入导致打包文件变大 10K
  // import('vant/lib/index.css').then((res) => {
  //   new Vue({
  //     el: `#${id}`,
  //     render: h => h(App)
  //   })
  // })
} else {
  // eslint-disable-next-line no-undef
  GM_addStyle(GM_getResourceText('vantcss'))
  new Vue({
    el: `#${id}`,
    render: h => h(App)
  })
}
