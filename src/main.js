import Vue from 'vue'
import App from './app.vue'
import Vant from 'vant'

import { isDev } from './config'
import { loadStyle } from './utils'

import './styles/global.scss'

const id = `app_vue_${Date.now()}`
const root = document.createElement('div')
root.id = id
document.body.appendChild(root)

if (isDev) {
  const ElementUI = require('element-ui')
  loadStyle('https://unpkg.com/element-ui@2.14.1/lib/theme-chalk/index.css')
  loadStyle('https://unpkg.com/vant@2.12/lib/index.css')
  Vue.use(ElementUI)
  Vue.use(Vant)
}
new Vue({
  el: `#${id}`,
  render: h => h(App)
})
