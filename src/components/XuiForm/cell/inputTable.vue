<script>
import { ref, h, toRefs, computed,onMounted } from 'vue';
import { ElButton, ElInput, ElTable, ElTableColumn, ElPopover, ElEmpty, ElNotification,ElPagination  } from 'element-plus';
import { Search, Tickets } from "@element-plus/icons-vue"
import { usePagination } from './usePagination';
const xuiFormItemInputTable = {
  props:{
    columns:Array,
    queryKey: String,
  },
  emits:['change'],
  computed: {
    // inputVal(){
    //   return (this.selectedRow && this.selectedRow[this.keyer]) ? this.selectedRow[this.keyer] : ''
    // }
  },
  setup(props,{ emit, attrs }){
    console.log('--------------',props, attrs);
    const { columns=[] } = toRefs(props)
    const { keyer='id', otherAttr } = attrs
    const { api, apiParams={}, apiSuccess=null, inputKey, queryKey, tableWidth } = otherAttr
    let myColumns = ref([{type: 'radio',width:36}, ...columns.value])

    const loading = ref(false)
    const total = ref(100)
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
    const selectedRow = ref()
    const inputVal = ref()

    
    // hooks
    const { paginationData, handleCurrentChange, handleSizeChange } = usePagination({ total });





    // watch([paginationData],([page,size])=>{
    //   loadData()
    // })

  
    /** 调用接口获取数据 */
    const loadData = (obj={}) => {
      // console.log(3333333333333,api);
      loading.value = true
      tableData.value = []
      const params={
        current: paginationData.currentPage,
        size: paginationData.pageSize,
        ...apiParams,
        ...obj, 
      }
      console.log('input Table go api..', params);
      !!api && api(params)
        .then((res) => {
          // console.log("list respones:",res)
          const list = res?.data || []
          // curPage.value = 1
          // paginationData.pageSize =5
          total.value = res?.count || 0
          loading.value = false
          // console.log(res, tableData.value,total.value);
          tableData.value=apiSuccess ? apiSuccess(list, params) : list
        })
        .finally(() => {
          loading.value = false
        })
    }
    onMounted(() => {
      loadData()
    })




    const activeChange= (row) => {
      selectedRow.value = row;
      // console.log(selectedRow.value);
    }

    const query =()=>{
      let para = {}
      queryKey && (para[queryKey] = queryVal.value)
      loadData(para)
    }
    const confirm=()=>{
      // console.log(66666,selectedRow.value, keyer);
      // console.log(selectedRow.value[keyer]);
      // console.log(666666666666, inputKey, selectedRow.value );
      showTable.value=false
      if(selectedRow.value){
        inputVal.value = (selectedRow.value && selectedRow.value[keyer]) ? selectedRow.value[keyer] : ''
        emit('change', inputKey ? selectedRow.value[inputKey] : selectedRow.value)
      }else{
        ElNotification({
          title: '没有选数据',
          message: '没有选择表格中的任何一行',
          type: 'info',
        })
      }
    }



    const emptySlots = ()=> h(ElEmpty,{
      description:'暂无数据'
    })

    return {
      showTable,
      attrs,
      emit,
      query,
      confirm,
      myColumns,
      tableData,
      emptySlots,
      selectedRow,
      queryKey,
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
      activeChange,
    }
  },
  render(){
    // console.log('==============',this.queryKey);
    return h('div',{},[
      
      h('div',{  },
        h(ElPopover,{ 
          trigger:"click",
          'width':this.tableWidth || 600,
          visible:this.showTable
        },{
          reference:()=>h(ElInput, {
              // key: `w-input-${i}`,
              placeholder: "请点击选择",
              'prefix-icon':Tickets,
              value:this.inputVal,
              // ...this.attrs.otherAttr,
              // type,
              // style: { flex: 1 },
              // modelValue: formDate[keyer] || "",
              // onInput: (val) => {
              //   formDate[keyer] = val;
              //   emit("update:vals", formDate);
              // },
              onClick:(val)=>{
                this.showTable=!this.showTable
                // console.log(2222222,val,this.showTable);
                // this.emit('change',this.showTable)
              }
            },
          ),
          default: ()=>h('div',{
              class:'dialog-table-box',
            },
            [
              h('div',{class:'top-box'},[
                h('span',{
                  style:{display:'flex'}
                },[
                  h(ElInput,{
                    clearable:true,
                    placeholder:'输入关键字搜索',
                    // style:{
                    //   'max-width':'40%'
                    // }
                    modelValue: this.queryVal || "",
                    onInput: (val) => {
                      this.queryVal = val;
                    }
                  }),
                  h(ElButton,{
                    icon:Search,
                    onClick: this.query
                  },()=>"搜索"),
                ]),
                h('div',{},[
                  h('span',{
                    style:{'padding-right':'10px', "font-size":'small', color:"#999"}
                  }, this.selectedRow ? "选中一行":"请选择表格" ),
                  h(ElButton,{
                    onClick:()=> this.showTable=false
                  },()=>`取消`),
                  h(ElButton,{
                    type:'primary',
                    onClick:()=> this.confirm()
                  },()=>`确定`),
                ])
              ]),
              h(ElTable,{
                loading:this.loading,
                data:this.tableData,
                border:true,
                'highlight-current-row':true,
                onCurrentChange:(row)=>{ this.activeChange(row) }
              },
              {
                default: ()=> this.myColumns.map((col, i) => {
                  return h(
                    ElTableColumn,
                    { ...col },
                    {
                      default: (scope) => {
                        // 插槽内容使用函数来渲染
                        const rowData = this.tableData[scope.$index];
                        const activeRow = this.selectedRow?.id && (this.selectedRow?.id==rowData.id)
                        if(col?.type=='radio'){
                          return h('div',{ class:activeRow?'radio-use':'radio-noUse' })
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
                layout: "total, sizes, prev, pager, jumper",
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
          )
        })

        
      )
    ])
  }
}
export default xuiFormItemInputTable
</script>

<style scoped>
.dialog-table-box{
  /* padding:10px; */
  /* position: absolute; */
  /* border:1px solid tomato; */
  /* border-radius: 6px;
  z-index: 300;
  background-color: #fff;
  box-shadow: 0 10px 40px #d4d4d4; */
}
.dialog-table-box .top-box{
  display: flex;
  justify-content: space-between;
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