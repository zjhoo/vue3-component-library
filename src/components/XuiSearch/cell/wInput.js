import { h } from 'vue';

export default {
  emits: ['update'], // 声明允许使用的事件，与 v-model 相关
  render() {
    return h('input', {
      value: this.modelValue,
      onInput: (event) => {
        this.$emit('update', event.target.value); // 触发 update:modelValue 事件，更新父组件数据
      },
    });
  },
  props: {
    modelValue: String, // 接受 v-model 绑定的数据
  },
};
