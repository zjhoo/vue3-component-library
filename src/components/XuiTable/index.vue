<!--
 * @Author: zjhoo
 * @Date: 2023-09-09 14:29:58
 * @LastEditors: zjhoo
 * @LastEditTime: 2023-09-14 14:42:58
 * @Description: 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<script>
import { h, ref, toRefs, onMounted, onBeforeUnmount } from "vue";
import { RefreshLeft,FullScreen, Filter, Expand, Fold } from "@element-plus/icons-vue"
// import XuiTree from "../XuiTree";
import {
  // ElDialog,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElButton,
  ElEmpty,
  // ElMessage,
  ElTooltip,
  ElNotification,
  ElIcon,
  ElPopover,
  ElCheckboxGroup,
  ElCheckbox
} from "element-plus";

import { usePagination } from "./usePagination";
import { updateData } from "../../views/emergencysystem/pages/emergencyplanning/apis";

const XuiTable = {
  props: {
    columns: Array,
    data: Array | Object,
    total: Number,
    loading: Boolean,
    operateBtn: Object,
    // tableAttr: Object,
    // selectedRows: Array,
  },
  emits: [
    "click:optBtn",
    "update:selection",
    "update:currentPage",
    "update:pageSize",
  ],

  setup(props, { emit, attrs }) {
    // console.log("xui-table   :  ", props);
    // console.log(props.columns);
    // console.log('paginationData:', paginationData);
    // console.log(props.operateBtn);
    const { data, total, columns, loading } = toRefs(props);
    // console.log(2222222,loading);

    const showTreeBox = ref(true)

    const currenPage = ref(1)
    
    const tableIsFull = ref(false)

    const tableHeight = ref(900);
    const updateTableH = () => {
      const mainBox = document.querySelector(".main-box");
      const xuiSearchBox = document.querySelector(".xui-search");
      if (mainBox && xuiSearchBox) {
        tableHeight.value = tableIsFull.value ? window.innerHeight-150 : mainBox.clientHeight - xuiSearchBox.clientHeight - 110;
      }
    };
    onMounted(() => {
      updateTableH();
      window.addEventListener("resize", updateTableH);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateTableH);
    });

    // const columns = props.columns || [];
    const myColumns = ref(columns.value?.map(item=>{
      if(item.type =='selection'){
        item.width='40'
      }
      return item
    }))

    const myCols= ref(columns.value?.filter(item=> (item.label && item.label!='操作' && item.type!=='selection')))
    const checkColumns = ref(myCols.value?.map(item=>item.label))
    const checkAll = ref(false)
    const isIndeterminate = ref(true)
    const handleCheckAllChange = (val) => {
      checkColumns.value = val ? myCols.value.map(item=>item.label) : []
      isIndeterminate.value = !!val
      myColumns.value=!!val ? columns.value : columns.value?.filter(item => (!item.label || item.label=='操作' || item.type=='selection' ) )
    }
    const handleCheckedCitiesChange = (value) => {
      const checkedCount = value.length
      checkColumns.value=value
      checkAll.value = checkedCount === checkColumns.value.length
      isIndeterminate.value = checkedCount > 0 && checkedCount < checkColumns.value.length
      myColumns.value=columns.value?.filter(item => (!item.label || item.label=='操作' || item.type=='selection' || checkColumns.value?.includes(item.label)) )
    }

    const tableFullScreen=()=>{
      const div = document.querySelector('body');//xui-table-box
      
      const conteBox = document.querySelector('.el-container');
      const menuBox = document.querySelector('.aside-menu');
      const topBox = document.querySelector('.el-tabs--top');
      const headerBox = document.querySelector('.header');
      const searchBox = document.querySelector('.xui-search');
      if(!tableIsFull.value){
        if (div.requestFullscreen) {
          div.requestFullscreen();
        } else if (div.mozRequestFullScreen) {
          div.mozRequestFullScreen();
        } else if (div.webkitRequestFullscreen) {
          div.webkitRequestFullscreen();
        } else if (div.msRequestFullscreen) {
          div.msRequestFullscreen();
        }
        // conteBox.style.height='100%'
        // menuBox.style.display='none'
        // topBox.style.display='none'
        // headerBox.style.display='none'
        // searchBox.style.display='none'

        conteBox?.style && (conteBox.style.height='100%')
        menuBox?.style && (menuBox.style.display='none')
        topBox?.style && (topBox.style.display='none')
        headerBox?.style && (headerBox.style.display='none')
        searchBox?.style && (searchBox.style.display='none')
      }else{
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        // conteBox.style.height=''
        // menuBox.style.display=''
        // topBox.style.display=''
        // headerBox.style.display=''
        // searchBox.style.display=''

        conteBox?.style && (conteBox.style.height='')
        menuBox?.style && (menuBox.style.display='')
        topBox?.style && (topBox.style.display='')
        headerBox?.style && (headerBox.style.display='')
        searchBox?.style && (searchBox.style.display='')
      }
      tableIsFull.value=!tableIsFull.value
    }

    const refreshTable=()=>{
      // console.log(77777777,currenPage.value);
      emit("update:currentPage", currenPage.value);
    }


    // const data = props.data || []
    // const tableAttr = props.tableAttr || {}
    // const total = props.total || 100
    let selectedRows = []; //toRef(() => props.selectedRows)

    const defaultAttrs = {
      // default table attr
      stripe: true,
    };
    const optBtn = props.operateBtn || {};
    const optBtnLable = [
      { name: "add", des: "新增", permi: false, type: "primary" },
      {
        name: "del",
        des: "删除",
        permi: false,
        type: "danger",
        icon: "Delete",
        plain: false,
      },
      {
        name: "dels",
        des: "批量删除",
        permi: false,
        type: "danger",
        icon: "Delete",
      },
      { name: "impt", des: "导入", permi: false, type: "warning" },
      { name: "expt", des: "导出", permi: false, type: "" },
      { name: "print", des: "打印", permi: false, type: "", icon: "Printer" },
      {
        name: "downTpl",
        des: "下载模板",
        permi: false,
        type: "",
        api: null,
        params: {},
        onSuccess: () => {},
      },
      {
        name: "downExe",
        des: "批量下载",
        permi: false,
        type: "",
        api: null,
        params: {},
        onSuccess: () => {},
      },
    ];
    const optBtnReals = optBtnLable
      .filter((item) => !!optBtn[item.name])
      .map((item) => {
        const propsBtn = optBtn[item.name];
        const valType = typeof propsBtn;
        if (valType === "object") {
          item = { ...item, ...propsBtn };
        } else {
          item.permi = optBtn[item.name]; //默认为权限校验标识
        }
        return item;
      });
    // console.log("需要的操作按钮:", optBtnReals);
    const optBtnApiAbstract = (btn) => {
      try {
        const { name, api, params, onSuccess } = btn;
        !!api && api(params)
            .then((res) => {
              switch (name) {
                case "downTpl":
                  let blob = new Blob([res], {
                    type: "application/vnd.ms-excel",
                  });
                  let url = window.URL.createObjectURL(blob);
                  let a = document.createElement("a");
                  a.href = url;
                  a.download =
                    params?.fileName ||
                    `下载的模板文件_${new Date().getTime()}.xls`;
                  a.click();
                  break;
                case "downExe": //批量下载
                  let blobExe = new Blob([res], {
                    type: "application/vnd.ms-excel",
                  });
                  let urlExe = window.URL.createObjectURL(blobExe);
                  let aExe = document.createElement("a");
                  aExe.href = urlExe;
                  aExe.download =
                    params?.fileName ||
                    `下载的模板文件_${new Date().getTime()}.xls`;
                  aExe.click();
                  break;
                default:
                  break;
              }
              // console.log(res);
              onSuccess && onSuccess(btn, res);
            })
            .finally(() => {
              // loading.value = false
            });
      } catch (error) {
        console.log("请检查操作按钮配置:", btn, error);
      }
    };

    // hooks
    const { paginationData, handleCurrentChange, handleSizeChange } =
      usePagination({ total });

    //方法调用
    const checkAndExeEmit = (fn, ...arg) => {
      checkHasEmit(fn)
        ? attrs[fn](...arg)
        : console.warn(`emit 中未传入 ${fn} 函数`);
    };
    const checkHasEmit = (fn) => {
      return !!(context.attrs[fn] && typeof context.attrs[fn] === "function");
    };

    // 定义默认插槽内容
    const treeSlot = () =>
      h("div", { class: "tree-box" }, () => "在v-slot:tree中传入xui-tree使用");
    const searchSlot = () => null;

    const emptySlots = () =>
      h(ElEmpty, {
        description: "暂无数据",
      });

    return {
      treeSlot,
      showTreeBox,

      searchSlot,
      // tableSlot,
      emptySlots,
      selectedRows, // 表格选中项
      attrs,
      defaultAttrs,

      currenPage,//用于触发 reload
      loading,
      data,
      total,
      optBtnReals,
      paginationData,
      columns,
      myColumns,

      myCols,
      checkColumns,
      checkAll,
      isIndeterminate,
      handleCheckAllChange,
      handleCheckedCitiesChange,
      tableFullScreen,
      refreshTable,
      tableIsFull,
      
      props,
      handleCurrentChange,
      handleSizeChange,
      optBtnApiAbstract,
      tableHeight,
    };
  },

  render() {
    // console.log(3333333333333333,this.loading);
    // console.log('render---------',this.optBtnReals, this.props,this.data,this.total);
    const { height, ...otherAttrs } = this.attrs;

    const tableSlot = (otherAttrs) =>
      h(
        "div",
        {
          class: "xui-table-box",
          // style:{ height:height || 'auto' }
        },
        [
          //table bottons
          // (this.optBtnReals?.length || this.$slots.optBtnOther) &&
            h("div", { class: "table-bottons" }, [
              this.optBtnReals.map((btn, i) => {
                //  console.log('btn----------',btn);
                if (["del", "dels"].includes(btn.name)) {
                  return h(
                    ElTooltip,
                    {
                      // transition:"custom-tooltip-transition",
                      "v-permi": btn.permi,
                      // placement: "top-start",
                      placement:"bottom-start",
                      effect: "table-opt-btn-tooltip-customized",
                      content: btn.name == "dels" ? "至少选择一行" : "删除单行",
                    },
                    () =>
                      h(
                        ElButton,
                        {
                          ...btn,
                          // plain: true,
                          key: `opt-btn-${i}`,
                          onClick: () => {
                            if (
                              btn.name === "del" &&
                              this.selectedRows.length != 1
                            ) {
                              return ElNotification({
                                title: "删除单行",
                                message: " 只选中一行表格数据！",
                                offset: 100,
                                type: "info",
                                position: 'bottom-right',
                              });
                            }
                            if (
                              btn.name === "dels" &&
                              this.selectedRows.length < 1
                            ) {
                              return ElNotification({
                                title: "批量删除",
                                message: "请至少选中一行数据！",
                                offset: 100,
                                type: "info",
                                position: 'bottom-right',
                              });
                            }
                            this.$emit(
                              "click:optBtn",
                              btn.name,
                              this.selectedRows
                            );
                          },
                        },
                        { default: () => btn.des }
                      )
                  );
                } else {
                  return h(
                    ElButton,
                    {
                      ...btn,
                      // plain: true,
                      key: `opt-btn-${i}`,
                      "v-permi": btn.permi,
                      onClick: () => {
                        this.$emit("click:optBtn", btn.name, this.selectedRows);
                        if (btn.onSuccess) {
                          switch (btn.name) {
                            case "downTpl":
                              // console.log('33333333333',btn);

                              this.optBtnApiAbstract(btn);
                              break;
                            case "downExe":
                              this.optBtnApiAbstract(btn);
                              break;
                            default:
                              console.log("未配置化的操作类型", btn);
                              break;
                          }
                        }
                      },
                    },
                    { default: () => btn.des }
                  );
                }
              }),
              this.$slots.optBtnOther && this.$slots.optBtnOther(),
              //table opearte group
              h('span', { class:'table-opt-group'},
                // h(RefreshLeft,{
                //   class: 'table-opt-r-btn',
                //   onClick: this.refreshTable
                // }),
                h(FullScreen,{
                  class: 'table-opt-r-btn',
                  onClick: this.tableFullScreen
                }),
                h(ElPopover,{
                  trigger:'hover',
                  placement:'bottom-end',
                },{
                  reference: ()=>h(Filter,{
                    class: 'table-opt-r-btn'
                  }),
                  default: ()=>[
                    h(ElCheckbox,{
                      modelValue:this.checkAll,
                      indeterminate:this.isIndeterminate,
                      onChange: this.handleCheckAllChange
                    },()=>"全选"),
                    h(
                      ElCheckboxGroup,
                      {
                        indeterminate:true,
                        modelValue:this.checkColumns,
                        onChange:this.handleCheckedCitiesChange
                      },
                      {
                        default: ()=>[
                          this.myCols?.map(item=>{
                            return h(ElCheckbox,{label:item.label,key:item.prop })
                          })
                        ]
                      }
                    )
                  ]
                }),
                
              ),
            ]),
          //table
          h(
            ElTable,
            {
              border: true,
              ...otherAttrs,
              data: this.data,
              height: height || this.tableHeight,
              // 'max-height':"1000",
              vLoading:this.loading,
              'element-loading-text':'大量数据正在狂奔而来...',
              style:{width:'100%'},
              "v-model:selected-rows": this.selectedRows,
              onSelectionChange: (arr) => {
                this.selectedRows = arr;
                // console.log(66666, this.selectedRows);
                this.$emit("update:selection", arr);
              },
            },
            {
              default: () =>
                this.myColumns.map((col, i) => {
                  // return ()=>h('span',{ key: i })
                  return h(
                    ElTableColumn,
                    { ...col },
                    {
                      default: (scope) => {
                        // 插槽内容使用函数来渲染
                        const rowData = this.data[scope.$index];
                        return col.render
                          ? col.render(h, rowData)
                          : rowData[col.prop];
                      },
                    }
                  );
                }),
              empty: () => this.emptySlots(),
            }
          ),
          //pages
          h(ElPagination, {
            class: "page-box",
            small: "small",
            background: true,
            layout: "total, sizes, prev, pager, jumper",
            // ...this.paginationData,
            total: this.total,
            onSizeChange: (newSize) => {
              // console.log(newSize);
              this.handleSizeChange(newSize);
              this.$emit("update:pageSize", newSize);
              this.$emit("update:currentPage", 1);
              this.currenPage = 1
            },
            onCurrentChange: (newPage) => {
              // console.log(newPage);
              this.handleCurrentChange(newPage);
              this.$emit("update:currentPage", newPage); // 触发父组件更新当前页
              this.currenPage = newPage
            },
          }),
        ]
      );

    return h(
      "div",
      {
        class: "xui-table-cpt",
        style: {
          height: this.tableIsFull?"calc(100vh - 20px)" : "calc(100vh - 130px)",
        },
      },
      [
        this.$slots.tree && h(ElIcon,{
            class: 'show-tree-box-btn',
            style:{
              top: this.showTreeBox? '': '0',
              left: this.showTreeBox? '': '0'
              // position: 'relative'
            },
            onClick: ()=>{ 
              this.showTreeBox=!this.showTreeBox 
            }
          },
          ()=>h(this.showTreeBox ? Fold : Expand)
        ),

        this.$slots.tree && h("div", { 
          class: "tree-box",
          style:{ 
            // width: this.showTreeBox ? '100%' : 0,
            display: this.showTreeBox ? '':'none' 
          }
        }, this.$slots.tree() ),

        h(
          "div",
          {
            class: "main-box",
            style: {
              width: this.$slots.tree && this.showTreeBox ? "calc(100% - 292px)" : "100%",
            },
          },
          [
            this.$slots.default && this.$slots.default(),// 调试代码使用，请勿在业务代码中使用
            this.$slots.search &&
              h(
                "div",
                { class: "xui-search" },
                this.$slots.search ? this.$slots.search() : this.searchSlot()
              ),

            this.$slots.table
              ? this.$slots.table()
              : tableSlot({ ...this.defaultAttrs, ...otherAttrs })
          ]
        )
      ]);
  },
};

