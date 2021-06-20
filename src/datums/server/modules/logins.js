/*
 * @Author: your name
 * @Date: 2018-11-13 09:52:30
 * @LastEditTime: 2019-11-14 16:03:07
 * @LastEditors: Please set LastEditors
 * @Description: 登录、登出
 */
import axios from 'axios'
import { Message, MessageBox} from 'element-ui'
import store from '@/datums/store'
import { accountServer } from '../config'

  let baseURL = accountServer;
  let server = axios.create({   // 创建axios实例
    baseURL: baseURL, //默认服务器
    timeout: 5000, // 请求超时时间
    headers: {
        get: {'Content-Type': 'application/json;charset=UTF-8'},
        post:{'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
    },
  })

  server.interceptors.request.use(
    config => {
      if (store.getters.userInfo) {  
        let userInfo = store.getters.userInfo;
        config.headers.common = { //请求头信息
          'session_username': userInfo.session_username,
          'session_uuid':userInfo.session_uuid,
          'session_source':userInfo.session_source
        };
        
      }
      return config
    }, 
    error => {
      Promise.reject(error)
    }
  )

  // respone拦截器
  server.interceptors.response.use(
    response => {
      //前后端约定状态码 
      const res = response.data
      if (res.code !== 1) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 5 * 1000
          })
          // 根据服务端约定的状态码：1:成功; 0:失败; -1:Token过期/未登录/请求头错误;
          if (res.code === -1) {
              MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
              }).then(() => {
                  store.dispatch('LogOut').then(() => {
                    location.reload()// 为了重新实例化vue-router对象 避免bug
                  })
              })
          }
          return Promise.reject('error')
      } else { //1:成功;
          return response.data
      }
    },
    error => {
      let msg = error.msg;

      //http错误码
      if(error.response.status == 601){
        msg = error.response.data.msg
      }
     
      //http错误提示 setTimeout(Loading.service().close(),2000)
      Message({
        message: msg,
        type: 'error',
        duration: 3 * 1000
      })

      // http错误码的操作   601:未登录;
      if (error.response.status === 601) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
            store.dispatch('LogOut').then(() => {
              location.reload()// 为了重新实例化vue-router对象 避免bug
            })
        })
      }
      return Promise.reject(error)
    }
  )

export default server;
