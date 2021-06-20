<template>
    <div class="fillcontain">
        <!--任务执行-->
        <div class="info_container">
            <div class="labelTop">
                <div class="labelTopBox">
                    <div class="labeler1"> <span> 账号管理 </span></div>
                    <router-link class="labeler2" :to="{path: '/userManager/userRole'}"> <span> 角色管理 </span></router-link>
                    <el-button  class="addTask" @click="onAddAccount" icon="iconfont iconjiashang">添加账号</el-button>
                </div>
               
            </div>
        <div class="table_container">
            <el-table
                :data="tableData"
                style="width: 100%"
                align='center'
                border
                @select="selectTable"
                @select-all="selectAll"
                >
                <el-table-column
                    v-if="idFlag"
                    prop="id"
                    label="id"
                    align='center'
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="用户名"
                    align='center'
                    sortable>
                </el-table-column>
                <el-table-column
                    prop="role"
                    label="角色"
                    align='center'
                    sortable>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    align='center'
                    sortable>
                </el-table-column>
                <el-table-column 
                    prop="phone"
                    label="联系电话"
                    align='center'
                    sortable>
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ scope.row.phone }}</span>
                    </template>
                </el-table-column>
                
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    align='center'
                    >
                </el-table-column>
                <el-table-column
                    prop="operation"
                    align='center'
                    label="操作"
                    width="180">
                    <template slot-scope='scope'>
                        <el-button 
                            type="warning" 
                            icon='edit' 
                            size="mini"
                            @click='onEditAccount(scope.row)'
                        >编辑</el-button>
                        <el-button 
                            type="danger" 
                            icon='delete' 
                            size="mini"
                            @click='onDeleteAccount(scope.row,scope.$index)'
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :pageTotal="pageTotal" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></pagination>
            <AddAccount  v-if="dialogRow.show" :isShow="dialogRow.show" :dialogRow="dialogRow.data"   @getAccountsList="getList"   @closeDialog="hideAddAccountDialog"></AddAccount>
        </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import * as mutils from '@/utils/mUtils'
    import AddAccount from "./components/addAccount";
    import Pagination from "@/components/pagination";
    import { getAccounts,delAccount } from "@/datums/api/user";
    export default {
        data(){
            return {
               tableData: [{
                    createTime: "2019-10-14 10:52:22",
                    id: 2,
                    name: "系统管理员",
                    phone: "13616084235",
                    role: "系统管理员",
                    username: "admin"
               }],
                tableHeight:0,
                loading:true,
                idFlag:false,
                isShow:false, // 是否显示资金modal,默认为false
                editid:'',
                rowIds:[],
                sortnum:0,

                dialogRow:{  
                    show:false,
                    data:{}
                },
              
                pageTotal:0,
                pagingData:{
                    id:this.$store.getters.userId,
                    currentPage:1,
                    pageSize:10,
                },
            
            }
        },
        components:{
            AddAccount,
            Pagination
        },
      	mounted() {
              this.getList();
        },
        methods: {
            //获取账号列表
            getList(){
                getAccounts(this.pagingData).then((res)=>{
                    this.tableData = res.data.items;
                    console.log(res)
                    this.loading = false;
                    this.pageTotal = res.data.totalNum
                })
            },
            // 当前第几页
            handleCurrentChange(val){
                console.log(val)
                this.pagingData.currentPage = val;
                this.getList()
            },
            // 每页显示多少条
            handleSizeChange(val){
                console.log(val)
                this.pagingData.pageSize = val;
                this.getList()
            },

            // 显示新增账号 弹框
            // showAddAccountDialog(){
            //     this.addAccount.show = true;
            // },
            hideAddAccountDialog(){
                this.dialogRow.show = false;
            },
            
          
           
            // 编辑操作方法
            onEditAccount(row){
                
                // console.log('edit :'+JSON.stringify(row))
                this.$store.commit('SET_ACCOUNT_DIALOG_TITLE', 'edit')
                this.dialogRow.data = {...row};
                this.dialogRow.show = true;
            },
            // 添加账号方法
            onAddAccount(){
                this.$store.commit('SET_ACCOUNT_DIALOG_TITLE', 'add')
                this.dialogRow.show = true;
            },

            // 删除数据
            onDeleteAccount(row){
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    console.log(row)
                    delAccount({ 
                        id: row.id
                     }).then(res => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.getList() //刷新列表
                    })
                })
                .catch(() => {})
            },

            // 当用户手动勾选数据行的 Checkbox 时触发的事件
            selectTable(val, row){
                this.setSearchBtn(val);
            },
            // 用户全选checkbox时触发该事件
            selectAll(val){
                 val.forEach((item) => {
                     this.rowIds.push(item.id);
                });
                this.setSearchBtn(val);
            },
            setSearchBtn(val){
                let isFlag = true;
                if(val.length > 0){
                    isFlag = false;
                }else{
                    isFlag = true;
                }
                this.$store.commit('SET_SEARCHBTN_DISABLED',isFlag);
            }
        },
    }
