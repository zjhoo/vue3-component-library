<template>
  <div class="table_page_out_box">
    <div class="s-table__page_box">
      <!-- <div class="s-table__column_setting" v-show="!card && column.length > 0"> -->
      <div
        class="s-table__column_setting"
        v-show="false">
        <Tooltip placement="top">
          <Icon
            type="md-settings"
            color="primary" />
          <div slot="content">
            <CheckboxGroup
              class="s-table__column_filter"
              v-model="colnumFilters">
              <template v-for="col in column">
                <Checkbox
                  class="check-item"
                  style="display: block; margin: 5px;"
                  v-if="!!col.title"
                  :key="col.key"
                  :label="col.key"
                  :disabled="col.disabled">
                  {{col.title}}
                </Checkbox>
              </template>
            </CheckboxGroup>
          </div>
        </Tooltip>
      </div>
      <Page
        class="s-table__page"
        v-if="showPage"
        v-show="!empty && page"
        :total="total"
        :show-elevator="levator"
        :show-sizer="sizeOpt.length > 0"
        :page-size="size "
        :page-size-opts="sizeOpt"
        :current="currentPage"
        placement="top"
        @on-page-size-change="size => $emit('on-page-size-change', size)"
        @on-change="page => $emit('on-change', page)"
        show-total
        transfer>
        <span class="my-total-slot">共<span> {{total}} </span>条</span>
      </Page>
      <!-- <div
        class="s-table__page_header"
        v-if="total">
        共 {{total}} 条记录 第{{currentPage}}/{{Math.ceil(total/size)}}页
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'TablePage',
  props: {
    column: {
      type: Array,
      default: () => ([]),
    },
    total: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    size: {
      type: Number,
      default: 10,
    },
    sizeOpt: {
      type: Array,
      default: () => ([]),
    },
    count: {
      type: Boolean,
      default: true,
    },
    page: {
      type: Number | Boolean,
      default: 12,
    },
    empty: {
      type: Boolean,
      default: false,
    },
    levator: {
      type: Boolean,
      default: false,
    },
    card: {
      type: Boolean,
      default: false,
    },
    showPage: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      //showPage: true, // page页显示flag
      colnumFilters: [],
    }
  },
  watch: {
    colnumFilters(cols) {
      this.$emit('column-filter-change', cols)
    },
    // total() {
    //   this.showPage = false
    //   this.$nextTick(() => { // 强制刷新page
    //     this.showPage = true
    //   })
    // },
  },
  mounted() {
    if (this.column.length > 0) {
      this.colnumFilters = this.column.map(c => c.key)
    } else {
      const cb = this.$watch('column', (cols) => {
        this.colnumFilters = cols.map(c => c.key)
        cb && cb()
      })
    }
  },
}
</script>

<style lang="scss" scoped>
$HEADER_COLOR: #f5f5f5;
$ODD_COLOR: #fff;
$EVEN_COLOR: #fff;
$BORDER_COLOR: #e7e8eb;
$HOVER_COLOR: #f8f8f8;

.s-table__page_box {
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .s-table__column_setting {
    width: 28px;
    height: 32px;
    line-height: 32px;
    font-size: $FONT-SIZE-14;
    color: #999;
    cursor: pointer;
  }

  .s-table__page_header {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    font-size: $FONT-SIZE-12;
    color: $COLOR-666;
  }

  .s-table__page {
    display: inline-block;
    padding: 0px 20px;
    font-size: $FONT-SIZE-12;
    color: $COLOR-666;

    & /deep/ .ivu-page-item-active,
    /deep/ .ivu-page-item:hover {
      background: $COLOR-39f;

      a {
        color: $HOVER_COLOR;
      }
    }


    /deep/ .ivu-select-selected-value,
    /deep/ .ivu-page-options-elevator input {
      font-size: $FONT-SIZE-12;
      color: $COLOR-666;
    }
  }
}
.table_page_out_box {
  display: flex;
  justify-content: center;
  align-content: center;
  padding-top: 5%;
  .s-table__page_box {
    position: fixed;
    bottom: 30px;
    z-index: 10;
    width: 100%;
  }
  .s-table__page {
    border-radius: 6px;
    padding: 4px 10px;
    background-color: #fff;
    box-shadow: 0 0px 30px #d1ddfa;
    color: #4f565c;
    font-size: 12px;
    /deep/.ivu-page-item:hover{
      font-size: 18px;
      background: $EVEN_COLOR;

      a {
        color: $COLOR-39f;
      }
    }
    /deep/.ivu-page-item-active:hover{
      background-color: #1887E8;
      color:#fff;
      a, &:hover a{
        color:#f1f5f8;
        font-size: 18px;
      }
    }
    /deep/.ivu-page-item-active{
      background-color: #1887E8;
      color:#fff;
      a, &:hover a{
        color:#f1f5f8;
        font-size: 18px;
      }
    }
    /deep/.ivu-select-dropdown{
      z-index:2000;
    }
    .my-total-slot{
      // font-size: 16px;
      text-decoration: underline;
      // color: #333;
      span{
        // margin: 0 4px;
        color:#1887E8;
      }
    }
    /deep/ .ivu-select-selected-value {
      font-size: 14px;
    }
    /deep/ .ivu-page-options-elevator input {
      font-size: 16px;
    }
  }
}
</style>
