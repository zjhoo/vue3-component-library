<template>
    <el-dialog
      v-model="visible"
      :title="title"
      :width="width"
      :draggable="true"
      :before-close="beforeClose"
      :visible.sync="visible">
      <div style="padding:20px">
        <slot></slot>
      </div>

      <div slot="footer" style="display:flex;justify-content: flex-end;padding:10px;">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleConfirm">确定</el-button>
      </div>

    </el-dialog>
  </template>
  
  <script setup>
  import { ref, onMounted, defineProps } from 'vue';
  
  const props = defineProps({
    onConfirm: Function, // 声明外部传入的 onConfirm 属性类型为函数
  });

  const visible = ref(false);
  const title = ref('');
  const width = ref('');
  const loading= ref(false)
  let closeCallback;
  
  const openDialog = (dialogTitle, dialogWidth) => {
    title.value = dialogTitle || '';
    width.value = dialogWidth || '50%';
    visible.value = true;
  };
  
  const closeDialog = () => {
    loading.value = false
    visible.value = false;
    if (closeCallback) {
      closeCallback();
      closeCallback = null;
    }
  };
  
  const beforeClose = (done) => {
    closeCallback = done;
    visible.value = false;
    if (props.onClose && typeof props.onClose === 'function') {
      props.onClose();
    }
  };

  const handleConfirm = () => {
    loading.value = true
    if (props.onConfirm && typeof props.onConfirm === 'function') {
      props.onConfirm();
    }
    // closeDialog()  需要自己调用xuiDialogClose() 关闭 
  }
  
  onMounted(() => {
    // 在挂载后暴露 openDialog 和 closeDialog 函数
    window.xuiDialogOpen = openDialog;
    window.xuiDialogClose = closeDialog;
    window.xuiDialogConfirm = handleConfirm
  });
  </script>
  