export default XuiTable;
</script>

<style lang="scss" scoped>
.xui-table-cpt {
  // border:1px solid tomato;
  // display: flex;
  flex-direction: row;
  align-items: stretch;
  // flex-wrap: nowrap;
  // height: inherit;
  // margin-right: 10px;
  position: relative;
  .tree-box {
    display: inline-block;
    vertical-align: top;
    height: 100%;
    // background-color: #fff;
    // border:1px solid tomato;
    box-sizing: border-box;
    width: 280px;
    // margin-bottom: 10px;
    margin-right: 10px;
    border-radius: 2px;
    align-items: stretch;
    padding: 10px;
    background-color: #fff;
    border-right: 1px #eaeaeb solid;
  }
  .main-box {
    display: inline-block;
    vertical-align: top;
    // border:1px solid rgb(71, 255, 151);
    // width: ;
    height: 100%;
    background-color: #fff;
    position: relative;

    .xui-search {
      background-color: #fff;
      padding: 16px 10px 6px;
      border-radius: 2px;
      // margin-bottom: 2px;
      // border-bottom: 1px #e4e7ed solid;
      ::v-deep(.el-col) {
        margin-bottom: 8px;
        margin-right: 20px;
      }
    }
    .xui-table-box {
      padding: 10px;
      border-radius: 2px;
      background-color: #fff;
      flex: 1;

      // border:1px solid rgb(255, 218, 71);

      padding-bottom: 30px;
      // border:1px solid blue;
      .table-bottons {
        padding: 0 10px 16px 10px;
        border-bottom: 1px solid #eee;
        // border-top: 1px solid #eee;
        min-height: 32px;
        .table-opt-group{
          position: relative;
          top:22px;
          height: 100%;
          // border:1px solid tomato;
          float: right;
          .table-opt-r-btn{
            width:20px;
            height: 20px;
            margin-left: 12px;
            &:hover{
              color:#528fff;
              cursor: pointer;
            }
          }
        }
      }
    }
    .page-box {
      position: absolute;
      // bottom: 20px;
      right: 10px;
      padding: 10px;
      width: 94%;
      margin-left: 20px;
      // border:1px solid red;
    }
    .page-box {
      // margin-top: 10px;
      padding: 10px;
      // border:1px solid tomato;
    }
  }
  .dialog-box {
    // border:1px solid rgb(211, 58, 31);
    padding: 20px;
    position: fixed;
    bottom: 20;
  }

  // oparte tooltip anim

  // ::v-deep(.el-popper.is-customized .el-popper__arrow::before) {
  //   background: linear-gradient(45deg, #b2e68d, #bce689);
  //   right: 0;
  // }

  .custom-tooltip-transition-enter-active,
  .custom-tooltip-transition-leave-active {
    transition: opacity 0.5s;
  }
  .custom-tooltip-transition-enter,
  .custom-tooltip-transition-leave-to {
    opacity: 0;
  }
  
}
.show-tree-box-btn{
  font-size: 24px;
  color:#999;
  font-weight: 500;
  cursor: pointer;
  position: absolute;
  left:240px;
  top:20px;
  z-index: 200;
  &:hover{
    color:rgb(1, 147, 214)
  }
}
</style>
<style>
.xui-table-cpt .el-button {
  border-radius: 3px;
}
.xui-table-cpt .el-button--primary {
  background-color: #528fff;
}
.xui-table-cpt .el-button--danger {
  background-color: #ff5d5d;
}
.xui-table-cpt thead th.el-table__cell.is-leaf {
  background-color: #e9f1ff;
  /* font-size: 18px; */
  font-family: Source Han Sans SC-Regular, Source Han Sans SC;
  font-weight: 400;
  color: #202735;
  font-weight: 700;
  padding: 10px 0;
}
.xui-table-cpt .el-table td.el-table__cell div {
  color: #4e5461;
}

