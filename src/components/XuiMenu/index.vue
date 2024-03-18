<template>
    <el-scrollbar class="cpt-xui-menu">
      <el-menu
        :style="{'max-height':'calc(100vh - 80px)'}"
        class="el-menu-vertical-demo"
        text-color="#040B19"
        active-text-color="#2773FF"
  
        :unique-opened="true"
        :collapse="isCollapse"
        router
  
        :default-active="activeMenu" 
        mode="vertical"
        @select="handleMenuSelect">
        <SubMenu v-for="(menuItem,i) in menuItems"
          :key="`menuItem-${i}`"
          :collapse="isCollapse"
          :tier="1"
          :menuItem="menuItem"></SubMenu>
      </el-menu>
    </el-scrollbar>
  </template>
  
  <script>
  import { ref, defineProps, defineEmits,computed } from "vue";
  import SubMenu from "./cell/SubMenu.vue"; 
  import { useRoute } from "vue-router";

  import menuStore from "@/store/menu";
 
 
  
  export default {
    setup() {
      // const props = defineProps(["menuItems"]);
      // const { emit } = defineEmits(["select"]);
  
      // const activeMenu = ref("");
  
      const handleMenuSelect = (key) => {
        // activeMenu.value = key;
        // emit("select", key);
      };

      const getMenuLists = menuStore();
      const menuItems = computed(() => {
        return getMenuLists.leftMenuList.length > 0
            ? getMenuLists.leftMenuList
            : getMenuLists.menuList;
      });

      const isCollapse = computed(() => {
        return getMenuLists.collapse;
      });

      const route = useRoute();
      const activeMenu = computed(() => {
        return route.path;
      });

      // console.log('=========================', menuItems.value);
  
      return {
        activeMenu,
        handleMenuSelect,
        menuItems,
        isCollapse
      };
    },
  };
  </script>
  <style>
  .cpt-xui-menu .el-menu .is-active, .cpt-xui-menu .el-menu-item .is-active {
    color: #409eff!important
  }
  </style>


  
  