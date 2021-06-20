const sys = {
  state: {
    sysName:"管理平台",
    sysLogin:"",
    
  },
  getters:{
    sysName: state => state.sysName,
    sysLogin: state => state.sysLogin,
  }
  
}

export default sys
