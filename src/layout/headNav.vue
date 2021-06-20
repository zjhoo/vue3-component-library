<template>
    <!-- <header class="head-nav rflex " :style="{'width':headNavWidth+'px'}" id='header_container'> -->
    <header class="head-nav rflex " style="width:100%;" id='header_container'>
        <div class="menu_page_top rflex">
            <img :src="logo"  :alt="$store.getters.sysName" style="width:90px;margin-right:10px;margin-left:10px;" >
            <span class='title' v-show="sidebar.opened">{{  $store.getters.sysName }}</span>
        </div>
        <!-- <top-menu></top-menu> -->
        <div  class="right-nav" ref="rightNav">
            <el-menu  class="el-menu-demo" mode="horizontal"  >
                <el-submenu index="1" popper-class="langItem" class="userdown">
                    <template slot="title">
                        <i class="iconfont iconuser" style="color:#a9d86e;"></i>
                        <span class='name avatarname' > {{ this.$store.getters.userName }} </span>
                        <!-- <i class="iconfont icondown"></i> -->
                    </template>
                    <div class="userDownList">
                        <el-menu-item index="1-1" class="intro" @click="onAddCar">
                            <i class="iconfont iconshezhi"></i>
                            <span class="intro">修改密码</span>
                        </el-menu-item>
                        <el-menu-item index="1-2" class="intro" @click="goLogOut">
                            <i class="iconfont iconxinnengyuan-dengrudengchu logoutIcon"></i>
                            <span>退出</span>
                            <!-- <span class="logout"  @click="goLogOut">
                                <icon-svg class="logoutIcon" icon-class="iconwancheng" style="color:#2CFA4E;"/>退出
                            </span> -->
                        </el-menu-item>
                    </div>
                </el-submenu>
            </el-menu>
            
        <setPassword  v-if="setPassword.show" :isShow="setPassword.show" :dialogRow="setPassword.dialogRow"   @closeDialog="hidesetPassword"></setPassword>
        
        </div>
    </header>
</template>

<script>
    import { mapGetters } from "vuex";
    import * as mUtils from '@/utils/mUtils'
    import { setToken,getToken } from '@/utils/auth'
    import store from "@/datums/store";
    import { logout } from "@/datums/api/logins";
    import topMenu from "./topMenu";
    import logoImg from "@/assets/img/logo.png";
    import setPassword from "../components/setPassword";


    export default {
          name: 'head-nav',
          data(){
            return{
                logo:logoImg,
                menu:{
                    userBgcolor:'#f0f2f5'
                },
                showSetPassword:true,
                authorityDialog:{
                    show:true
                },
                setPassword:{  
                    show:false,
                    dialogRow:{}
                },
            }
          },
          components:{
            topMenu,setPassword
          },
          computed:{
            ...mapGetters(['name','avatar','sidebar']),
            //  headNavWidth(){
            //     return document.body.clientWidth - this.sidebar.width
            // }
              
          },
          created(){
            
          },
          mounted(){
          },
          methods:{
               // 
                onAddCar(row){
                    this.setPassword.dialogRow = {...row};
                    this.showsetPassword();
                },
                // 
                showsetPassword(val){
                    this.$store.commit('SET_DIALOG_TITLE', val)
                    this.setPassword.show = true;
                },
                hidesetPassword(){
                    this.setPassword.show = false;
                },
                // 切换语言
                closeSetDialog(){
                     this.authorityDialog.show = true;
                    // this.showSetPassword = false;
                },

              //退出登出
                goLogOut(){
                    console.log(this.$store.getters.userNameEN)
                    let data = {
                            username:this.$store.getters.userNameEN,
                            source:'pc'
                    }
                    logout(data).then(res => {
                        store.commit("SET_USERINFO",''); 

                        // this.$router.push({ path: '/' })
                        setTimeout(()=>{
                            location.reload() 
                        },500)
                    })
                },

              showWechat(){
                  this.wechat.isWechat = true;
              },
              hideWechat(){
                 this.wechat.isWechat = false;
              },
              showQq(){
                  this.qq.isQq = true;
              },
              hideQq(){
                  this.qq.isQq = false;
              },
              logout(){
                  this.$store.dispatch('LogOut').then(() => {
                      location.reload();
                  })
              },
             /**
             * 弹出框-修改密码或者系统设置   
             * @param {string} cmditem 弹框类型
             */
            setDialogInfo(cmditem) {
                switch (cmditem) {
                    case 'info':
                        this.$router.push('/infoManage/infoShow/infoShow1');
                        break;
                    case 'pass':
                        this.$router.push('/infoManage/infoModify/infoModify1');
                        break;
                    case 'logout':
                        this.logout();
                        break;
                }
            },
            
          }
    }
