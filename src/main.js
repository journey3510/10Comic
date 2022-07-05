import Vue from 'vue'
import App from './app.vue'

import { isDev } from './config'
import { loadStyle } from './utils'
import './styles/global.scss'

import Vant from 'vant'
import 'vant/lib/index.css'

const id = `app_vue_${Date.now()}`
const root = document.createElement('div')
const root2 = document.createElement('div')
root.id = id
root2.id = 'xxxxxxxxxxxxx'
root2.style = 'height:200px;width:600px;'
document.body.appendChild(root)
document.body.appendChild(root2)

Vue.prototype.$bus = new Vue()

if (isDev) {
  const ElementUI = require('element-ui')
  loadStyle('https://unpkg.com/element-ui@2.14.1/lib/theme-chalk/index.css')
  // loadStyle('https://unpkg.com/vant@2.12/lib/index.css')
  Vue.use(ElementUI)
  Vue.use(Vant)
}

new Vue({
  el: `#${id}`,
  render: h => h(App)
})
