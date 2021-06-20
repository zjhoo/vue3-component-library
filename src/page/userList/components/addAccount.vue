<template>
    <el-dialog 
        :visible.sync="isVisible"
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        :modal-append-to-body="false"
        :title='accountDialog.title' 
        class="my-dialog-middle"
        @close="closeDialog">
        <div class="form">
            <el-form 
                ref="form" 
                :model="form"
                :rules="form_rules"
                :label-width="dialog.formLabelWidth" 
                style="width:auto;">

                <el-form-item prop='name' label="用户名:">
                    <el-input type="text" v-model="form.username" placeholder="由4~10位的 数字/字母/_ 组成"></el-input>
                </el-form-item>
                <!-- <el-form-item prop='password1'  label="密码:" v-if="accountDialog.type ='add'">
                    <el-input type="password" v-model="form.password1"  placeholder="由4~10位的 数字/字母/_ 组成" ></el-input>
                </el-form-item>
                <el-form-item prop="password2" label="确认密码" v-if="accountDialog.type ='add'">
                    <el-input type="password" v-model="form.password2" placeholder="必须和密码一致"></el-input>
              </el-form-item> -->

                <el-form-item prop='accoutCash' label="姓名:">
                    <el-input v-model="form.name" placeholder="由4~10位的 字母,_ 组成" ></el-input>
                </el-form-item>
                <el-form-item prop='phone' label="联系电话:">
                    <el-input v-model.number="form.phone" placeholder="中国地区的手机号"></el-input>
                </el-form-item>
                <el-form-item label="角色:" >
                    <el-select v-model="form.role" placeholder="请选择角色">
                        <el-option
                            v-for="item in rolesDownData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="备注:">  
                    <el-input type="textarea" v-model="form.remarks"></el-input>
                </el-form-item> -->
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
import { getRolesDownList, addAccount, editAccount } from "@/datums/api/user";
import { encrypt } from '@/utils/mUtils';
import { validateUserName, validatePassWD, validatePhone,validateAccount} from "@/assets/datas/validate.js"

export default {
      name:'addAccount',
      data(){
           var validatePassWDConfirm = (rule, value, callback) => { //确认密码 验证规则
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form.password1) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }
          
          return {
            areaData:[],
            isVisible: this.isShow,
            form:{
                "creatorId": this.$store.getters.userId,
                "name": "",
                "password": "",
                "password1": "",
                "password2": "",
                "phone": "",
                "roleId": '',
                "username": ""
            },
            form_rules: {
                name   : [
                    {required: true, validator:validateAccount,trigger: 'blur'} //用户名 validateUserName
                ],
                password1   : [
                    { required: true, validator:validatePassWD,trigger: 'change'} 
                ],
                password2:[
                    {validator: validatePassWDConfirm, trigger: 'change' }
                ],   
                username   : [
                    { required: true, validator:validateUserName,trigger: 'change'} 
                ],
                phone   : [
                    { required: true, validator:validatePhone,trigger: 'blur'}
                ]
            },
            
            dialog: { //详情弹框信息
                width:'400px',
                formLabelWidth:'120px'
            },
            // accountDialog:this.$store.getters.accountDialog,
            rolesDownData:[], //角色下拉
          }
          
    },
    props:{
          isShow:Boolean,
          dialogRow:Object
    },
    // watch: {
    //     dialogRow (newValue, oldValue) {
    //         console.log("oldValue: "+oldValue)
    //         console.log("newValue: "+newValue)
    //     }
    // },

    computed:{
        ...mapGetters(['accountDialog'])
    },
      created(){
          },
      mounted(){
          console.log(this.$store.getters.accountDialog)
        //   debugger
        if(this.accountDialog.title === '编辑账号'){
            console.log(this.dialogRow)
            this.form = this.dialogRow;
        }else{
            this.$nextTick(() => {
                this.$refs['form'].resetFields() //清空输入框
            })
        }
        this.getRolsList();
       
        
      },
      methods:{
          //下拉角色列表
          getRolsList(){
              getRolesDownList({
                  id:this.$store.getters.userId
              }).then((res) =>{
                  this.rolesDownData = res.data;
                  console.log(this.rolesDownData)
              })
          },

          //添加一个账号
          addAccountOne(){
              addAccount({
                    "creatorId": form.creatorId,
                    "name": form.name,
                    "password": form.password,
                    "phone": form.phone,
                    "roleId": form.roleId,
                    "username": form.username
                }).then((res)=>{

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
            //下拉选项判断
            if(parseInt(this.form.role) || parseInt(this.form.role)===0 ){
                this.form.roleId = this.form.role;
            }else{
                if(this.rolesDownData && this.rolesDownData.length>0){
                    let roleName;
                    for (let i = 0; i < this.rolesDownData.length; i++) {
                        roleName = this.rolesDownData[i].name;
                        if(roleName == this.form.role){
                            this.form.roleId = this.rolesDownData[i].id
                        }
                    }
                }
            }
            alert(JSON.stringify(this.form))
            this.$refs[form].validate((valid) => {
                if (valid) {//表单数据验证完成之后，提交数据;
                    let formData = this[form]; //encrypt
                    formData.password = encrypt(formData.password1)
                    console.log(formData)
                    const para = Object.assign({}, formData)
                    // console.log(this.$store.getters.accountDialog.type);
                    // return false;
                    // edit
                    if(this.$store.getters.accountDialog.title === '编辑账号'){
                        editAccount(para).then(res => {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            })
                            this.$refs['form'].resetFields()
                            this.isVisible = false
                            this.$emit('getAccountsList');
                       })
                    }else{ //add
                        addAccount(para).then(res => {
                            this.$message({
                                message: '新增成功',
                                type: 'success'
                            })
                            this.$refs['form'].resetFields()
                            this.isVisible = false
                            this.$emit('getAccountsList'); //刷新列表
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
