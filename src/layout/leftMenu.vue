<template>
   <div class="menu_left cflex" :style="{width:sidebar.width+'px'}">
      <!-- <div class="myRouterList"> 
          <router-link class="routerItem"  :to="{path: '/index/index'}"> 运营监控 </router-link>
          <router-link class="routerItem"  :to="{path: '/task/taskExe'}"> 执行中的任务 </router-link>
          <router-link class="routerItem" :to="{path: '/task/taskAnomaly'}"> 异常任务 </router-link>

          <router-link class="routerItem" :to="{path: '/car/index'}"> 车辆管理 </router-link>
          <router-link class="routerItem" :to="{path: '/terminalManage/anomalyList'}"> 终端管理 </router-link>

          <router-link class="routerItem" :to="{path: '/siteManage/index'}"> 场地管理 </router-link>
          <router-link class="routerItem" :to="{path: '/anomalyManage/anomalyList'}"> 异常管理 </router-link>

          <router-link class="routerItem" :to="{path: '/userManager/userRole'}"> 用户角色管理 </router-link>
          <router-link class="routerItem" :to="{path: '/userManager/userAccount'}"> 用户账号管理 </router-link>
      </div> -->
        <div class="menu_page_bottom is-scroll-left my-left-menu">
            <el-menu 
                mode="vertical"
                theme="dark" 
                :show-timeout="200"
                :default-active="$route.path" 
                :background-color = menuObj.bgColor
                :collapse="isCollapse"
                :text-color="menuObj.textColor"
                :active-text-color="menuObj.activeTextColor"
                style="width:100%;"
                >
                    <!-- <div v-for="(item,index) in routers">
                        {{ item.children[0].path}}
                    </div> -->
                    <template v-for="(item,index) in routers">
                      <!--表示 有一级菜单-->
                      <router-link v-if="!item.hidden && item.noDropdown" :to="item.path+'/'+item.children[0].path" :key="index">
                          <el-menu-item class="dropItem" 
                              :index="item.path+'/'+item.children[0].path"
                              >
                              <!-- <icon-svg v-if="item.meta.icon" :icon-class="item.meta.icon" /> -->
                              <i class="iconfont " :class=" item.meta.icon" ></i>
                              <span v-if="item.meta.title" slot="title">{{ item.name }}</span> 
                          </el-menu-item>
                      </router-link>

                      <!--表示 有二级或者多级菜单 -->
                      <el-submenu v-if="item.children  && item.children.length >= 1 && !item.hidden && !item.noDropdown"  :index="item.path" :key="index">
                          <template slot="title">
                              <icon-svg v-if="item.meta.icon" :icon-class="item.meta.icon" />
                              <span v-if="item.meta.title" slot="title">{{ item.name }}</span>
                          </template>
                          <!--直接定位到子路由上，子路由也可以实现导航功能-->
                          <router-link v-for="(citem,cindex) in item.children" :to="getIindex(citem,item,cindex)"  :key="cindex">
                              <el-menu-item 
                                  v-if="citem.meta.routerType != 'topmenu' && citem.meta.title"
                                  :index="getIindex(citem,item,cindex)">
                                  <span slot="title"> {{ citem.name }}</span>
                              </el-menu-item> 
                          </router-link>
                      </el-submenu>
                  </template>
            </el-menu>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/datums/store'

// import * as mUtils from "@/utils/mUtils";

export default {
  name: "left-Menu",
  data() {
    return {
        routers:'',
        menuObj:{
         bgColor:'#fff',
         textColor:'#666',
         activeTextColor:'#ffffff',
         activeTextBgColor:'#306294'
       },
       iconColor:{

       }
    };
  },
  computed:{
      ...mapGetters([
        // 'routers',
        'isCollapse',
        'sidebar',
        'menuIndex'
      ]),
  },
  created(){
    },
  mounted(){
    this.routers = store.getters.hasAddRouters;
    // console.log(JSON.stringify(store.getters.hasAddRouters))
  },
  methods: {
    getIindex(citem,item,cindex){
      return (citem.meta.titleList)?item.path+'/'+citem.path+'/'+citem.meta.titleList[0].path:item.path+'/'+citem.path;
    }
  }
};
</script>


<style lang="less" scoped>
  @left-bgColor:#fff;  // 左侧菜单背景颜色;
  @icon-link:#FF6C60;
    .menu_left{
        position: absolute;
        top:60px;
        left:0;
        bottom:0;
    }
  .menu_page_bottom {
      width:100%;
      // overflow-y: scroll;
      overflow-x: hidden;
      flex:1;
      margin-top:3px;
      z-index: 10;
      box-shadow: 0 0 10px 0 rgba(230, 224, 224, 0.5)
  }

  .myRouterList{
    padding-top: 30px;
    .routerItem{
      display: block;
      width: 100%;
      line-height: 50px;
      text-align: center;
      border-bottom: 1px solid #eaebec;
      color:#306294;
    }
    .routerItem:hover{
      background: #306294;
      color:#fff;
    }
  }
  .dropItem{
      display: block;
      width: 100%;
      text-align: center;
        i{
            padding-right:10px;
            padding-left:3px;
        }
  }
</style>
