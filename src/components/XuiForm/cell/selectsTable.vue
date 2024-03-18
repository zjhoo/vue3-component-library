<script>
import { ref, h, toRefs, computed,onMounted, watch, onUnmounted } from 'vue';
import { ElButton, ElInput, ElTable, ElTableColumn, ElSelect, ElEmpty, ElNotification,ElPagination, ElOption  } from 'element-plus';
import { Search, Tickets } from "@element-plus/icons-vue"
import { usePagination } from './usePagination';
const xuiFormItemSelectsTable = {
  props:{
    columns:Array,
    tableQueryField: String,
    selectedRows: Array,//edit show
  },
  emits:['change', 'cancel'],
  setup(props,{ emit, attrs }){
    console.log('Selects Table--------------',props, attrs);
    const multipleTableRef = ref()
    const { columns=[], selectedRows } = toRefs(props)
    const { keyer='id', otherAttr } = attrs
    const { api, apiParams={}, apiSuccess=null, formField=null, tableQueryField='id', tableWidth, formShowField=null } = otherAttr
    let myColumns = ref([{
      type: 'selection',
      width: 42,
      reserveSelection:true,
    }, ...columns.value])

    const loading = ref(false)
    const total = ref(0)
    const showTable = ref(false)
    const queryVal = ref()
    const tableData = ref([
      // {id:11, userName:'ssss',inputTableVal:'123123'},
      // {id:12, userName:'水水水水',inputTableVal:'123123'},
      // {id:13, userName:'水水水水22',inputTableVal:'4444'},
      // {id:14, userName:'水水水水22',inputTableVal:'4444'},
      // {id:15, userName:'水水水水22',inputTableVal:'4444'},
      // {id:16, userName:'水水水水22',inputTableVal:'4444'},
      // {id:17, userName:'水水水水22',inputTableVal:'4444'},
      // {id:18, userName:'水水水水22',inputTableVal:'4444'},
      // {id:19, userName:'水水水水22',inputTableVal:'4444'},
      // {id:23, userName:'水水水水22',inputTableVal:'4444'},
      // {id:24, userName:'水水水水22',inputTableVal:'4444'},
      // {id:25, userName:'水水水水22',inputTableVal:'4444'},
      // {id:26, userName:'水水水水22',inputTableVal:'4444'},
    ])
    const tableDataAll = ref({})
    const allOptions = ref([])
    const inputVal = ref()
    const mySelectedAllRows = ref([])
    const mySelectedRows = ref( selectedRows.value || [])
    const selectKey = 'id' //formField ? formField : 'id'
    const getRowKey=(row)=>{
      return row.id
    }
    const confirm= () => {
      console.log(mySelectedRows.value, mySelectedAllRows.value);
      
      // console.log('==============', allOptions);
      emit(
        'change',
        mySelectedAllRows.value,
        // // (formField?mySelectedAllRows.value?.map(item=>item[formField]): mySelectedAllRows.value),
        mySelectedRows.value?.map(item=>item),
        allOptions.value
      )
    }
    const cancel = () =>{
      // mySelectedAllRows.value=[]
      // mySelectedRows.value = selectedRows
      emit('cancel')
    }

    
    // hooks
    const { paginationData, handleCurrentChange, handleSizeChange } = usePagination({ total });



    watch(tableDataAll.value,()=>{
      let arr=[]
      for (const key in tableDataAll.value) {
        if (tableDataAll.value.hasOwnProperty(key) && Array.isArray(tableDataAll.value[key])) { // 可选的，用于过滤掉原型链上的属性
          tableDataAll.value[key]?.map((item,i)=>{
            arr.push({
              key: `selects-table-option-${key}-${i}`,
              label: formShowField ? item[formShowField] : item.id,
              value:item.id,
            })
          })
        }
      }
      allOptions.value = arr
    })


  
    /** 调用接口获取数据 */
    const loadData = (obj={}) => {
      // console.log(3333333333333,api);
      loading.value = true
      // tableData.value = []
      const params={
        current: paginationData.currentPage,
        size: paginationData.pageSize,
        ...apiParams,
        ...obj, 
      }
      console.log('input Tables go api..', params);
      !!api && api(params)
        .then((res) => {
          // console.log("list respones:",res)
          const list = res?.data || []
          // curPage.value = 1
          // paginationData.pageSize =5
          total.value = res?.count || 0
          loading.value = false
          // console.log(res, tableData.value,total.value);
          const curList=apiSuccess ? apiSuccess(list, params) : list
          
          tableData.value = curList
          tableDataAll.value[paginationData.currentPage] = curList
        })
        .finally(() => {
          loading.value = false
        })
    }
    onMounted(() => {
      loadData()
      // multipleTableRef.value?.toggleRowSelection(selectedRows.value, undefined)
    })

    onUnmounted(()=>{
      mySelectedRows.value=[]
      mySelectedAllRows.value=[]
    })


    const queryTable =()=>{
      let para = {}
      tableData.value=[]
      tableQueryField && (para[tableQueryField] = queryVal.value)
      // mySelectedRows.value=[]
      loadData(para)
    }
  


    const emptySlots = ()=> h(ElEmpty,{
      description:'暂无数据'
    })

    return {
      showTable,
      attrs,
      emit,
      queryTable,
      myColumns,
      tableData,
      emptySlots,
      
      tableDataAll,
      allOptions,
      selectedRows,
      mySelectedRows,
      mySelectedAllRows,
      confirm,
      cancel,
      selectKey,
      getRowKey,

      tableQueryField,
      formShowField,
      formField,
      queryVal,
      inputVal,//外层表单展示内容
      keyer,
      loading,
      tableWidth,
      
      total,
      paginationData,
      handleCurrentChange,
      handleSizeChange,
      loadData,
      // activeChange,
    }
  },

  render(){
    // this.mySelectedRows = this.selectedRows.map(item=>{
    //   this.formField?item[this.formField]:item['id']
    // })
    // console.log('==============',this.tableData);
    // this.allOptions=[]

    

    

    return h('div',{
        'width':'100%',
        class: 'w-cpt-selects-table-dialog'
      },
      [
        h('div',{
          class:'dialog-selects-table-box',
          style:{
            width: this.tableWidth? this.tableWidth : 'auto'
          }
        },
        [
          h('div',{class:'top-box'},[
            h('span',{
              style:{display:'flex'}
            },[
              h(ElInput,{
                clearable:true,
                placeholder:'输入关键字搜索',
                style:{
                  // 'max-width':'40%'
                  marginRight:'6px'
                },
                modelValue: this.queryVal || "",
                onInput: (val) => {
                  this.queryVal = val;
                }
              }),
              h(ElButton,{
                icon:Search,
                onClick: this.queryTable
              },()=>"搜索"),
            ]),
            h('div',{},[
              h('span',{
                style:{'padding-right':'10px', "font-size":'small', color:"#999"}
              }, this.mySelectedRows ? `选中 ${this.mySelectedRows?.length} 行`:"请选择表格" ),
              h(ElButton,{
                type:'primary',
                onClick: this.confirm
              },()=>`确定`),
              h(ElButton,{
                onClick: this.cancel
              },()=>`取消`),
            ])
          ]),
          h(ElTable,{
            ref:'multipleTableRef',
            loading:this.loading,
            data:this.tableData,
            'highlight-current-row':true,
            border:true,
            'max-height':"460",
            'row-key':this.getRowKey,
            "v-model:selected-rows": this.mySelectedRows,
            'default-selection': this.mySelectedRows,
            onSelect: (arr, row) => {
              // console.log('表格多选选中:', arr);
              // const targetKey = this.formField ? this.formField : 'id'
              this.mySelectedRows= arr.map(item=>item.id)
              this.mySelectedAllRows = arr
            },
            onSelectAll: (arr) => {
              // console.log('all---',arr);
              // const targetKey = this.formField ? this.formField : 'id'
              this.mySelectedRows= arr.map(item=> item.id )
              this.mySelectedAllRows = arr
            }
          },
          {
            default: ()=> this.myColumns.map((col, i) => {
              return h(
                ElTableColumn,
                { 
                  ...col
                },
                {
                  default: (scope) => {
                    // 插槽内容使用函数来渲染
                    const rowData = this.tableData[scope.$index];
                    // const activeRow = this.selectedRows?.id && (this.selectedRows?.id==rowData.id)
                    if(col?.type=='radio'){
                      // return h('div',{ class:activeRow?'radio-use':'radio-noUse' })
                    }else{
                      return col.render
                        ? col.render(h, rowData)
                        : rowData[col.prop];
                    }
                  },
                }
              );
            }),
            empty: ()=> this.emptySlots()
          }
          ),
          h(ElPagination, {
            class: "page-box",
            small: "small",
            background: true,
            layout: "total,prev, pager, next, jumper", //, pager, jumper",
            // ...this.paginationData,
            pageSizes: this.paginationData.pageSizes,
            total: this.total,
            onSizeChange: (newSize) => {
              // console.log(newSize);
              this.handleSizeChange(newSize);
              this.loadData({size:newSize})
            },
            onCurrentChange: (newPage) => {
              // console.log(newPage);
              this.handleCurrentChange(newPage);
              this.loadData({current:newPage})
            },
          }),
        ]
      ),
      this.allOptions.map(item=> h(ElOption,{...item }))
    ]
      
    )
  }
}
export default xuiFormItemSelectsTable
</script>

<style scoped>
.dialog-selects-table-box{
  padding:10px;
  /* position: absolute; */
  /* border:1px solid tomato; */
  /* border-radius: 6px;
  z-index: 300;
  background-color: #fff;
  box-shadow: 0 10px 40px #d4d4d4; */
}
.dialog-selects-table-box .top-box{
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}
.radio-use, .radio-noUse{
  width: 12px;
  height: 12px;
  border-radius:50%;
  border:4px solid #999;
}
.radio-use{
  border:4px solid #126fba;
}
.page-box{
  padding-top: 10px;
}
</style>
<style>
.el-select-dropdown__wrap{
  max-height: 658px;
}
.w-cpt-selects-table-dialog .el-select-dropdown__item{
  display: none;
}
</style>