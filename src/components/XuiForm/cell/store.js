import { defineStore } from "pinia";


/**
 {
    headquarters_type__id:[], //下拉数据 (code__codeVal)

    tree_xzqh:[], //树型下拉数据(tree__code__codeVal)
    tree_plan:[]
}
*/
export default defineStore('xuiSearchStore', {
    state: () => {
        return {
            optionsObj: {},
        }
    },
    actions: {
        setOptions(key, arr) {
            this.optionsObj[key]=arr
        },
        getOptions(key){
            // console.log('=================optionsObj:', this.optionsObj);
            return  (key && this.optionsObj[key]) ? this.optionsObj[key] : null
        }
    },

})