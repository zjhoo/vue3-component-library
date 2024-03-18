/*
 * @Author: zjhoo
 * @Date: 2023-09-10 14:20:46
 * @LastEditors: zjhoo
 * @LastEditTime: 2023-09-10 14:27:22
 * @Description: 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
 <script>
 import { h,ref } from 'vue'
 import { ElButton, ElMessageBox, ElMessage  } from 'element-plus'

 const XuiDel = {
     props: {
         delRequest: Function,
         data: Object| Number | String | undefined,
     },
     setup(props, { emit, attrs }){
        const deleting = ref(false);
        const dialogVisible = ref(false);

        const deleteItem = async () => {
            const delRequest = props.delRequest
            const delData = props?.data
            try {
                deleting.value = true;
                // 执行删除逻辑，可以是异步的操作，比如发送请求
                const res = await delRequest(delData);
                if(res?.code==200){
                    ElMessage.success('删除成功') && emit('success', props.data)
                }else{
                    ElMessage.warning('删除失败',res)
                }
                deleting.value = false;
            } catch (error) {
                console.error('Error deleting item:', error);
                deleting.value = false;
            }
        };

        const open = () => {
          ElMessageBox.confirm(
            '确定要删除选中数据吗?',
            '',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
          )
            .then(() => {
              deleteItem()
            })
            .catch(() => {
              
            })
        }


        return {
            deleting,
            deleteItem,
            dialogVisible,
            open
        }
         
         
     },

     render() {
        return h(
          'span',
          {},
          [
            h(
              'span',
              {
                style:{
                  color:'#ff5d5d',
                },
                onClick:this.open
              },
              '删除'
            ),
            // h(
            //   ElDialog,
            //   {
            //     modelValue:this.dialogVisible,
            //     // title:'删除确认',
            //     width:'600',
            //     showClose:false,
            //     // beforeClose:this.deleteItem
            //     center:false,
            //     onClosed:()=>{
            //       this.dialogVisible=false
            //     }
            //   },
            //   {
            //     header:()=>h('span','删除确认'),
            //     default:()=>"确定删除数据吗？",
            //     footer:()=>h(
            //       'span',
            //       {
            //         class:'dialog-footer',
            //       },
            //       [
            //         h(ElButton,{
            //           onClick:()=>{ this.dialogVisible = false }
            //         },()=>'取消'),
            //         h(ElButton,{
            //           type:'primary',
            //           onClick: this.deleteItem
            //         },()=>'确定删除')
            //       ]
            //     )
            //   }
            // )

          ]
        )
        // return h(
        //     'span',
        //     {},
        //     h(ElDialog,{
        //         placement:"top-start",
        //         title: '确定删除吗？', //确定要删除选中数据吗？
        //         'confirm-button-text': this.deleting?'删除中':'确定',
        //         onConfirm:(dd)=>{
        //             console.log(dd);
        //             this.deleteItem()
        //         }
        //     },{
        //         reference: ()=> this.$slots.default?this.$slots.default:h('span',{style:'color:tomato'},'删除')
        //     })
        // )

        // return h(
        //     ElPopconfirm,
        //     {
        //         title: '确定删除吗？',
        //         'confirm-button-text': this.deleting?'删除中':'确定',
        //         onConfirm:(dd)=>{
        //             console.log(dd);
        //             this.deleteItem()
        //         }
        //     },
        //     // {
        //     //     default: () => h('template', { slot: 'reference' }, {
        //     //         default: () => h(
        //     //             'slot', 
        //     //             { name: 'reference' }, 
        //     //             h('span',{ style:"color:tomato;cursor:pointer"},()=>'删除')
        //     //         ),
        //     //     }),
        //     //     _: () => h('slot'),
        //     // }
        //     {
        //         reference:  ()=>this.$slots.reference ? this.$slots.reference() : h('span',{ style:"color:tomato;cursor:pointer"},()=>'删除'),
        //         default: this.$slots.default && this.$slots.default()
        //     }
        //     // ()=>h('span',{ style:"color:tomato;cursor:pointer"},()=>'删除')
            
        // )
    }
     
 }
export default XuiDel
</script>

<style lang="scss" scoped>
::v-deep .deldialog {
  top: 40%;
  margin: auto;

  .el-dialog__body {
    padding: 0px;
    margin-left: 25px;
  }

  .el-dialog__header {
    border-bottom: 1px solid #ddd !important;
    margin-right: 0px !important;
  }
}
</style>