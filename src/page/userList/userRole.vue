<template>
    <div class="fillcontain">
        <!--任务执行-->
        <div class="info_container">
            <div class="labelTop">
                <div class="labelTopBox">
                    <router-link class="labeler1" :to="{path: '/userManager/userAccount'}"> <span> 账号管理 </span></router-link>
                    <div class="labeler2"> <span> 角色管理 </span></div>
                    <el-button  class="addTask" @click='showAddRoleDialog()' icon="iconfont iconjiashang">添加角色</el-button>
                </div>
               
            </div>
        <div class="table_container">
            <el-table
                border
                :data="tableData"
                style="width: 100%"
                align='center'
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
            <!-- <el-table-column
                type="selection"
                align='center'
                width="60">
            </el-table-column> -->
              <el-table-column
                prop="name"
                label="角色名称"
                align='center'
                width="100"
                sortable>
            </el-table-column>
             <el-table-column
                label="功能列表"
                align='center'
                sortable> 
                <template slot-scope="scope">  
                    <i class="iconfont iconziyuanchakan" style="color:#00d053;font-size:small;cursor:pointer"></i>
                    <span @click='showFunctionDialog(scope.row)'  style="color:#00d053;cursor:pointer">点击查看</span>
                </template>
            </el-table-column>
        
            <el-table-column 
                prop="createTime"
                label="创建时间"
                align='center'
                sortable>
                <template slot-scope="scope">
                    <!-- <el-icon name="time"></el-icon> -->
                    <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="operation"
                align='center'
                label="操作"
                width="180">
                <template slot-scope='scope'>
                    <!-- <el-button 
                        type="warning" plain
                        icon="iconfont icontixing"
                        size="mini"
                        @click='onStopTask(scope.row)'
                    > 停止任务</el-button> -->
                    <el-button 
                        type="warning" 
                        icon='edit' 
                        size="mini"
                        @click='showEditRoleDialog(scope.row)'
                    >编 辑</el-button>
                    <el-button 
                        type="danger" 
                        icon='delete' 
                        size="mini"
                        @click='onDeleteMoney(scope.row,scope.$index)'
                    >删 除</el-button>
                </template>
            </el-table-column>
            </el-table>
            <pagination :pageTotal="pageTotal" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></pagination>
            <RoleDialog  v-if="roleDialog.show" :isShow="roleDialog.show" :dialogRow="roleDialog.data" @getList="getList"  @closeDialog="hideRoleDialog"></RoleDialog>
            <FunctionDialog  v-if="functionDialog.show" :isShow="functionDialog.show" :dialogRow="functionDialog.data"  @closeDialog="hidefuncDialog"></FunctionDialog>
            
        </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import * as mutils from '@/utils/mUtils'
    import Pagination from "@/components/pagination"; 
    import RoleDialog from "./components/addRole";
    import FunctionDialog from "./components/function";
    import { getRolesList } from "@/datums/api/user";
    export default {
        data(){
            return {
               tableData: [],
                // tableHeight:0,
                loading:true,
                idFlag:false,
                isShow:false, // 是否显示资金modal,默认为false
                editid:'',
                rowIds:[],
                sortnum:0,
                format_type_list: {
                    0: '取货点1',
                    1: '取货点2',
                    2: '取货点3',
                },
                functionDialog:{  
                    show:false,
                    data:{}
                },
                roleDialog:{
                    show:false,
                    data:{}
                },
                incomePayData:{
                    page:1,
                    limit:20,
                    name:''
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
            Pagination,
            RoleDialog,
            FunctionDialog
        },
      	mounted() {
            this.getList();
        },
        methods: {
            //获取角色列表
            getList(p){
                getRolesList(this.pagingData).then((res) => {
                    let data = res.data.items;
                    console.log(data)
                    this.tableData = data;
                    this.pageTotal = res.data.totalNum
                    this.loading = false;
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

            setTableHeight(){
                this.$nextTick(() => {
                   this.tableHeight =  document.body.clientHeight - 300
                })
             },
          
            // 角色弹框
            showEditRoleDialog(row){
                console.log(row)
                this.$store.commit('SET_ROLE_DIALOG_TITLE','edit')
                this.roleDialog.data = {...row};
                this.roleDialog.show = true;
            },
            showAddRoleDialog(val){
                this.$store.commit('SET_ROLE_DIALOG_TITLE', 'add')
                this.roleDialog.show = true;
            },
            hideRoleDialog(){
                this.roleDialog.show = false;
            },

            //功能列表 弹框
            showFunctionDialog(val){
                this.functionDialog.data = val;
                this.functionDialog.show = true;
            },
            hidefuncDialog(){
                this.functionDialog.show = false;
            },

            /**
            * 格式化状态
            */
            formatterType(item) {
                const type = parseInt(item.incomePayType);
                return this.format_type_list[type];
            },
            filterType(value, item) {
                const type = parseInt(item.incomePayType);
                return this.format_type_list[value] == this.format_type_list[type];
            },
           
            
            // 停止任务
            onStopTask(row){
                this.$confirm('确认停止任务吗?', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    const para = { id: row.id }
                    removeMoney(para).then(res => {
                        this.$message({
                            message: '已停止任务',
                            type: 'success'
                        })
                        // this.getMoneyList()
                    })
                })
                .catch(() => {})
            },

            // 删除数据
            onDeleteMoney(row){
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    const para = { id: row.id }
                    removeMoney(para).then(res => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.getMoneyList()
                    })
                })
                .catch(() => {})
            },
            onBatchDelMoney(){
                this.$confirm('确认批量删除记录吗?', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    const ids = this.rowIds.map(item => item.id).toString()
                    const para = { ids: ids }
                    batchremoveMoney(para).then(res => {
                        this.$message({
                            message: '批量删除成功',
                            type: 'success'
                        })
                        this.getMoneyList()
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
    .fillcontain{padding: 0}
    .labelTop{
        margin-left: 10px;
        width: 100%;
        
        .labelTopBox{
            overflow: hidden;
             border-top-left-radius: 6px;
             .labeler1{
                display: inline-block;
                width: 160px;
                text-align: center;
                line-height: 46px;
                border: 1px solid #DDDDDD;
                color:#333333;
                border-top-left-radius: 6px;
                position: relative;
                top:6px;
                z-index: 16;
                span{
                    display: inline-block;
                }
            }
            .labeler2{
                display: inline-block;
                position: relative;
                left:-10px;
                width: 160px;
                text-align: center;
                background-color: #4490D7;
                border-top-right-radius: 6px;
                border-top-left-radius: 6px;
                color: #fff;
                line-height: 50px;
                transform:skewX(15deg);
                -webkit-transform:skewX(15deg);  /*兼容-webkit-引擎浏览器*/
                -moz-transform:skewX(15deg);/*兼容-moz-引擎浏览器*/
                z-index: 19;
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