</script>

<style lang="less" scoped>
    .fillcontain{padding:0;}
    .labelTop{
        margin-left: 10px;
        width: 100%;
        
        .labelTopBox{
            overflow: hidden;
             border-top-left-radius: 6px;
            .labeler1{
                display: inline-block;
                padding-left: 30px;
                position: relative;
                left:-30px;
                width: 160px;
                text-align: center;
                background-color: #4490D7;
                color: #fff;
                line-height: 50px;
                transform:skewX(15deg);
                -webkit-transform:skewX(15deg);  /*兼容-webkit-引擎浏览器*/
                -moz-transform:skewX(15deg);/*兼容-moz-引擎浏览器*/
                z-index: 19;
                background-color: #4490D7;
                // background-image: linear-gradient(to bottom right,rgb(71, 145, 214), rgb(74, 76, 218) );
                box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
                span{
                    display: inline-block;
                    transform:skewX(-15deg);
                    -webkit-transform:skewX(-15deg);  /*兼容-webkit-引擎浏览器*/
                    -moz-transform:skewX(-15deg);
                    font-weight: 700;
                }
            }
            .labeler2{
                display: inline-block;
                width: 160px;
                text-align: center;
                line-height: 46px;
                border: 1px solid #DDDDDD;
                color:#333333;
                border-top-right-radius: 6px;
                position: relative;
                left:-30px;
                top:6px;
                transform:skewX(15deg);
                -webkit-transform:skewX(15deg);  /*兼容-webkit-引擎浏览器*/
                -moz-transform:skewX(15deg);/*兼容-moz-引擎浏览器*/
                z-index: 16;
                span{
                    display: inline-block;
                    transform:skewX(-15deg);
                    -webkit-transform:skewX(-15deg);  /*兼容-webkit-引擎浏览器*/
                    -moz-transform:skewX(-15deg);
                }
            }
            
            .addTask{
                background-color: #1FB298;
                color:#fff;
                float: right;
                margin-right: 20px;
                transition:background-color .5s;
                -moz-transition:background-color .5s; /* Firefox 4 */
                -webkit-transition:background-color .5s; /* Safari and Chrome */
                -o-transition:background-color .5s; /* Opera */
            }
            .addTask:hover{
                box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
                background-color: rgb(71, 145, 214);
            }
        
        }
        
    }
    .icontixing{
        color:red;
        background: #3bc5ff;
    }
    .info_container{
       padding: 20px;
       background: #fff;
       box-sizing: border-box;
       overflow: auto;
    }
    .row{
        margin:20px;
    }
   .info_row{
        .area{
           border:1px solid #dfdfdf;
           height:178px;
           overflow:hidden;
            .imgarea{
                text-align:center;
                padding:10px;
                img {
                    width:120px;
                    height:120px;
                    border-radius: 50%;
                }
            }
            .namearea{
                padding:10px;
                font-size:14px;
                p{
                    line-height:24px;
                }
                .awards{
                    text-align:center;
                    width:100%;
                    height:30px;
                    line-height:30px;
                    cursor: pointer;
                    background-color: #3bc5ff;
                    border:1px solid #3bc5ff;
                    color: white;
                    display: block;
                }
                .awards:hover{
                    background-color: #f9c855;
                    border:1px solid #f9c855;
                }
            }

        }
   } 

   .table_container{
        padding:0 10px 10px 10px;
        background: #fff;
        border-radius: 2px;
    }
    .el-dialog--small{
       width: 600px !important;
    }
    

</style>


