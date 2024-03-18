import requests, { postFormData } from "@/api"; 

const baseBefer = '/'

/** 查询数据字典 1维数组 */
export const getSelectOption = (params) => requests.get(baseBefer+"demooo/common/getDictData?dicCode="+params);


//获取区划树
export const getTreeXzqh = () => requests.get("demooo/xzqh/xzqhAll")

//风险类型树
export const getTreeCityRisk = () => requests.get("/demooo/enterprise/classifyTree")

//机构部门
export const getTreeOrgDept = (data) => postFormData("/demooo/organization/orgDeptTree",data)

//指挥机构
export const getTreeOrgVirtual = (data) => postFormData("/demooo/virtualorganizationpersonal/listVirtualOrg",data)

//队伍类型
export const getTreeTroopsType = (data) => postFormData("/demooo/dictionarydata/list/troops_type",data)

//预案类型 tag:1
export const getTreePlan = (data) => postFormData("demooo/type/tree",data)


//地图图层列表
export const getMapLayer = () => postFormData('demooo/baselayer/search',data)

