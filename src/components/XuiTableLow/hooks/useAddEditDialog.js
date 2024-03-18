/*
 * @Author: zjhoo
 * @Date: 2023-09-10 16:04:54
 * @LastEditors: zjhoo
 * @LastEditTime: 2023-09-11 09:25:30
 * @Description: 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { h, ref } from 'vue';
import { ElDialog, ElButton } from 'element-plus';

export default function useAddEditDialog() {
  const showDialog = ref(false);
  const isEdit = ref(false);
  const formData = ref({}); // 表单数据

  const openAddDialog = () => {
    isEdit.value = false;
    showDialog.value = true;
  };

  const openEditDialog = (data) => {
    isEdit.value = true;
    formData.value = { ...data }; // 初始化表单数据
    showDialog.value = true;
  };

  const closeDialog = () => {
    showDialog.value = false;
  };

  const saveData = () => {
    // 在这里处理保存数据的逻辑
    if (isEdit.value) {
      console.log('Editing data:', formData.value);
    } else {
      console.log('Adding data:', formData.value);
    }
    closeDialog();
  };

  const dialog = ({ title, slot }) => {
    return h(ElDialog, {
      modelValue: showDialog.value,
      title: isEdit.value ? `Edit ${title}` : `Add ${title}`,
      onClose: closeDialog,
    }, {
      default: slot, // 使用插槽内容作为默认插槽
      footer: () => [
        h(ElButton, { onClick: closeDialog }, 'Cancel'),
        h(ElButton, { type: 'primary', onClick: saveData }, 'Save'),
      ],
    });
  };

  return {
    openAddDialog,
    openEditDialog,
    dialog,
    formData,
  };
}
