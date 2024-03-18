<template>
  <div class="filter-wrapper">
    <div
      ref="fillter"
      class="filter-bar">
      <slot v-if="filter" />
      <Alert v-if="alert" class="tips" show-icon>
          已选择 <strong style="color:#2d8cf0;padding-right:2px">{{selections.length}}</strong>项
          <a class="ivu-ml" @click="$emit('clear-select-all')">清空</a>
      </Alert>

    </div>
    <div
      class="switcher"
      v-if="switcher"
      @click="$emit('switch', !card)">
      <Icon :type="card ? 'md-list' : 'ios-apps'" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableFilter',
  props: {
    filter: { // 是否显示filter
      type: Boolean,
      default: true,
    },
    card: { // 是否是以卡片形势显示
      type: Boolean,
      default: false,
    },
    switcher: { // 是否显示卡片切换开关
      type: Boolean,
      default: false,
    },
    alert: {
      type: Boolean,
      default: false,
    },
    tip: {
      type: String,
      default: '',
    },
    //选中数据变量
    selections: {
      type: Array,
      default: () => ([]),
    },

  },
  computed: {
    tipList() {
      if (!this.tip) { return [] }
      return this.tip.split(' ')
    },
  },
}
</script>

<style lang="scss" scoped>
.filter-wrapper {
  position: relative;
  display: block;
  /* min-height: 34px; */
  .filter-bar {
    flex: 1;
    position: relative;
    text-align: left;
    // margin: 16px 0px;
  }
  .switcher {
    align-self: flex-end;
    cursor: pointer;
    i {
      margin-left: 10px;
      margin-bottom: 5px;
      font-size: $FONT-SIZE-16 + 4px;
    }
  }
}
.tips {
  display: block;
  margin: 10px 0 0 0;
  .tips-clear {
    cursor: pointer;
    color: $COLOR-39f;
    margin-left: 15px;
  }
}
</style>
