import requests,{postFormData} from "@/api"; //引入二次封装的axios

//获取区划树
export const getTree = () => requests.get("demoooo/xzqh/xzqhAll")

//风险类型树
export const getTreeCityRisk = () => requests.get("/demoooo/api/enterprise/classifyTree")

//机构部门
export const getTreeOrgDept = (data) => postFormData("/demoooo/organization/orgDeptTree",data)

//指挥机构
export const getTreeOrgVirtual = (data) => postFormData("/demoooo/virtualorganizationpersonal/listVirtualOrg",data)

//队伍类型
export const getTreeTroopsType = (data) => postFormData("/demoooo/dictionarydata/list/troops_type",data)

//事件类型树
export const getEventTypeTree = (params) => postFormData("/demoooo/type/tree", params);

//视频监控类型树
export const getMonitor = (params) => postFormData("/demoooo/type/types_monitor", params)

