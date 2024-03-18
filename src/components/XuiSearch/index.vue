<script>
import { h, ref, toRef, reactive } from "vue";
import {
  ElRow,
  ElCol,
  ElButton,
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElTreeSelect
} from "element-plus";
// import wInput from "./cell/wInput.js";
import { getSelectOption, getTreeXzqh, getTreePlan } from "./cell/api";
import useStore from './cell/store';

export default {
  props: {
    jsons: Array,
    // data:Object,
    // modelValue: Object,
  },
  emits: ["update:vals", "click:search", "click:reset"],

  setup(props, { emit, attrs }) {
    const jsonsRef = toRef(props, "jsons");
    const optionsRef = ref([]);
    // const { modelValue } = toRefs(props)
    // console.log('xui-search-----', attrs, attrs?.colon);
    // const { colon } = toRef(attrs)
    // console.log(222222, emit, props, modelValue );
    const iStore = useStore()

    // init Select Options
  const initOptions = () => {
    jsonsRef.value?.map((el, i) => {
      optionsRef.value[i] = el?.options || [];
      if (el?.ele == "Select") {
        if (el?.code) {
          // /system/api/common/getDictData?dicCode=key_point
          console.log(el.key, el.options);
          if(!el?.options || el.options?.length<1){
            const { codeVal='id' } = el
            const storeKey = `select__${el.code}__${codeVal}`
            if(iStore.getOptions(storeKey)){
              optionsRef.value[i] = iStore.getOptions(storeKey)
            }else{
              getSelectOption(el.code).then(res=>{
                const { data=[] } = res
                optionsRef.value[i] = data?.map(item=>{
                  return {
                    value: item[codeVal],
                    label: item.dataName,
                    ...item,
                  };
                });
                iStore.setOptions(storeKey, optionsRef.value[i])
              });
            }
          }
        }
      }
      if(el?.ele == "TreeSelect") {
        if(el?.code) {
          if(!el?.data || el.data?.length<1){
            const { codeVal='id' } = el
            const storeKey = `tree__${el.code}__${codeVal}`
            switch (el.code) {
              case 'xzqh':
              if(iStore.getOptions(storeKey)){
                optionsRef.value[i] = iStore.getOptions(storeKey)
              }else{
                getTreeXzqh()
                  .then(res => {
                    const { data=[] } = res
                    optionsRef.value[i] = initTree(data, { id: "xzqhCode",label:"xzqhName", pid: "parentCode" },codeVal)
                    // console.log(123123, optionsRef.value[i]);
                    iStore.setOptions(storeKey, optionsRef.value[i])
                  })
                }
                break;
              case 'plan':
                if(iStore.getOptions(storeKey)){
                  optionsRef.value[i] = iStore.getOptions(storeKey)
                }else{
                  getTreePlan({tag:1})
                    .then(res => {
                      const { data=[] } = res
                      optionsRef.value[i] = initTree(data, { id: "id",label:"typeName", pid: "parentId" }, codeVal)
                      // console.log('------------======', optionsRef.value[i]);
                      iStore.setOptions(storeKey, optionsRef.value[i])
                    })
                }
                break;
              default:
                break;
            }
          }
        }
      }
      return el;
    });
  }
  initOptions()

    
  const initTree = (data, config = {}, codeVal='id') => {
      data = JSON.parse(JSON.stringify(data))
      var id = config.id || "id"
      var pid = config.pid || "pid"
      var label = config.label || "label"
      var children = config.children || "children"
      var idMap = {}
      var jsonTree = []
      data.forEach(function (v) {
          idMap[v[id]] = v
          v.value= v[codeVal] || v[id],
          v.label=v[label],
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

    let myVals = reactive({});

    jsonsRef.value?.map((item) => {
      if (item.key) {
        myVals[item.key] = item?.defaultVal || "";
      }
    });

    const reset = () => {
      jsonsRef.value?.map((item) => {
        if (item.key) {
          myVals[item.key] = item?.defaultVal || "";
        }
      });
      emit("update:vals", myVals);
    };

    // input
    const factoryInput = (i, placeholder, otherAttr, keyer) => {
      return h(ElInput, {
        key: `w-input-${i}`,
        placeholder: placeholder || "请输入",
        ...otherAttr,
        style: { flex: 1 },
        modelValue: myVals[keyer] || "",
        onInput: (val) => {
          myVals[keyer] = val;
          emit("update:vals", myVals);
        },
      });
    };

    // select
    const factorySelect = (i, placeholder, otherAttr, keyer) => {
      otherAttr.options = optionsRef.value[i] || [];

      return h(
        ElSelect,
        {
          key: `w-select-${i}`,
          placeholder: placeholder || "请选择",
          ...otherAttr,
          style: { flex: 1 },
          modelValue: myVals[keyer] || "",
          "collapse-tags": true,
          "collapse-tags-tooltip": true,
          onChange: (val) => {
            myVals[keyer] = val;
            // console.log(myVals);
            emit("update:vals", myVals);
          },
        },
        () =>
          otherAttr.options?.map((opt, oi) => {
            return h(ElOption, { key: `${keyer}-opt-${oi}`, ...opt });
          })
      );
    };

    // datePicker
    const factoryDatePicker = (i, placeholder, otherAttr, keyer, type) => {
      return h(ElDatePicker, {
        key: `w-data-picker-${i}`,
        placeholder: placeholder || "请选时间",
        type,
        ...otherAttr,
        style: { flex: 1 },
        // value: myVals[keyer],
        modelValue: myVals[keyer],
        onChange: (v) => {
          console.log("change", v);
        },
        onblur: (v) => {
          console.log("blur", v);
        },
        onPick: (v) => {
          console.log("pick", v);
        },
        "onUpdate:modelValue": (val) => {
          console.log("update:modeValue", val);
          myVals[keyer] = val;
          emit("update:vals", myVals);
        },
      });
    };

    //treeSelect 
    const factoryTreeSelect = (i, placeholder, otherAttr, keyer, type) =>{
      otherAttr.data = optionsRef.value[i] || [];
      return h(ElTreeSelect, {
        key: `w-tree-select-${i}`,
        placeholder: placeholder || "请选择",
        type,
        ...otherAttr,
        style: { flex: 1 },
        // value: myVals[keyer],
        modelValue: myVals[keyer],
        // onChange: (v) => {
        //   console.log("change", v);
        // },
        // onblur: (v) => {
        //   console.log("blur", v);
        // },
        // onPick: (v) => {
        //   console.log("pick", v);
        // },
        "onUpdate:modelValue": (val) => {
          console.log("update:modeValue", val);
          myVals[keyer] = val;
          emit("update:vals", myVals);
        },
      });
    }

    const defaultBtn = () => {
      return h(
        ElCol,
        {
          span: 6,
          style: {
            display: "flex",
            "flex-direction": "row",
            "justify-content": "flex-start",
            "align-items": "center",
            color: "#666",
          },
        },
        () => [
          h(
            ElButton,
            {
              type: "primary",
              icon: "Search",
              plain: false,
              // round:true,
              onClick: () => {
                emit("click:search", myVals);
              },
              style: { "margin-left": "20px","background-color":"#528FFF" },
            },
            () => "搜索"
          ),
          h(
            ElButton,
            {
              // type:"info",
              icon: "RefreshLeft",
              plain: true,
              // round:true,
              onClick: () => {
                reset();
                emit("click:reset", myVals);
              },
            },
            () => "重置"
          ),
        ]
      );
    };

    return {
      attrs,
      jsonsRef,
      optionsRef,
      // data,
      // modelValue,
      myVals,
      factoryInput,
      factorySelect,
      factoryDatePicker,
      factoryTreeSelect,
      defaultBtn,
      initOptions,
    };
  },
  render() {
    this.initOptions()
    //console.log('----------------', this.jsonsRef[2]['options']);
    const forms = this.jsonsRef?.map((el, i) => {
      const {
        ele,
        key,
        label,
        span = 6,
        placeholder,
        type,
        labelW = 70,
        options = [],
        ...otherAttr
      } = el;
      // console.log('2222233',key);
      const itemKey = key;
      // {{ this.myVals }}

      return h(
        ElCol,
        {
          span: span,
          key: i,
          class: "xui-cpt-search",
        },
        () => [
          h(
            "label",
            {
              style: {
                "min-width": labelW ? `${labelW}px` : "auto",
                margin: "6px 10px",
                color: "#000000e6",
                "font-size": "16px",
                "font-weight": "500",
                'text-align':'right'
              },
            },
            (this.attrs.colon===false || this.attrs.colon===undefined ) ? label : label + " : "
          ),

          ele == "Input" &&
            this.factoryInput(i, placeholder, otherAttr, itemKey),

          ele == "Select" &&
            this.factorySelect(i, placeholder, otherAttr, itemKey),

          ele == "DatePicker" &&
            this.factoryDatePicker(i, placeholder, otherAttr, itemKey, type),
          
          ele == "TreeSelect" && this.factoryTreeSelect(i, placeholder, otherAttr, itemKey, type )
        ]
      );
    });

    return h(
      ElRow,
      {
        // gutter: this.attrs?.gutter || 40,
        // style:'padding:20px',
      },
      () => [
        forms,
        this.defaultBtn(),
        this.$slots?.otherButton
          ? this.$slots.otherButton()
          // h(
          //     "div",
          //     {
          //       style: {
          //         'display':'inline-block',
          //         // 'margin-top':'14px',
          //         // 'justify-content': 'flex-start',
          //         // 'align-items': 'center',
          //       },
          //     },
              
          //   )
          : null,
      ]
    );
  },
};
// 工具方法
</script>
<style>
.xui-cpt-search {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: "#666";
}
.xui-cpt-search label{
  color:#141B27;
  font-family: Source Han Sans SC-Regular, Source Han Sans SC;
}
.xui-cpt-search .el-input__wrapper {
  height: 36px !important;
  border-radius: 3px;
}
.xui-table-cpt .el-button--primary{
  background-color: #528FFF;
}
</style>