.xui-table-cpt .el-input__wrapper {
  height: 24px !important;
}

.xui-table-cpt .pagination {
  width: 98%;
  display: flex;
  justify-content: end;
}
.xui-table-cpt .el-pagination__jump {
  /* border:1px solid tomato; */
  background: #f3f3f3;
  border-radius: 3px 3px 3px 3px;
  padding: 2px 6px;
  color: #898989;
}
.xui-table-cpt .el-pagination__total {
  /* position: absolute; */
  /* left: 10px; */
  flex: 1;
  font-size: 14px;
  color: #8c8c8c;
}
/* .xui-table-cpt .is-customized{
    padding: 6px 12px;
    background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
  }
.xui-table-cpt .el-popper.is-customized .el-popper__arrow::before{
  background: linear-gradient(45deg, #b2e68d, #bce689);
    right: 0;
} */

.example-showcase .el-loading-mask {
  z-index: 9;
}

.el-popper.is-table-opt-btn-tooltip-customized {
  /* Set padding to ensure the height is 32px */
  color: rgb(42, 76, 106);
  font-weight: 500;
  padding: 6px 12px;
  background: linear-gradient(
    50deg,
    rgb(241, 209, 172),
    rgba(247, 98, 98, 0.8)
  );
}

.el-popper.is-table-opt-btn-tooltip-customized .el-popper__arrow::before {
  background: linear-gradient(
    -50deg,
    rgb(243, 172, 92),
    rgba(243, 163, 163, 0.8)
  );
  right: 0;
}
</style>