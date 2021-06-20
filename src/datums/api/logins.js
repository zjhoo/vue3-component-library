import request from '@/datums/server/modules/logins'
import { stringify,parse } from 'qs'

export function login(params) {     //登入
  return request({
    url: '/api/login', 
    method: 'post',
    data:stringify(params),
  })
}

export function logout(params) {    //登出
  return request({
    url: '/api/logout',
    method: 'post',
    data:stringify(params)
  })
}


