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
 import { ElPopconfirm, ElMessage  } from 'element-plus'

 const XuiDel = {
     props: {
         delRequest: Function,
         data: Object| Number | String | undefined,
     },
     setup(props, { emit, attrs }){
        const deleting = ref(false);

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


        return {
            deleting,
            deleteItem,
        }
         
         
     },
     render() {
        return h(
            'span',
            {},
            h(ElPopconfirm,{
                placement:"top-start",
                title: '确定删除吗？',
                'confirm-button-text': this.deleting?'删除中':'确定',
                onConfirm:(dd)=>{
                    console.log(dd);
                    this.deleteItem()
                }
            },{
                reference: ()=> this.$slots.default?this.$slots.default:h('span',{style:'color:tomato'},'删除')
            })
        )
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