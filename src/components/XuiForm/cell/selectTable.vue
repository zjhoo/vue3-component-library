<script>
import { ref, h, toRefs, computed,onMounted, watch } from 'vue';
import { ElButton, ElInput, ElTable, ElTableColumn, ElSelect, ElEmpty, ElNotification,ElPagination, ElOption  } from 'element-plus';
import { Search, Tickets } from "@element-plus/icons-vue"
import { usePagination } from './usePagination';
const xuiFormItemSelectTable = {
  props:{
    columns:Array,
    tableQueryField: String,
    // val:String | Number | Object
  },
  emits:['change','cancel'],
  setup(props,{ emit, attrs }){
    // console.log('SelectTable--------------',props, attrs);
    const { columns=[]} = toRefs(props)
    const { keyer='id', otherAttr } = attrs
    const { 
      api,
      apiParams={},
      apiSuccess=null,
      tableQueryField='id',
      tableWidth='600px',

      formField=null,
      formShowField='id' 
    } = otherAttr
    let myColumns = ref([{type: 'radio',width:36}, ...columns.value])
    // let myColumns = ref([{type: 'radio',width:36}, ...columns.value])

    const loading = ref(false)
    const total = ref(10)
    const showTable = ref(false)
    const queryVal = ref()
    const tableData = ref([
      // {id:11, userName:'ssss',inputTableVal:'123123'},
      // {id:12, userName:'水水水水',inputTableVal:'123123'},
      // {id:13, userName:'水水水水22',inputTableVal:'4444'},
      // {id:14, userName:'水水水水2',inputTableVal:'4444'},
      // {id:15, userName:'水水水水23',inputTableVal:'4444'},
      // {id:16, userName:'水水水水24',inputTableVal:'4444'},
      // {id:17, userName:'水水水水25',inputTableVal:'4444'},
      // {id:18, userName:'水水水水26',inputTableVal:'4444'},
      // {id:19, userName:'水水水水27',inputTableVal:'4444'},
      // {id:23, userName:'水水水水28',inputTableVal:'4444'},
      // {id:24, userName:'水水水水29',inputTableVal:'4444'},
      // {id:25, userName:'水水水水30',inputTableVal:'4444'},
      // {id:26, userName:'水水水水31',inputTableVal:'4444'},
    ])
    // const selectedRowHelper = ref()//翻页时换成选中项
    
    const tableDataAll = ref({})
    const allOptions = ref([])
    const selectedRow = ref({})
    // const inputVal = ref()
    // const selectedShowTxt= computed(() => {
    //   // console.log(1111111111, formField, selectedRow.value.hasOwnProperty('id'));
    //   // console.log(222222222222, selectedRow.value); ;
    //   return (formField && selectedRow.value?.hasOwnProperty(formField)) ? selectedRow.value[formField]: val || {}
    // })

    
    // hooks
    const { paginationData, handleCurrentChange, handleSizeChange } = usePagination({ total });




    watch(tableDataAll.value,()=>{
      let arr=[]
      for (const key in tableDataAll.value) {
        if (tableDataAll.value.hasOwnProperty(key) && Array.isArray(tableDataAll.value[key])) {
          tableDataAll.value[key]?.map((item,i)=>{
            arr.push({
              key: `select-table-option-${key}-${i}`,
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
    })


    const activeChange= (row) => {
      selectedRow.value = row;
      // console.log(selectedRow.value);
    }

    const query =()=>{
      let para = {}
      tableData.value=[]
      tableQueryField && (para[tableQueryField] = queryVal.value)
      loadData(para)
    }
    const confirm=()=>{
      // console.log(66666,selectedRow.value, keyer);
      // console.log(selectedRow.value[keyer]);
      // console.log(666666666666, formField, selectedRow.value );
      showTable.value=false
      if(selectedRow.value){
        // emit('change', formField ? selectedRow.value[formField] : selectedRow.value)
        emit('change', selectedRow.value)
      }else{
        ElNotification({
          title: '没有选数据',
          message: '没有选择表格中的任何一行',
          type: 'info',
        })
      }
    }
    const myCancal=()=>{
      console.log(222);
      emit('cancel')
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
      myCancal,
      myColumns,
      tableData,
      emptySlots,

      selectedRow,
      allOptions,
      // selectedShowTxt,
      tableQueryField,
      formShowField,
      formField,
      queryVal,
      // inputVal,//外层表单展示内容
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
    // console.log('==============',this.selectedShowTxt);
    return h('div',{
        'width':'100%',
        class: 'w-cpt-select-table-dialog'
      },
      [
        h('div',{
            class:'dialog-select-table-box',
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
                  onClick: this.query
                },()=>"搜索"),
              ]),
              h('div',{},[
                h('span',{
                  style:{'padding-right':'10px', "font-size":'small', color:"#999"}
                }, this.selectedRow ? `选中1行`:"请选择表格" ),
                h(ElButton,{
                  type:'primary',
                  onClick: this.confirm
                },()=>`确定`),
                h(ElButton,{
                  onClick: this.myCancal
                },()=>`取消`),
              ])
            ]),
            h(ElTable,{
              loading:this.loading,
              data:this.tableData,
              'highlight-current-row':true,
              border:true,
              maxHeight:"460",
              // onCurrentChange:(row)=>{ this.activeChange(row) },
              // onCurrentChange:(row)=>{ this.activeChange(row) }
              // onSelectionChange:(arr)=>{ console.log(arr); },
              "v-model:selected-rows": this.selectedRow,
              onCurrentChange: (row) => {
                this.selectedRow = row;
                console.log(66666, this.selectedRow);
                // this.$emit('change', this.formField ? this.selectedRow[this.formField] : this.selectedRow)
              },
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
              layout: "total, prev,pager, next, jumper", //, ",
              // ...this.paginationData,
              pageSizes: this.paginationData.pageSizes,
              total: this.total,
              onSizeChange: (newSize) => {
                console.log(newSize);
                // this.handleSizeChange(newSize);
                // this.loadData({size:newSize})
              },
              onCurrentChange: (newPage) => {
                // console.log(newPage);
                this.handleCurrentChange(newPage);
                this.loadData({current:newPage})
              },
            }),
          ]
        ),
        // this.tableData?.map((item,i)=>h(ElOption,{
        //   // style:{display:'none'},
        //   key:`select-table-option-${i}`,
        //   label:item[this.formShowField] || item.id,
        //   value: item.id //item[this.formField] || item,
        // },
        // ))
        this.allOptions.map(item=> h(ElOption,{...item }))
        
      ]
    )
  }
}
export default xuiFormItemSelectTable
</script>

<style scoped>
.dialog-select-table-box{
  padding:10px;
  /* position: absolute; */
  /* border:1px solid tomato; */
  /* border-radius: 6px;
  z-index: 300;
  background-color: #fff;
  box-shadow: 0 10px 40px #d4d4d4; */
}
.dialog-select-table-box .top-box{
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
.w-cpt-select-table-dialog .el-select-dropdown__item{
  display: none;
}
</style>