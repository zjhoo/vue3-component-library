<template>
    <el-dialog 
        :visible.sync="isVisible"
        :title='roleDialog.title' 
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :modal-append-to-body="false"
        class="my-dialog-middle"
        @close="closeDialog">
        <div class="form">
            <el-form 
                ref="form" 
                :model="form"
                :label-width="dialog.formLabelWidth" 
                style="width:auto;">
              
                <el-form-item prop='name' label="角色名称 :">
                    <el-input type="text" v-model="form.name" placeholder="3-10位数字或字母"></el-input>
                </el-form-item> 

                <el-form-item prop='name' label="功能列表 :">
                    <el-checkbox-group class="authorityList" v-model="roleChecked" >
                        <el-checkbox v-for="item in roleCheckList" :key="item.id" :label="item.id ">{{ item.title }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <div  class="text_center dialog_form_btn_box">
                    <el-button @click="isVisible = false">取 消</el-button>
                    <el-button type="primary" @click='onSubmit("form")'>提  交</el-button>
                </div>

            </el-form>
        </div>
    </el-dialog>
</template>

<script>
   import { mapState, mapGetters } from 'vuex'
   import { getAllFunction, addRoles,editRoles, roleFunction } from "@/datums/api/user";

  export default {
      name:'addRole',
      data(){
          let validateData = (rule, value, callback) => {
                if(value === ''){
                    let text;
                    if(rule.field == "income"){
                        text='收入';
                    }else if(rule.field == "pay"){
                        text='支出';
                    }else if(rule.field == 'accoutCash'){
                        text='账户现金';
                    }
                    callback(new Error(text+'不能为空~'));
                }else{
                   let numReg = /^[0-9]+.?[0-9]*$/;
                   if(!numReg.test(value)){
                      callback(new Error('请输入正数值'));
                   }else{
                      callback();
                   }
                }
            };
          return {
            allFunction:'', //全部一级菜单
            areaData:[],
            isVisible: this.isShow,
            form:{
                "functions": [],
                "id": '',
                "name": ""
            },
            roleChecked:[ ],
            roleCheckList: [],                                 //所以权限列表
               
                                  
         
            form_rules: {
                rolename   : [
                    {required: true, message : '角色名不能为空！',trigger : 'blur'}
                ],
                username   : [
                    {required: true, message : '用户名不能为空！',trigger : 'blur'}
                ],
                income   : [
                    { required: true, validator:validateData,trigger: 'blur'}
                ],
                pay   : [
                    { required: true, validator:validateData,trigger: 'blur'}
                ],
                accoutCash   : [
                    { required: true, validator:validateData,trigger: 'blur'}
                ],
                incomePayType:[
                    { required: true, message: '请选择收支类型', trigger: 'change' }
                ]
            },

            //详情弹框信息
            dialog: {
                width:'400px',
                formLabelWidth:'120px'
            },
          }
      },
      props:{
          isShow:Boolean,
          dialogRow:Object
      },
      computed:{
        ...mapGetters(['roleDialog']),
      },
      mounted(){
        this.roleChecked=[];
        if(this.roleDialog.type === 'edit'){
              console.log(this.dialogRow)
              this.form.id = this.dialogRow.id;
              this.form.name = this.dialogRow.name;
              this.getRoleFunction();
        }else{
            this.$nextTick(() => {
                this.$refs['form'].resetFields()
            })
        }
        this.getAllFunc();
            
      },
      methods:{
          //获取权限列表 all
          getAllFunc(){
              getAllFunction({ //获取权限列表 all
                  accountId:this.dialogRow.id,
                  roleId:this.$store.getters.userId
              }).then((res)=>{
                  this.roleCheckList = res.data
                  console.log(JSON.stringify(this.roleCheckList))
              })
          },
          //获取角色信息 （功能列表）
          getRoleFunction(){
              roleFunction({id:this.dialogRow.id,}).then(res =>{
                let arr = res.data.functions;
                arr.forEach(item => {
                    this.roleChecked.push(item.id);
                });
                // console.log(this.roleChecked)
              })
          },


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
              console.log(this.roleChecked)
              if(this.roleChecked && this.roleChecked.length>0){
                  this.form.functions = this.roleChecked
              }else{
                  return this.$message({
                                message: '请选择权限',
                                type: 'error'
                            });
              }
            this.$refs[form].validate((valid) => {
                if (valid) {//表单数据验证完成之后，提交数据;
                    let formData = this[form];
                    const para = Object.assign({}, formData)
                    console.log(para);
                    // edit
                    if(this.roleDialog.type === 'edit'){
                        editRoles(para).then(res => {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            })
                            this.$refs['form'].resetFields()
                            this.isVisible = false
                            this.$emit('getList');
                       })
                    }else{
                        addRoles(para).then(res => {
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            })
                            this.$refs['form'].resetFields()
                            this.isVisible = false
                            this.$emit('getList');
                       })
                    }
                }
            })
          }
      }
  }
</script>

<style lang="less" scoped>
    .authorityList{
        display: flex;
        flex-direction: column;
    }
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
    .authorityTreeBox{
      
      .title{
        height:auto;
        vertical-align: top;
        margin-left: 110px;
        display: inline-block;
      }
      .authorityTree{
        height:auto;
        vertical-align: top;
        margin-left: 80px;
        margin-bottom: 30px;
        display: inline-block;
      }
    }
</style>
