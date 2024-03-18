<!--
 * @Author: zjhoo
 * @Date: 2023-09-09 14:29:58
 * @LastEditors: zjhoo
 * @LastEditTime: 2023-09-14 14:42:58
 * @Description: 低配版 表格封装
 * Copyright (c) 2023 by 1107252331@qq.com, All Rights Reserved. 
-->
<script>
import { h, ref, toRefs, onMounted, onBeforeUnmount, watch } from "vue";
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElEmpty,
} from "element-plus";

const XuiTableLow = {
  props: {
    columns: Array,
    api: Function, //接口对象
    apiParams: Object , //接口参数 
    // data: Array,
    // total: Number,
    // loading: Boolean,
    hasPage: Boolean,
    // maxHeight: Number | String,
  },
  emits: [
    "update:currentPage",
    "update:pageSize",
    'update:data', //列表改变
    "update:selection", //选中行改变
  ],

  setup(props, { emit, attrs }) {
    // console.log("xui-table-low   :  ", props, attrs);
    const { columns, api, apiParams } = toRefs(props);

    // const { hasPage, maxHeight } = toRefs(attrs)
    console.log('=================',props, attrs);

    // hooks
    
    
    const tableData = ref([])
    const allParams = ref([])
    const loading = ref(false)
    
    const currenPage = ref(1)
    const total = ref(0)
    const pageSize = ref(10)
    const pageSizes = ref([2, 5, 10, 20, 50])
    const selectedRows = ref([])
    // const { paginationData, handleCurrentChange, handleSizeChange } = usePagination({ total:total.value });
    
    // const tableIsFull = ref(false)

    // const tableHeight = ref(900);
    // const updateTableH = () => {
    //   const mainBox = document.querySelector(".main-box");
    //   const xuiSearchBox = document.querySelector(".xui-search");
    //   if (mainBox && xuiSearchBox) {
    //     tableHeight.value = tableIsFull.value ? window.innerHeight-150 : mainBox.clientHeight - xuiSearchBox.clientHeight - 110;
    //   }
    // };
    onMounted(() => {
      // updateTableH();
      // window.addEventListener("resize", updateTableH);
      loadData()
    });
    watch(()=>props,()=>{
      loadData()
    },{ deep:true })

    /** 调用接口获取数据 */
    const loadData = () => {
      loading.value = true
      tableData.value = []
      allParams.value= props.hasPage ? {
        // ...allParams.value, //缓存条件回流
        current: currenPage.value,
        size:pageSize.value,
        ...apiParams.value, 
      }: {...apiParams.value}
      // allParams.value = params
      console.log('table low go api..', allParams.value);
      !!api.value && api.value(allParams.value)
        .then((res) => {
          console.log("list respones:",res)
          const list = res?.data || []
          // currenPage.value = 1
          // pageSize.value =10
          total.value = res?.count || 0
          loading.value = false
          // console.log(res, tableData.value,total.value);
         
          tableData.value=list
          emit("update:data", list, allParams.value);
        })
        .finally(() => {
          loading.value = false
        })
    }

    // onBeforeUnmount(() => {
    //   window.removeEventListener("resize", updateTableH);
    // });

    // const columns = props.columns || [];
    // const myColumns = ref(columns.value?.map(item=>{
    //   if(item.type =='selection'){
    //     item.width='40'
    //   }
    //   return item
    // }))


  // selects tables
    const myCols= ref(columns.value?.filter(item=> (item.label && item.label!='操作' && item.type!=='selection')))
    const checkColumns = ref(myCols.value?.map(item=>item.label))
    const checkAll = ref(false)
    const isIndeterminate = ref(true)
    const handleCheckAllChange = (val) => {
      checkColumns.value = val ? myCols.value.map(item=>item.label) : []
      isIndeterminate.value = !!val
      // myColumns.value=!!val ? columns.value : columns.value?.filter(item => (!item.label || item.label=='操作' || item.type=='selection' ) )
    }
    const handleCheckedCitiesChange = (value) => {
      const checkedCount = value.length
      checkColumns.value=value
      checkAll.value = checkedCount === checkColumns.value.length
      isIndeterminate.value = checkedCount > 0 && checkedCount < checkColumns.value.length
      // myColumns.value=columns.value?.filter(item => (!item.label || item.label=='操作' || item.type=='selection' || checkColumns.value?.includes(item.label)) )
    }

  


    const defaultAttrs = {
      // default table attr
      stripe: true,
    };

   

  
    //方法调用
    // const checkAndExeEmit = (fn, ...arg) => {
    //   checkHasEmit(fn)
    //     ? attrs[fn](...arg)
    //     : console.warn(`emit 中未传入 ${fn} 函数`);
    // };
    // const checkHasEmit = (fn) => {
    //   return !!(context.attrs[fn] && typeof context.attrs[fn] === "function");
    // };

    const emptySlots = () =>
      h(ElEmpty, {
        description: "暂无数据",
      });

    return {

      // tableSlot,
      emptySlots,
      selectedRows, // 表格选中项
      attrs,
      defaultAttrs,

      currenPage,//用于触发 reload
      pageSizes,
      pageSize,

      loading,
      tableData,
      total,
      // paginationData,
      columns,
      // myColumns,
      loadData,

      // myCols,
      checkColumns,
      checkAll,
      isIndeterminate,
      handleCheckAllChange,
      handleCheckedCitiesChange,
      
      props,
      // handleCurrentChange,
      // handleSizeChange,
      // tableHeight,
    };
  },

  render() {
    // console.log(3333333333333333,this.loading);
    // console.log('render---------',this.optBtnReals, this.props,this.data,this.total);
    const {  ...otherAttrs } = this.attrs;

    const { hasPage=false } = this.props

    const tableSlot = (otherAttrs) =>
      h(
        "div",
        {
          class: "xui-table-low-box",
          // style:{ height:height || 'auto' }
        },
        [
          //table
          h(
            ElTable,
            {
              border: true,
              ...otherAttrs,
              data: this.tableData,
              // height: height || this.tableHeight,
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
                this.columns.map((col, i) => {
                  // return ()=>h('span',{ key: i })
                  return h(
                    ElTableColumn,
                    { ...col },
                    {
                      default: (scope) => {
                        // 插槽内容使用函数来渲染
                        const rowData = this.tableData[scope.$index];
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
          hasPage && h(ElPagination, {
            class: "page-box",
            small: "small",
            background: true,
            layout: "total, sizes, prev, pager, jumper",
            pageSizes: this.pageSizes,
            pageSize: this.pageSize,
            total: this.total,
            onSizeChange: (newSize) => {
              console.log(newSize);
              // this.handleSizeChange(newSize);
              this.$emit("update:pageSize", newSize);
              this.$emit("update:currentPage", 1);
              this.currenPage = 1
              this.pageSize = newSize
              this.loadData()
            },
            onCurrentChange: (newPage) => {
              console.log(newPage);
              // this.handleCurrentChange(newPage);
              this.$emit("update:currentPage", newPage); // 触发父组件更新当前页
              this.currenPage = newPage
              this.loadData()
            },
          }),
        ]
      );

    return h(
      "div",
      {
        class: "xui-table-low-cpt",
        style: {
          height: "100%",
        },
      },
      [
        tableSlot({ ...this.defaultAttrs, ...otherAttrs }),
        this.$slots.default && this.$slots.default(),// 调试代码使用，请勿在业务代码中使用
      ]
    );
  },
};

export default XuiTableLow;
</script>

<style lang="scss" scoped>
.xui-table-low-cpt {
  // border:1px solid tomato;
  // display: flex;
  flex-direction: row;
  align-items: stretch;
  // flex-wrap: nowrap;
  // height: inherit;
  // margin-right: 10px;
  // position: relative;

  .xui-table-low-box {
    border-radius: 2px;
    background-color: #fff;
    flex: 1;
    // border:1px solid blue;
  }
  .page-box {
    padding: 10px;
  }
  
}
</style>
<style>
.xui-table-low-cpt .el-button {
  border-radius: 3px;
}
.xui-table-low-cpt .el-button--primary {
  background-color: #528fff;
}
.xui-table-low-cpt .el-button--danger {
  background-color: #ff5d5d;
}
.xui-table-low-cpt thead th.el-table__cell.is-leaf {
  background-color: #e9f1ff;
  /* font-size: 18px; */
  font-family: Source Han Sans SC-Regular, Source Han Sans SC;
  font-weight: 400;
  color: #202735;
  font-weight: 700;
  padding: 10px 0;
}
.xui-table-low-cpt .el-table td.el-table__cell div {
  color: #4e5461;
}

.xui-table-low-cpt .el-input__wrapper {
  height: 24px !important;
}

.xui-table-low-cpt .pagination {
  width: 98%;
  display: flex;
  justify-content: end;
}
.xui-table-low-cpt .el-pagination__jump {
  /* border:1px solid tomato; */
  background: #f3f3f3;
  border-radius: 3px 3px 3px 3px;
  padding: 2px 6px;
  color: #898989;
}
.xui-table-low-cpt .el-pagination__total {
  /* position: absolute; */
  /* left: 10px; */
  flex: 1;
  font-size: 14px;
  color: #8c8c8c;
}
</style>