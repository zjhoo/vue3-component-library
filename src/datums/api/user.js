import request from '@/datums/server/modules/account'
import { stringify,parse } from 'qs'


//------------------ 角色 ------
export function getRolesList(params){       //分页获取角色列表
  return request({
    url:'/api/...',
    method:'get',
    params:params
  })
}

export function getRolesDownList(params){   //获取角色列表-下拉数据 
  return request({
    url:'/api/...',
    method:'get',
    params:params
  })
}

export function delRolesById(id){           //通过id删除某个角色
  return request({
    url:'/api/useConstroller/roles/delete',
    method:'get',
    params:id
  })
}

export function addRoles(params){           //api/useConstroller/roles/insert录入角色信息
  return request({
    url:'/api/useConstroller/roles/insert',
    method:'post',
    params:stringify(params)
  })
}

export function editRoles(params){           // 编辑角色   GET /api/useConstroller/roles/getRoleById
  return request({
    url:'/api/useConstroller/roles/update',
    method:'post',
    data:params
  })
}
