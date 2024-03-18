```js

<template>
  <div>
  
    <button @click="showDrawer">打开Drawer演示</button>

    <xui-drawer 
      :visible="drawerVisible" 
      :on-close="handleDrawerClose">
      <p>这是 Drawer 内容</p>
    </xui-drawer>
    
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const drawerVisible = ref(false);

    const showDrawer = () => {
      drawerVisible.value = true;
    };

    const handleDrawerClose = () => {
      drawerVisible.value = false;
    };

    return {
      drawerVisible,
      showDrawer,
      handleDrawerClose,
    };
  },
};
</script>

```