<template>
  <el-menu-item
    v-if="!menuItem.children || menuItem.children?.length<1"
    :title="menuItem.name"
    :class="{badMenu: isDadMenu }"
    :style="{paddingLeft:`${tier*16+40}px`}"
    :index="menuItem.vueUrl" @click="checkMenu">
    <!-- <el-icon :size="18" >
      <component :is="menuItem?.icon"> </component>
    </el-icon> -->
    <template #title>{{ menuItem.name }}</template>
  </el-menu-item>

    <el-sub-menu v-else :index="menuItem.id" v-bind="$attrs">
      <template #title>
        <el-icon :size="18">
          <component v-if="menuItem.icon" :is="menuItem.icon"> </component>
          <!-- <Football v-else style="color:#999" /> -->
        </el-icon>
        
        <span
          class="collapse"
          :class="{'collapse-active':collapse}"
          >{{ menuItem.name }}</span>
      </template>
      <SubMenu v-for="(child,i) in menuItem.children" :tier="tier+1"  :menuItem="child" :key="`${menuItem.id}-${i}`"></SubMenu>
      
    </el-sub-menu>

  </template>
  
  <script>
  import { ref } from "vue";
  import tabsStore from "@/store/tabs";
  
  export default {
    props: {
      menuItem: Object, // 菜单项对象
      collapse: Boolean,
      tier: Number,//菜单层级
    },
    setup(props){

      const isDadMenu = ref(false)
      const checkMenu = ()=>{
        if(props.menuItem.vueUrl && props.menuItem.pathSrc){
          const tabStore = tabsStore();
          if (tabStore.tags.length > 9) {
            tabStore.tags.splice(0, 1);
          }
          const data = props.menuItem
          console.log(data, "tag");
          tabStore.getTags({ name: data.name, path: data.vueUrl, id: data.parentId });

        }else{
          isDadMenu.value = true
          const timer = setTimeout(() => {
            isDadMenu.value = false;
            clearTimeout(timer);
          }, 800);
        }
      }
      return {
        checkMenu,
        isDadMenu
      }

      // console.log('item sub menu===============', props.menuItem);
    }
  };
  </script>
  <style lang="scss" scoped>
  .el-menu {
    background: transparent;
    border-right: 0;
  }
  
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 220px;
  }
  
  .el-icon {
    color: var(--el-color-primary);
  }
  
  .active {
    color: var(--el-color-primary);
  }
  
  // .is-active {
  //   color: #2773ff !important;
  //   background-color: #e9f1ff !important;
  //   border-right: 2px solid #2773ff !important;
  // }
  
  ::v-deep .el-menu {
    .el-menu-item {
      font-size: 16px !important;
    }
  
    .is-active {
      background-color: transparent !important;
      color: var(--el-color-primary) !important;
      border-right: 0 !important;
  
      .el-icon {
        color: var(--el-color-primary) !important;
      }
    }
  
    .is-opened {
      background-color: transparent !important;
      color: var(--el-color-primary) !important;
      border-right: 0 !important;
  
      .el-sub-menu__title {
        background-color: #e9f1ff !important;
        color: var(--el-color-primary) !important;
        font-size: 16px !important;
        // width: 212px;
        margin-left: 5px;
        border-right: 2px solid var(--el-color-primary) !important;
      }
  
      .el-menu-item {
        font-size: 14px !important;
        border-bottom: 1px solid #edf0f6;
        border-right: 0 !important;
        background-color: transparent !important;
      }
  
      .el-menu--inline {
        .el-menu-item {
          // color: #666 !important;
  
        }
  
        .is-active {
          // .el-sub-menu__title {
          //   background-color: transparent !important;
          //   color: #040b19 !important;
          //   border-right: 0 !important;
          // }
  
          span {
            color: var(--el-color-primary) !important;
          }
  
          background-color: transparent !important;
          border-right: 0 !important;
        }
  
        .el-menu--inline {
          .el-menu-item {
            color: #666 !important;
            font-size: 16px !important;
          }
  
          .is-active {
            background-color: transparent !important;
            color: var(--el-color-primary) !important;
            border-right: 0 !important;
          }
        }
  
  
        .el-sub-menu__title {
          background-color: transparent !important;
          border-right: 0 !important;
          color: #040b19 !important;
  
          span {
            background-color: transparent !important;
            color: #040b19 !important;
          }
  
        }
  
  
      }
    }
  
    // .el-sub-menu .is-active {
    //   background-color: transparent !important;
    //   color: #2773ff !important;
    //   border-right: 0 !important;
    // }
  
    .el-sub-menu__title {
      font-size: 16px !important;
    }
  
    // margin-left: 20px;
  }
  
  // ::v-deep .el-menu-item {
  //   font-size: 16px !important;
  //   // color: #040b19 !important;
  //   font-family: Source Han Sans SC-Regular, Source Han Sans SC;
  //   font-weight: 400;
  // }
  
  // ::v-deep.el-sub-menu .el-menu {
  ::v-deep .el-sub-menu__title {
    font-size: 16px !important;
    font-family: Source Han Sans SC-Regular, Source Han Sans SC;
    font-weight: 400;
    //菜单超出显示
    // span{
    //   overflow: hidden !important;
    // white-space: nowrap !important;
    // text-overflow: ellipsis !important;
    // }
  
  }
  
  ::v-deep .el-sub-menu__title:hover {
    background: transparent !important;
  }
  
  ::-webkit-scrollbar {
    display: none;
  }
  
  
  </style>
  <style>
  .collapse{
    transform: translateX(0px);
    transition: transform 0s ease;
  }
  .collapse-active {
    transform: translateX(100px);
  }

.badMenu {
  animation: badMenu 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes badMenu {

  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
    color: tomato;
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
    color: tomato;
  }
}

</style>
  