</script>
<style>
  
</style>
<style lang="css">
    .el-submenu__title:hover {
        background-color: transparent!important;
        color:#cbd8f3!important;
    }
    .el-submenu__title:hover .head-nav .avatarname{
        color:#cbd8f3!important;
    }
    .el-submenu__title i {
        color:#cbd8f3!important;
    }
    .el-dialog el-dialog--center{
        z-index: 2002 !important;
    }
</style>

<style scoped lang='less'>
    
    .userdown{
        float: right;
        
    }
    .userDownList{
        .iconshezhi{
            padding-right: 10px;
        }
        .logoutIcon{
            padding-right: 10px;
        }
    }
    .menu_page_top{
        // width:100%;
        height: 60px;
        padding-left: 10px;
        align-items: center;
        justify-content: space-around;
        text-transform: uppercase;
        box-sizing: border-box;
        // box-shadow:0px 2px 5px 0px rgba(230,224,224,0.5);
        .logo {
            height: 36px;
            vertical-align: middle;
            display: inline-block;
        }
        .closeLogo{
            width:30px;
            height:30px;
        }
        .title{
            font-size: 24px;
            font-weight: 700;
            // font-family: 'Courier New', Courier, monospace;
            i{
                color:#FF6C60;
                font-size: 22px;
            }
        }
    }
    .right-nav{
        display: flex;
        // flex: 1;
        // width:calc(100% - 180px);
        padding-right: 15px;
        justify-content: space-between;
        // box-shadow:0px 2px 5px 0px rgba(237,233,233,0.5);
        .el-menu, .el-menu:hover,.el-submenu__title:hover{
            background-color:transparent;
        }
    }
    .head-nav {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 29;
        transition: width .2s;
        justify-content: space-between;
        height: 60px;
        box-sizing: border-box;
        // background: #2d4f7f;
        // background-color: #00a1ff;
        background-image: url('../assets/img/headNav-bg.png' );
        background-size: 100% auto;
        // background-image: linear-gradient(-8deg, #00a1ff, #3500c7); 
        color: #fff;
        .avatarname{
            color:#fff;
        }
        .logout {
            vertical-align: middle;
            cursor: pointer;
        }
    }
    .middle{
       align-items: center;
       border:1px solid;
    }
    .userinfo-right{
        width:320px;
        padding: 0 10px;
        justify-content: space-between;
        .logout{
            display: inline-block;
            font-size: 14px;
            font-weight: 500;
            padding-left: 20px;
            .logoutIcon{
                height: 14px;
            }
        }
    }
    .userinfo {
        line-height: 60px;
        text-align:right;
    }
    .avatar{
        width: 32px;
        height: 32px;
        border-radius: 50%;
        vertical-align: middle;
        display: inline-block;
    }
    .langAvatar{
        width: 24px;
        height: 24px;
        border-radius: 50%;
        vertical-align: middle;
        display: inline-block;
    }
    .welcome{
        display: inline-block;
        vertical-align: middle;
        padding: 0 5px;
        .name{
            line-height: 20px;
            text-align: center;
            font-size: 12px;
        }
        .avatarname{
            color:#a9d86e;
            font-weight:bolder;
            font-size: 13px;
        }
    }

    .username {
        cursor: pointer;
        margin-right: 5px;
    }
    .border{
        border:1px solid;
    }
    .notify-row{
        line-height:60px;
        flex:1;
        ul{
           display: flex;
           justify-content: space-around;
        }
    }
   
    ul.top-menu > li {
        position: relative;
    }
</style>
