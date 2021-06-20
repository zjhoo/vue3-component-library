<template>
    <el-dialog 
        :visible.sync="isVisible"
        title='修改密码' 
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :modal-append-to-body="false"
        @close="closeDialog"
        class="my-dialog-middle">
        <div class="form">
            <el-form 
                ref="form" 
                :model="form"
                :label-width="dialog.formLabelWidth" 
                style="margin:10px;width:auto;">

                <el-form-item prop='carNum' label="原始密码 :">
                    <el-input type="text" v-model="form.passwordOld"></el-input>
                </el-form-item> 
                
              
                <el-form-item prop='carNum' label="修改密码 :">
                    <el-input type="text" v-model="form.password"></el-input>
                </el-form-item> 
                
                 

                <el-form-item prop='terminalNum'  label="确认密码:">
                    <el-input v-model.number="form.password_conf"></el-input>
                </el-form-item>
                
                <div  class="text_center dialog_form_btn_box">
                    <el-button @click="isVisible = false">取 消</el-button>
                    <el-button type="primary" @click='onSubmit("form")'>确 认</el-button>
                </div>

            </el-form>
        </div>
    </el-dialog>
</template>

<script>
   import { mapState, mapGetters } from 'vuex'
//    import { addTask, } from "@/datums/api/task";
   import AreaJson from "@/assets/datas/area.json"

  export default {
      name:'addTask',
      data(){
          
          return {
            areaData:[],
            isVisible: this.isShow,
            form:{
                password:'',
                password_conf:'',
                passwordOld:''
              
            },
            
           
            //详情弹框信息
            dialog: {
                width:'400px',
                formLabelWidth:'120px'
            }
          }
      },
      props:{
          isShow:Boolean,
          dialogRow:Object
      },
      computed:{
        // ...mapGetters(['addFundDialog']),
      },
      created(){
            this.areaData = AreaJson
      },
      mounted(){
        if(this.addFundDialog.type === 'edit'){
            this.form = this.dialogRow;
            this.form.incomePayType = (this.dialogRow.incomePayType).toString();
        }else{
            this.$nextTick(() => {
                this.$refs['form'].resetFields()
            })
        }
      },
      methods:{

            

          getCascaderObj(val, opt){
            return val.map(function (value, index, array) {
                for (var item of opt) {
                    if (item.value == value) { 
                        opt = item.children; 
                        return item.label; 
                    }
                }
                return null;
            });
         },
          handleChange(value) {
            let vals = this.getCascaderObj(value, this.areaData);
            console.log(vals.join(',').replace(/,/g,'')); // str 
            this.form.address = vals.join(',').replace(/,/g,'');
          },
          closeDialog(){
              this.$emit('closeDialog');
          },
          //表单提交
          onSubmit(form){
            alert(JSON.stringify(this.form))
            return;
            this.$refs[form].validate((valid) => {
                if (valid) {//表单数据验证完成之后，提交数据;
                    let formData = this[form];
                    const para = Object.assign({}, formData)
                    console.log(para);
                    // edit
                    if(this.addFundDialog.type === 'edit'){
                    //     updateTask(para).then(res => {
                    //         this.$message({
                    //             message: '修改成功',
                    //             type: 'success'
                    //         })
                    //         this.$refs['form'].resetFields()
                    //         this.isVisible = false
                    //         this.$emit('getFundList');
                    //    })
                    }else{
                        // add
                        addTask(para).then(res => {
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            })
                            this.$refs['form'].resetFields()
                            this.isVisible = false
                            this.$emit('getFundList');
                       })
                    }
                }
            })
          }
      }
  }
</script>

<style lang="less" scoped>
    .search_container{
        margin-bottom: 20px;
    }
    .btnRight{
        float: right;
        margin-right: 0px !important;
    }
    .searchArea{
        background:rgba(255,255,255,1);
        border-radius:2px;
        padding: 18px 18px 0;
    }
</style>
