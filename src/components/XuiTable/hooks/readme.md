<!--
 * @Author: zjhoo
 * @Date: 2023-09-11 09:25:42
 * @LastEditors: zjhoo
 * @LastEditTime: 2023-09-11 09:28:59
 * @Description: 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->

> 使用说明

```js
<template>
  <div>
    <button @click="openAddDialog">Add Item</button>
    <button @click="openEditDialog(itemData)">Edit Item</button>
    <use-dialog :dialog="dialog" :form-data="formData">
      <!-- 这里是插槽内容 -->
      <form>
        <label>Title</label>
        <input v-model="formData.title" />
      </form>
    </use-dialog>
  </div>
</template>

<script>
import useAddEditDialog from '@/hooks/useAddEditDialog';

export default {
  components: {
    useAddEditDialog,
  },
  setup() {
    const { openAddDialog, openEditDialog, dialog, formData } = useAddEditDialog();

    return {
      openAddDialog,
      openEditDialog,
      dialog,
      formData,
    };
  },
};
</script>


```