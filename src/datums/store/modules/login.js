import * as mUtils from '@/utils/mUtils'
import { logout } from '@/datums/api/logins'  // 登陆相关接口
import { getStorage, setStorage, removeStorage } from '@/utils/auth'


const login  = {
  state : {
    userName:getStorage('userInfo')?JSON.parse( getStorage('userInfo') ).userName:'',//中文名称,
    userNameEN:getStorage('userInfo')?JSON.parse( getStorage('userInfo') ).session_username:'',//英文名称,
    avatar:'',
    token: getStorage('userInfo')?JSON.parse( getStorage('userInfo') ).session_uuid:'',//token,
    userInfo: getStorage('userInfo')?JSON.parse( getStorage('userInfo') ):'',//登陆用户的信息
    userId: getStorage('userInfo')?JSON.parse( getStorage('userInfo') ).session_id:'',//登陆用户的信息
    userSource: getStorage('userInfo')?JSON.parse( getStorage('userInfo') ).session_source:'',//登陆用户的信息
  },
  getters : {
    token: state => state.token,
    userInfo: state => state.userInfo,
    userId:state => state.userId,
    userSource:state => state.userSource,
    avatar: state => state.avatar,
    userName: state => state.userName,
    userNameEN: state => state.userNameEN,
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      setStorage('token', token)
    },
    SET_USERINFO:(state,userInfo) => {
      setStorage('userInfo',userInfo)
    },

    SET_ROLES: (state, roles) => {
        state.roles = roles
    },
    SET_NAME: (state, userName) => {
      state.userName = userName
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    }
  },
  actions:{
      
      LogOut({ commit }) {  //登出
        return new Promise((resolve, reject) => {
          let userInfo = this.getters.userInfo;
          let reqData = {
            username:userInfo.session_username,
            source:userInfo.session_source
          }
          logout(reqData).then(response => {
            removeStorage('token')
            removeStorage('userInfo')
            resolve()
          })
        })
      },

      
      
      // 动态修改权限;本实例中,role和token是相同的;
      // ChangeRoles({ commit }, role) {
      //   return new Promise(resolve => {
      //     const token = role;
      //     setStorage("Token",token)
      //     getUserInfo({"token":token}).then(res => {
      //       let data = res.data.userList;
      //       commit('SET_ROLES', data.roles)
      //       commit('SET_NAME', data.name)
      //       commit('SET_AVATAR', data.avatar)
      //       resolve()
      //     })
      //   })
      // },
      
  }
}

export default login;