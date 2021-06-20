import { getStore }from '@/utils/mUtils'
import { asyncRouterMap, constantRouterMap } from '@/router/index'
// import { topRouterMap } from "@/router/topRouter";

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    // topRouters:[],
    topTitle:'',
    menuIndex:0,   
    browserHeaderTitle: getStore('browserHeaderTitle') || 'Admin',
    hasAddRouters:false, //左侧菜单
  },
  getters:{
    routers: state => state.routers,            // 所有路由
    addRouters: state => state.addRouters,  // 权限过滤路由
    // topRouters: state => state.topRouters,  // 顶部三级路由
    topTitle:state => state.topTitle, // 顶部的title
    menuIndex:state => state.menuIndex, // 顶部菜单的index
    
    browserHeaderTitle: state => state.browserHeaderTitle,
    hasAddRouters: state => state.hasAddRouters,
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers // 权限路由
      state.routers = constantRouterMap.concat(routers) // 总路由
    },
    SET_HASADDROUTERS: (state, hasAddRouters) => {
      state.hasAddRouters = hasAddRouters
    },
    SET_BROWSERHEADERTITLE: (state, action) => { //网页title
        state.browserHeaderTitle = action.browserHeaderTitle
    },
    // CLICK_INNER_LEFT_MENU:(state,data) => { // titleList:arr
    //     state.topRouters = data.titleList;
    // },
    CLICK_TOP_MENU:(state,data) => {
      state.topTitle = data.title
      state.menuIndex = data.menuIndex

    },
    
  },
  actions: {
    ClickLeftInnerMenu({ commit },data) {
      commit('CLICK_INNER_LEFT_MENU',data)
    },
    ClickTopMenu({ commit },data) {
      commit('CLICK_TOP_MENU',data)
    }
  }
}

export default permission
