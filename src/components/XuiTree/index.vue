<script>
import { h,ref } from 'vue'
import { ElTree } from "element-plus"
import { getTree, getTreeCityRisk, getTreeOrgDept, getTreeOrgVirtual, getTreeTroopsType, getEventTypeTree, getMonitor } from './api'
// import { Expand, Fold } from "@element-plus/icons-vue"

const XuiTree = {
  props: {
    mode: String, 
    
  },
  emits: [
    'click:item',
    'nodeClick'
    // 'update:selection',
  ],
  
  setup(props, { emit, attrs }){
    // console.log('**************props: ', props);
    // console.log('**************attrs: ', attrs);
    const mode = props.mode || 'xzqh'
    const modeEnum = {
      xzqh: "行政区划",
      cityRisk: "风险类型",
      orgDept: "机构部门", //{treeType:orgType,org,dept}
      orgVirtual: "指挥机构",
      troopsType: "队伍类型",
      sjlx:"事件类型",
      spjk:"视频监控类型"
    }

    const msg = ref('hello xui-tree')
    const options = ref([])


    const getTreeData = async () => {
      let res
      switch (mode) {
        case 'xzqh':
          res = await getTree();
          if(res && res.code == 200){
            options.value = filterJson(res.data, { id: "xzqhCode",label:"xzqhName", pid: "parentCode" })
          }
          break;
        case 'cityRisk':
          res = await getTreeCityRisk()
          if(res && res.code == 200){
            options.value = initTree(res.data, { id: "id",label:"title", pid: "pid" })
          }
          break;
        case 'orgDept':
          res = await getTreeOrgDept({ treeType: "orgType,org,dept" })
          if(res && res.code == 200){
            options.value = initTree(res.data, { id: "id",label:"title", pid: "pId" })
          }
          break;
        case 'orgVirtual':
          res = await getTreeOrgVirtual({ })
          if(res && res.code == 200){
            options.value = initTree(res.data, { id: "id",label:"orgName", pid: "orgParent" })
          }
          break;
        case 'troopsType':
          res = await getTreeTroopsType({ })
          if(res && res.code == 200){
            options.value = res.data || [] //initTree(res.data, { id: "id",label:"orgName", pid: "orgParent" })
          }
          break;
        case 'sjlx':
          res = await getEventTypeTree({ tag: "1" })
          if(res && res.code == 200){
            options.value = initTree(res.data, { id: "id",label:'typeName', pid: "parentId" })
          }
          break;
        case 'spjk':
          res = await getMonitor({ })
          if(res && res.code == 200){
            options.value = initTree(res.data, { id: "id",label:'typeName', pid: "parentId" })
          }
          break;
          
        default:
          break;
      }
      // console.log('res-----------',res,mode);
      if (res && res.code == 200) {
      }
      console.log(options.value, "real tree json")
    }
    getTreeData()

    return {
      msg,
      attrs,
      options,
      mode,
      modeEnum,
    }
  },
  

  render(){
    return h('div',[
      h('div',{class:"tree-cpt-title"},[
        this.modeEnum[this.mode]
      ]),
      
      h(ElTree,{
        'default-expand-all':true,
        'highlight-current':true,
        ...this.attrs,
        // label: "xzqhName",
        data: this.options,
        onNodeClick:(...arg) => { 
          this.$emit('nodeClick',...arg)
          // console.log(arg[0], arg[1]);
        }
      }, ({ data, node })=>{ 
        // console.log(data, node, node.data.id );
        if(this.mode=='xzqh'){
          return node.data.xzqhName 
        }else if(this.mode=="cityRisk" || this.mode =="orgDept"){
          return node.data.title 
        }else if(this.mode=="orgVirtual"){
          return node.data.orgName
        }else if(this.mode=="troopsType"){
          return `😊 ${node.data.dataName}`
        }
      })
    ])
  }
}

// 工具函数
const filterJson = (data, {id, label, pid='parentCode'}) => {
  let jsons = []
  // console.log(44444444444455555,data);
  if(!data) return jsons
  
  const arr = data.map(item => {
    if(!!item.parentCode){
      item = checkJsonChildren(data, item, id, label)
    }else{
      item = { label:item[label], ...item}
    }
    return item
  })
  // console.log('================',arr);
  return [arr[arr.length-1][0] ]
}
const checkJsonChildren = (arr, item, codeStr, nameStr) => {
  if(!arr || arr.length<1) return arr
  return arr.map((it,i) => {
    // console.log('------------',it[codeStr], item.parentCode);
    // console.log(it[nameStr]);
    if(it[codeStr] && it[codeStr] === item.parentCode){ //找到父节点
      it.children ? it.children.push({...item, label:it[nameStr] }) : it.children=[{...item, label:it[nameStr]}]
    }else if(it?.children && it.children.length>0){
     it.children = checkJsonChildren(it.children, item, codeStr)
    }
    it.label=it[nameStr]
    // console.log(4444444556677,{ label:it[nameStr], ...it} );
    return { label:it[nameStr], ...it}
  })
}

const initTree = (data, config = {}) => {
    data = JSON.parse(JSON.stringify(data))
    var id = config.id || "id"
    var pid = config.pid || "pid"
    var children = config.children || "children"
    var idMap = {}
    var jsonTree = []
    data.forEach(function (v) {
        idMap[v[id]] = v
        v.dataFlag == "orgType" ? v.disabled = true : v.dataFlag
    })
    data.forEach(function (v) {
        var parent = idMap[v[pid]]
        if (parent) {
            !parent[children] && (parent[children] = [])
            parent[children].push(v)
        } else {
            jsonTree.push(v)
        }
    })
    return jsonTree
}

export default XuiTree
</script>

<style lang="scss" scoped>
.tree-cpt-title{
  color: #595959;
  padding-left: 15px;
  height: 42px;
  line-height: 42px;
  background-color: #f2f2f2;
  display: flex;
  justify-content: space-between;
  align-items:center
}

</style>