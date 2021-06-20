/*
 * @Author: zjhoo
 * @Date: 2019-10-28 17:50:53
 * @LastEditTime: 2019-11-14 16:00:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vrccc-client-ui\src\main.js
 */
import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/datums/store'
// 'development',use package;'production':use cdn;
import ElementUI from 'element-ui'
Vue.use(ElementUI, { size: 'mini'});
import('element-ui/lib/theme-chalk/index.css')

import './components/iconSvg' 

import '@/permission' // permission control

// import '@/mockjs'; // mock数据
// i18n国际化
import i18n from "@/lang";

// 分享功能集合
// import axios from './utils/axios';
// Vue.prototype.shareConfig = shareConfig;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
