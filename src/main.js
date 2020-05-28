/*
 * @Author: shiliangL
 * @Date: 2020-05-27 09:43:51
 * @LastEditTime: 2020-05-28 15:35:26
 * @LastEditors: Do not edit
 * @Description:
 * @FilePath: /topevery-ui-admin/src/main.js
 */
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css

import Vue from 'vue'
import Cookies from 'js-cookie'
import Element from 'topevery-element-ui'

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

import BaiduMap from 'vue-baidu-map-topevery'
// import BaiduMap from '@/vmap'
Vue.use(BaiduMap, {
  ak: '71ce4e39b5be9ddfb56e3169cafc3922'
})

Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
