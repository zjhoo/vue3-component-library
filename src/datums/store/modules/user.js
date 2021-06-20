const userDialog = {
  state: {
    accountDialog: {
        type:'add',
        title:'添加账号'
    },
    roleDialog:{
        type:'add',
        title:"添加角色"
    }
  },
  getters:{
    accountDialog: state => state.accountDialog,
    roleDialog:state => state.roleDialog
  },
  mutations: {
    SET_ACCOUNT_DIALOG_TITLE: (state, type) => {
      console.log(type)
      if(type === 'add'){
        state.accountDialog.type = 'add'
        state.accountDialog.title = '添加账号'
      }else{
        state.accountDialog.type = 'edit'
        state.accountDialog.title = '编辑账号'
        console.log(state.accountDialog.type)
      }
    },
    SET_ROLE_DIALOG_TITLE: (state, type) => {
        console.log(type)
        if(type === 'add'){
          state.roleDialog.type = 'add'
          state.roleDialog.title = '添加角色'
        }else{
          state.roleDialog.type = 'edit'
          state.roleDialog.title = '编辑角色'
          console.log(state.roleDialog.type)
        }
      }
   
  },
  actions: { }
}

export default userDialog



// const userDialog  = {
//   state : {
//     roleDialog: {
//       title:'查看用户功能列表',
//       type:'see'
//     },
//     accountDialog: {
//       title:'新增账号',
//       type:'add'
//     },
//   },
//   getters : {
//     roleDialog: state =>state.roleDialog,
//     accountDialog: state =>state.accountDialog,
//   },
//   mutations: {
//     //角色功能列表对话框
//     SET_ROLE_DIALOG_TITLE: (state, type) => {
//       // if(type === 'see'){
//       //   state.roleDialog.title = '查看用户功能列表'
//       //   state.roleDialog.type = 'see'
//       // }else if(type === 'add'){
//       //   state.roleDialog.title = '新增用户功能列表'
//       //   state.roleDialog.type = 'add'
//       // } else{
//       //   state.roleDialog.title = '编辑用户功能列表'
//       //   state.roleDialog.type = 'edit'
//       // }
//     },

//     //新增和编辑账号 对话框
//     SET_ACCOUNT_DIALOG_TITLE: (state, type) => {
//       console.log(12)
//       console.log(type == "add")
//       if(type == "add"){
//         state.accountDialog.title = '新增账号'
//         state.accountDialog.type = 'add2'
//       } else{
//         state.accountDialog.title = '编辑账号'
//         state.accountDialog.type = 'edit'
//         console.log("--------->: "+type);
//       }
//     },
    
//   },
//   actions:{
      
      
     
//   }
// }

// export default userDialog;

// /**
//  * 1、用户退出,需要调取后台接口吗？后台具体的业务逻辑是什么？
//  * 
//  * 
//  */