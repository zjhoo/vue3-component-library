/*
 * @Author: your name
 * @Date: 2019-10-28 17:50:53
 * @LastEditTime: 2019-11-14 17:41:34
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \vrccc-client-ui\src\datums\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'
if(process.env.NODE_ENV === "development"){
    Vue.use(Vuex) 
} 

import sys from './modules/sys'     //系统常量
import logins from './modules/login'
import permission from './modules/permission'
import userDialog from './modules/user'
import menu from './modules/menu'


export default new Vuex.Store({
    modules: {
        sys,
        logins,
        permission,
        userDialog,
        menu
    }
});

