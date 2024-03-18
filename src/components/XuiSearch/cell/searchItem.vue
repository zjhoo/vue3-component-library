<!--
 * @Author: zjhoo
 * @Date: 2023-09-09 10:14:39
 * @LastEditors: zjhoo
 * @LastEditTime: 2023-09-09 13:56:48
 * @Description: 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div>
    <el-input v-if="data.type === 'input'" v-model="condition[data.key]" clearable :placeholder="data.placeholder || data.label" />
    <el-select v-if="data.type === 'select'" v-model="condition[data.key]" clearable :placeholder="data.placeholder || data.label">
      <el-option v-for="opt in data.options" :key="opt.value" :label="opt.label" :value="opt.value">
        {{opt.label}}
      </el-option>
    </el-select>
    <el-date-picker v-if="data.type.indexOf('date') === 0" :type="data.type" v-model="condition[data.key]" clearable :placeholder="data.placeholder || data.label"></el-date-picker>
  </div>
</template>

<script>
export default {
  name: "SearchItem",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    condition: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style lang="scss" scoped></style>
