
<template>
    <div class="menu_top wflex rflex" ref="menuTop">
        <el-menu 
            mode="horizontal" 
            class="el-menu-demo rflex el-scrollbar2 top-scrollbar2" 
            :background-color="menuObj.bgColor"
            :text-color="menuObj.textColor"
            :active-text-color="menuObj.activeTextColor"
            :default-active="$route.path" 
            >
            <template v-for="(item,index) in topRouters">
                <router-link :to="$route.matched[1].path+'/'+item.path" :key="index">
                    <el-menu-item :index="$route.matched[1].path+'/'+item.path">
                      {{ $t(`commons.${item.path}`) }}
                    </el-menu-item>
                </router-link>
            </template>
        </el-menu>




<template v-for="(item,index) in routers">
    <!--表示 有一级菜单-->
    <router-link v-if="!item.hidden && item.noDropdown" :to="item.path+'/'+item.children[0].path" :key="index">
        <el-menu-item class="dropItem" 
            :index="item.path+'/'+item.children[0].path"
            >
            <icon-svg v-if="item.meta.icon" :icon-class="item.meta.icon" />
            <span v-if="item.meta.title" slot="title">{{ $t(`commons.${item.name}`)}}</span> 
        </el-menu-item>
    </router-link>

    <!--表示 有二级或者多级菜单 -->
    <el-submenu v-if="item.children  && item.children.length >= 1 && !item.hidden && !item.noDropdown"  :index="item.path" :key="index">
        <template slot="title">
            <icon-svg v-if="item.meta.icon" :icon-class="item.meta.icon" />
            <span v-if="item.meta.title" slot="title">{{ $t(`commons.${item.name}`)}}</span>
        </template>
        <!--直接定位到子路由上，子路由也可以实现导航功能-->
        <router-link v-for="(citem,cindex) in item.children" :to="getIindex(citem,item,cindex)"  :key="cindex">
            <el-menu-item 
                v-if="citem.meta.routerType != 'topmenu' && citem.meta.title"
                :index="getIindex(citem,item,cindex)">
                <span slot="title"> {{ $t(`commons.${citem.name}`)}}</span>
            </el-menu-item> 
        </router-link>
    </el-submenu>
</template>




    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
  
    export default {
        name:'top-menu',
        data(){
            return {
                menuObj:{
                    bgColor:'',
                    textColor:'#303133',
                    activeTextColor:'#ff6428',
                },
            }
        },
        computed:{
            ...mapGetters(['topRouters'])
        },
        created(){
           this.setLeftInnerMenu();  // 针对刷新页面时，也需要加载顶部菜单
        },
        mounted(){
        },
        methods:{
            setLeftInnerMenu(){
                const titleList = this.$route.matched[1].meta.titleList;
                const currentTitle = titleList && this.$route.matched[2].meta.title;
                if( titleList && this.$route.matched[1].meta.routerType === 'leftmenu'){ // 点击的为 左侧的2级菜单
                    this.$store.dispatch('ClickLeftInnerMenu',{'titleList':titleList});
                    this.$store.dispatch('ClickTopMenu',{'title':currentTitle});
                }else{ // 点击左侧1级菜单
                    this.$store.dispatch('ClickLeftInnerMenu',{'titleList':[]});
                    this.$store.dispatch('ClickTopMenu',{'title':''});
                }
            },
            getPath(){
               this.setLeftInnerMenu();
            },
        },
        watch:{
            "$route":"getPath" 
        }
    }

</script>

<style lang="less" scoped>
    .menu_top{
        // width:calc(100% - 350px);
        .el-menu-demo{
            overflow-y:hidden;
            flex:1;
        }
        .el-menu-item:focus, .el-menu-item:hover {
            outline: 0;
            background-color: #ceeda8;
        }
        .router-link-active{
          
        }
    }
</style>