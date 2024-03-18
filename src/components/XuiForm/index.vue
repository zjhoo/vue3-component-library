<script>
import { h, ref, toRef, toRefs, reactive, watch, setBlockTracking } from "vue";
import {
  ElRow,
  ElCol,
  ElButton,
  ElInput,
  ElSelect,
  ElSelectV2,
  ElOption,
  ElDatePicker,
  ElTreeSelect,
  ElCascader,
  ElCheckboxGroup,
  ElCheckbox,
  ElRadioGroup,
  ElRadio,
  ElForm,
  ElFormItem,
  ElTooltip,
ElScrollbar,
} from "element-plus";
import { getSelectOption, getTreeXzqh, getTreePlan } from "./cell/api";
import useStore from './cell/store';
import InputTable from "./cell/inputTable.vue";
import SelectsTabla from "./cell/selectsTable.vue";
import SelectTabla from "./cell/selectTable.vue";
import MapPostion from "./cell/mapPostion.vue";
import file_ico from "./cell/file_ico.jpg"

export default {
  props: {
    jsons: Array,
    status: String,
    data:Object,
    // modelValue: Object,
  },
  emits: ["update:vals", "click:submit", "click:reset"],

  setup(props, { emit, attrs, slots }) {
    const jsonsRef = toRef(props, "jsons");
    const optionsRef = ref([]);
    const { status, data } = toRefs(props)
    // console.log('xui-form-----', data, status,slots);
    // watch(
    //   () => [status.value, data.value], // 要监听的响应式表格数据
    //   ([statusNew,dataNew], older) => {
    //     console.log(4444444444, statusNew);
    //     if(statusNew=='add'){
    //       for (let key in dataNew) {
    //         if (dataNew.hasOwnProperty(key)) {
    //           formData[key] = dataNew[key] || ''
    //         }
    //       }
    //     }
    //   }
    // );
    
    // console.log(222222, emit, props, modelValue );
    const iStore = useStore()

    const formRules = reactive({ //form绑定总的rules
        // name: []
    })
    const formData = reactive({})
    const formRef = ref(null)

    const arrTypes = ['SelectsTable','MapPosition','CheckboxGrop','Select','UploadFiles']

    //form item init default value
    // jsonsRef.value?.map((el, i) => {
    //   // console.log(el.ele,'----',el.default);
    //   formData[el.key] = el?.default ? el?.default : arrTypes.includes(el.ele) ? [] : ''
    // })
    
   
    // console.log(33333333333333333,formData, data);

    
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

    const upImgs = reactive({})
    const resetFormData = () => {
      props.jsons?.map((item,i) => {
        if (item.key) {
          formData[item.key] =item?.defaultVal || arrTypes.includes(item.ele) ? [] : '';
        }
      });
      emit("update:vals", formData);
    };

    // input
    const factoryInput = (i, placeholder, otherAttr, keyer,type) => {
      // console.log(3333333333333333, keyer,otherAttr);
      return h(ElInput, {
        key: `w-input-${i}`,
        placeholder: placeholder || "请输入",
        ...otherAttr,
        type,
        // style: { flex: 1 },
        modelValue: formData[keyer] || "",
        onInput: (val) => {
          formData[keyer] = val;
          emit("update:vals", formData);
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
          modelValue: formData[keyer] || "",
          "collapse-tags": true,
          "collapse-tags-tooltip": true,
          onChange: (val) => {
            formData[keyer] = val;
            // console.log(formData);
            emit("update:vals", formData);
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
        // value: formData[keyer],
        modelValue: formData[keyer],
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
          formData[keyer] = val;
          emit("update:vals", formData);
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
        // value: formData[keyer],
        modelValue: formData[keyer],
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
          formData[keyer] = val;
          emit("update:vals", formData);
        },
      });
    }

    //Cascader 
    const factoryCascader = (i, placeholder, otherAttr, keyer, type) =>{
      otherAttr.options = optionsRef.value[i] || [];
      return h(ElCascader, {
        key: `w-cascader-select-${i}`,
        placeholder: placeholder || "请选择",
        type,
        ...otherAttr,
        style: { flex: 1 },
        // value: formData[keyer],
        modelValue: formData[keyer],
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
          formData[keyer] = val;
          emit("update:vals", formData);
        },
      });
    }

    //CheckboxGrop
    const factoryCheckboxGroup = (i, placeholder, otherAttr, keyer) => {
      otherAttr.options = optionsRef.value[i] || [];

      return h(
        ElCheckboxGroup,
        {
          key: `w-checkbox-group-${i}`,
          placeholder: placeholder || "请选择",
          ...otherAttr,
          modelValue: formData[keyer] || [],
          onChange: (val) => {
            formData[keyer] = val;
            console.log(formData);
            emit("update:vals", formData);
          },
        },
        () => otherAttr.options?.map((opt, oi) => {
          return h(ElCheckbox, { key: `${keyer}-opt-checkbox-${oi}`, ...opt });
        })
      );
    };

    //RadioGrop
    const factoryRadioGroup = (i, placeholder, otherAttr, keyer) => {
      otherAttr.options = optionsRef.value[i] || [];

      return h(
        ElRadioGroup,
        {
          key: `w-checkbox-group-${i}`,
          // placeholder: placeholder || "请选择",
          ...otherAttr,
          modelValue: formData[keyer] || "",
          onChange: (val) => {
            formData[keyer] = val;
            console.log(formData);
            emit("update:vals", formData);
          },
        },
        () => otherAttr.options?.map((opt, oi) => {
          return h(ElRadio, { key: `${keyer}-opt-checkbox-${oi}`, ...opt });
        })
      );
    };

    //InputTable
    const factoryInputTable = (i, placeholder, otherAttr, keyer,type) => {
      console.log('input-table:', keyer,otherAttr);
      const  { columns=[]} = otherAttr 
     
      return h(InputTable,{
        key: `w-input-table-${i}`,
        placeholder: placeholder || "请选择",
        otherAttr,
        columns,
        type,
        keyer,
        style: { width:'100%' },
        'onChange':(val)=>{
          console.log('input table change:',val);
          formData[keyer] = val
          emit("update:vals", formData);
        }
      })
    };
    // select table multiple
    const factorySelectsTable = (i, placeholder, otherAttr, keyer,type) => {
      console.log('selects-table:', keyer, formData[keyer], otherAttr);
      const  { columns=[],maxCollapseTags=1} = otherAttr 
      
      const filterRows = (arr) =>{
        return arr?.map(item=>item.id)
      }
      // const selectedRows
      const selectedRows =  ref(filterRows(formData[keyer]) || [])
      const wSelectstable=ref()

      return h(
        ElSelect,
        { 
          key: `w-selects-table-${i}`,
          placeholder: placeholder || "请选择",
          style:{'width':'100%'},
          class: 'w-selects-table-box',
          multiple:true,
          modelValue: selectedRows.value, //formData[keyer],
          "collapse-tags":true,
          'collapse-tags-tooltip':true,
          'max-collapse-tags':maxCollapseTags,
          ref:wSelectstable,
          onRemoveTag: (row)=>{
            // console.log(row, selectedRows.value);
            selectedRows.value = selectedRows.value.filter(item=>item!=row)
            formData[keyer] = formData[keyer].filter(item=>item.id!=row)
          },
          focus:()=>{ disableSelect.value=true  }
        },
        {
          default:()=>h(SelectsTabla,{
            ref:'SelectsTabla',
            otherAttr,
            columns,
            selectedRows: selectedRows.value, //formData[keyer],
            keyer,
            'onChange':(val, valSel, allOptions)=>{
              console.log('selects table change:',val, valSel);
              formData[keyer] =  val
              selectedRows.value = valSel
              emit("update:vals", formData);
              wSelectstable.value.visible = false
            },
            'onCancel':()=>{
              wSelectstable.value.visible = false
            }
          })
        }
      )
    };
    // select table radio
    const factorySelectTable = (i, placeholder, otherAttr, keyer,type) => {
      // console.log('selects-table:', keyer,otherAttr);
      const  { columns=[]} = otherAttr 
      const wSelectTable=ref()
      const filterRows = (arr) =>{
        return arr?.map(item=>item.id)
      }
      const formField = otherAttr['formField']
      const disabled = otherAttr['disabled']
      const selectedRow = ref(formData[keyer]||{})
      // const selectedRow =  ref(filterRows(formData[keyer]) || [])
      return  h(
        ElSelect,
        {
          key: `w-selects-table-${i}`,
          style:{'width':'100%'},
          placeholder: placeholder || "请选择",
          disabled:disabled,
          // ...otherAttr,
          // onVisibleChange:(trigger)=>{ this.showTable=trigger },
          multiple:false,
          modelValue: selectedRow.value?.id, //formData[keyer], //formData[keyer],
          ref:wSelectTable,
        },
        {
          default:()=>h(SelectTabla,{ 
            otherAttr,
            columns,
            keyer,
            'onChange':(obj)=>{
              console.log('select table change:',obj);
              formData[keyer] = formField?obj[formField]:obj
              selectedRow.value = obj
              console.log(1111111111111111111111, selectedRow.value, formData[keyer]);
              emit("update:vals", formData);
              wSelectTable.value && (wSelectTable.value.visible = false)
            },
            'onCancel':()=>{
              console.log(33333);
              wSelectTable.value.visible = false
            }
          })
        }
      )
     
      // return h(SelectTabla,{
      //   columns,
      //   type,
      //   keyer,
      //   style: { width:'100%' },
      // })
        
    };
    // get map position or lat lon
    const factoryMapPosition = (i, placeholder, otherAttr, keyer) => {
      console.log('map-postion:',placeholder,formData[keyer], keyer,otherAttr);
      const  { columns=[]} = otherAttr 

      const inputLng = ref(formData[keyer][0] || '')
      const inputLat = ref(formData[keyer][1] ||'')

      return h('div',{
        // class:'xui-form-item-map-position',
        style: {
          width: '100%',
          display: 'flex'
        }
      },[
          h(ElInput,{
            placeholder:'请选择-经度',
            modelValue: inputLng.value,
            onInput:(val)=>{
              inputLng.value = val
              formData[keyer][0] = val
              emit("update:vals", formData);
            }
          }),
          h('span',{
            style:{
              display:'inline-block',
              paddingLeft:'4px',
              paddingRight:'4px',
              color:'#999'
            }
          },'-'),
          h(ElInput,{
            placeholder:'纬度',
            modelValue: inputLat.value,
            onInput:(val)=>{
              inputLng.value = val
              formData[keyer][1] = val
              emit("update:vals", formData);
            }
          }),
          h(MapPostion,{
            default:otherAttr.default,
            valueArr:formData[keyer],
            // default:formData[keyer],
            showLngLat: otherAttr?.showLngLat || false,
            'onChange':(arr)=>{
              console.log('map position change:',arr);
              formData[keyer] = arr
              emit("update:vals", formData);
            }
          })

        ]
      )
    }
    const factoryMapPositionTl = (i, placeholder, otherAttr, keyer) => {
      //console.log('map-postion:',placeholder,formData[keyer], keyer,otherAttr);
      const  { columns=[]} = otherAttr 

      const inputLng = ref(formData[keyer][0] || '')
      const inputLat = ref(formData[keyer][1] ||'')

      return h('div',{
        // class:'xui-form-item-map-position',
        style: {
          width: '100%',
          display: 'flex'
        }
      },[
          h(ElInput,{
            placeholder,
            modelValue: formData[keyer][2],
            onInput:(val)=>{
              inputLng.value = val
              formData[keyer][0] = val
              emit("update:vals", formData);
            }
          }),
          h(MapPostion,{
            default:otherAttr.default,
            valueArr:formData[keyer],
            // default:formData[keyer],
            showLngLat: otherAttr?.showLngLat || false,
            'onChange':(arr)=>{
              //console.log('map position change:',arr);
              formData[keyer] = arr
              emit("update:vals", formData);
            }
          })

        ]
      )
    }

    const factoryUpLoad = (i, placeholder, otherAttr, keyer,type)=>{
      // console.log('factoryUpLoad=====================', otherAttr);
      const { multiple=false, accept, disabled} = otherAttr
      const xuiFileInput = ref(null)
      return h(
        'div',
        { style: {display:'flex',"flex-wrap":'wrap'} },
        [
          h('input', {
            ref: xuiFileInput,
            type: 'file',
            // accept: accept,
            multiple: false,//!!multiple,
            style: {
              display: 'none',
            },
            onChange: (event) => {
              const files = event.target.files
              // console.log(222222223,event,files);
              for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                // console.log(333333333,file);
                reader.onload = (ev) => {
                  // console.log(44444444, ev.target.result);
                  const obj = {
                    name:file.name,
                    file:file,
                    dataURL:ev.target.result
                  }
                  multiple ? upImgs[keyer]?.push(obj) : upImgs[keyer]=[obj]
                  // upImgs[keyer]?.filter((obj, index, self) =>
                  //   self.findIndex((o) => o.name === obj.name) === index
                  // )
                  // console.log(444444555,upImgs[keyer]);
                  formData[keyer] = upImgs[keyer]
                  emit("update:vals", formData);
                }
                reader.readAsDataURL(file);
              }
            },
          }),
          upImgs[keyer]?.map((item,i)=>{
            return  h(ElTooltip,{
                content:item.name
              },{
                default: ()=> h('div',{
                  class:'upload-img-box'
                },[
                  h('img',{
                    src: item.dataURL.startsWith('data:image') ? item.dataURL : file_ico,
                    alt:item.name||"文件",
                    style:{
                      width:'80px',
                      height:'80px',
                      padding:'4px',
                    }
                  }),
                  !disabled && h('span',{
                    onClick:()=>{
                      upImgs[keyer].splice(i, 1)
                      formData[keyer] = upImgs[keyer]
                      emit("update:vals", formData);
                    }
                  },"+")
                ]) 
              })
              // h('div',{ style:{color:'#a9a7a7','font-size':'small'} }, item.name),
          }),
          h('div',{
              class:'upload-add-box',
              onClick:()=>{
                if(disabled) return
                // console.log(2222,xuiFileInput.value,accept);
                xuiFileInput.value ? xuiFileInput.value.click() : console.log('没有获取的input upload的ref');
              },
          },[
            h('span',disabled ?'': '+'),
            !disabled && h('span',{},placeholder),
            (disabled && upImgs[keyer]?.length<1) && h('span',{},'暂无文件')
          ]),
        ]
      );
    }


    const getFormItem = (el, i)=> {
      // console.log('--------------el:', el);
      const {
        ele,
        key,
        label,
        // labelW = null, // label-width
        span = 24,
        required,
        placeholder,
        propVal=[],//验证规则 prop
        slot=null,
        controls_disabled = { },
        controls_show = { },
        type,
        // options = [],
        ...otherAttr
        // label:`${otherAttr.label} : `,
      } = el;

      const itemKey = key;
      // {{ formData }}
      const myControlsDisabled = {add: false, edit: false, view: true, ...controls_disabled}
      const myControlsShow = { add: true, edit: true, view: true, ...controls_show }
      
      const curDisabled = myControlsDisabled[status.value]
      otherAttr['disabled']=curDisabled
      const curShow = myControlsShow[status.value]
      otherAttr['prop']=key
      // console.log('form item attrs disabled------:',key, otherAttr, curDisabled, myControlsDisabled, status.value);
      // console.log('form item attrs show------:',key, otherAttr, curShow, myControlsShow, status.value);
      // console.log('form item slot--------',key, slot, slots[key]);

      

      return curShow ? h(
        ElCol,
        {
          span
        },
        ()=>h(
          ElFormItem,
          {
            label:`${label} :`,
            ...otherAttr
          },
          {
            default: ()=>(['add','edit'].includes(status.value)  && ele && !slot) 
              ? (()=>{
                  // console.log('遍历表单项：', ele,el)
                  // let formItem =null
                  switch (ele) {
                    case "Input":
                      return factoryInput(i, placeholder, otherAttr, itemKey, type)
                      break;
                    case "Select":
                      return factorySelect(i, placeholder, otherAttr, itemKey)
                      break;
                    case "DatePicker":
                      return factoryDatePicker(i, placeholder, otherAttr, itemKey, type)
                      break;
                    case "TreeSelect":
                      return factoryTreeSelect(i, placeholder, otherAttr, itemKey, type )
                      break;
                    case "Cascader":
                      return factoryCascader(i, placeholder, otherAttr, itemKey, type )
                      break;
                    case "CheckboxGrop":
                      return factoryCheckboxGroup(i, placeholder, otherAttr, itemKey )
                      break;
                    case "RadioGrop":
                      return factoryRadioGroup(i, placeholder, otherAttr, itemKey )
                      break;
                    case "InputTable":
                      return factoryInputTable(i, placeholder, otherAttr, itemKey )
                      break;
                    case "SelectsTable":
                      return factorySelectsTable(i, placeholder, otherAttr, itemKey)
                      break;
                    case "SelectTable":
                      return factorySelectTable(i, placeholder, otherAttr, itemKey)
                      break;
                    case "MapPosition":
                      return factoryMapPosition(i, placeholder, otherAttr, itemKey)
                      break;
                    case "MapPositionTl":
                      return factoryMapPositionTl(i, placeholder, otherAttr, itemKey)
                      break;
                    case "UploadFiles":
                      return factoryUpLoad(i, placeholder, otherAttr, itemKey, type )
                      break;
                      
                    default:
                      console.warn(`未知表单项类型${el}`);
                      break;
                  }
                })()
              : (slot && slots[key]) ? slots[key]() : h('div',{
                  class: 'form-item-view'
                }, formatView(ele, formData[key], i, placeholder, otherAttr, itemKey, type) )
          }
          )
      ) : null
    }

    props.jsons?.map((el, i) => {
      // console.log(el.ele,'----',el.default);
      formData[el.key] = el?.default ? el?.default : arrTypes.includes(el.ele) ? [] : ''
      if(el.ele ==='UploadFiles'){
        upImgs[el.key] = formData[el.key] || []
      }
    })
    
    

    const formatView = (ele, itemVal, i, placeholder, otherAttr, itemKey, type) => {
      switch (ele) {
        case 'Input':
          return itemVal
          break;
        case 'Select':
          const { options=[] } = otherAttr
          const curObj = options.filter(item=>item.value===itemVal)
          // console.log(33333333333333, ele, itemVal, curObj, options);
          return curObj.length>0 ? curObj[0]['label'] : ''
          break;
        case "Cascader":
          otherAttr['disabled']=true
          return factoryCascader(i, '无', otherAttr, itemKey, type )
          break;
        case "TreeSelect":
          otherAttr['disabled']=true
          return factoryTreeSelect(i, '无', otherAttr, itemKey, type )
          break;
        case "SelectsTable":
          otherAttr['disabled']=true
          return factorySelectsTable(i, '无', otherAttr, itemKey)
          break;
        case "SelectTable":
          otherAttr['disabled']=true
          return factorySelectTable(i, '无', otherAttr, itemKey)
          break;
        default:
          return Array.isArray(itemVal)? itemVal.join(', '): itemVal
          break;
      }
    }



    const defaultBtn = (formEl) => {
      const sureTxt = { add: "确定", edit:"确定", view:"关闭" }
      return h(
        'div',
        {
          span: 6,
          style: {
            display: "flex",
            padding:"20px 0 10px 0",
            "justify-content": "flex-end",
          },
          class:"footer-box"
        },
        [
        status.value!='view' && h(
            ElButton,
            {
              type: "primary",
              // icon: status.value=='view'?'':"Search",
              plain: false,
              // round:true,
              onClick:()=> submitForm(),
              style: { "margin-left": "20px" },
            },
            () => status.value && sureTxt[status.value] ? sureTxt[status.value] : '确定' //status.value
          ),
          status.value=='edit' && h(
            ElButton,
            {
              // icon: "RefreshLeft",
              // type: "primary",
              plain: true,
              onClick:()=> resetForm(),
            },
            () => "取消"
          ),
          status.value=='add' && h(
            ElButton,
            {
              // icon: "RefreshLeft",
              // type: "primary",
              plain: true,
              onClick:()=> resetForm(),
            },
            () => "取消"
          ),
        ]
      );
    };

    const submitForm = () => {
      console.log('提交的数据；',formData);
      if (!formRef.value) return
      formRef.value.validate((valid) => {
          if (valid) {
          console.log('submit!')
          emit("click:submit", {...data.value, ...formData});
          } else {
          console.log('form validate failed!')
          return false
          }
      })
    }

    const resetForm = () => {
        if (!formRef.value) return
        // formRef.value?.clearValidate()
        formRef.value?.resetFields()
        resetFormData()
        emit("click:reset", formData);
    }

    return {
      attrs,
      jsonsRef,
      optionsRef,
      data,
      // modelValue,
      factoryInput,
      factorySelect,
      factoryDatePicker,
      factoryTreeSelect,
      factoryCascader,
      factoryCheckboxGroup,
      factoryRadioGroup,
      factoryInputTable,
      factorySelectsTable,
      factorySelectTable,
      factoryMapPosition,
      factoryUpLoad,
      defaultBtn,
      status,
      formRules,
      formRef,
      formData,
      iStore,
      resetForm,
      initTree,

      props,
      arrTypes,

      getFormItem,
    };
  },
  render() {
    // console.log('----------------', this.jsonsRef[2]['options']);

    

     // init Select Options
     this.props.jsons?.map((el, i) => {
      this.optionsRef[i] = el?.options || [];
      this.formRules[el.key] = el?.propVal || []
      if(this.data[el.key]){ this.formData[el.key]=this.data[el.key] }
      if (el?.ele == "Select") {
        if (el?.code) {
          // /system/api/common/getDictData?dicCode=key_point
          // console.log(3334444, el.options);
          if(!el?.options || el.options?.length<1){
            const { codeVal='id' } = el
            const storeKey = `select__${el.code}__${codeVal}`
            if(this.iStore.getOptions(storeKey)){
              this.optionsRef[i] = this.iStore.getOptions(storeKey)
            }else{
              getSelectOption(el.code).then(res=>{
                const { data=[] } = res
                this.optionsRef[i] = data?.map(item=>{
                  return {
                    value: item[codeVal],
                    label: item.dataName,
                    ...item,
                  };
                });
                this.iStore.setOptions(storeKey, this.optionsRef[i])
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
              if(this.iStore.getOptions(storeKey)){
                this.optionsRef[i] = this.iStore.getOptions(storeKey)
              }else{
                getTreeXzqh()
                  .then(res => {
                    const { data=[] } = res
                    this.optionsRef[i] = this.initTree(data, { id: "xzqhCode",label:"xzqhName", pid: "parentCode" },codeVal)
                    // console.log(123123, this.optionsRef[i]);
                    this.iStore.setOptions(storeKey, this.optionsRef[i])
                  })
                }
                break;
              case 'plan':
                if(this.iStore.getOptions(storeKey)){
                  this.optionsRef[i] = this.iStore.getOptions(storeKey)
                }else{
                  getTreePlan({tag:1})
                    .then(res => {
                      const { data=[] } = res
                      this.optionsRef[i] = this.initTree(data, { id: "id",label:"typeName", pid: "parentId" }, codeVal)
                      // console.log('------------======', this.optionsRef[i]);
                      this.iStore.setOptions(storeKey, this.optionsRef[i])
                    })
                }
                break;
              default:
                break;
            }
          }
        }
      }
      if(el?.ele=='Cascader'){
        if(el?.code) {
          if(!el?.options || el.options?.length<1){
            const { codeVal='id' } = el
            const storeKey = `cascader__${el.code}__${codeVal}`
            switch (el.code) {
              case 'xzqh':
              if(this.iStore.getOptions(storeKey)){
                this.optionsRef[i] = this.iStore.getOptions(storeKey)
              }else{
                getTreeXzqh()
                  .then(res => {
                    const { data=[] } = res
                    this.optionsRef[i] = this.initTree(data, { id: "xzqhCode",label:"xzqhName", pid: "parentCode" },codeVal)
                    // console.log(123123, this.optionsRef[i]);
                    this.iStore.setOptions(storeKey, this.optionsRef[i])
                  })
                }
                break;
              case 'plan':
                if(this.iStore.getOptions(storeKey)){
                  this.optionsRef[i] = this.iStore.getOptions(storeKey)
                }else{
                  getTreePlan({tag:1})
                    .then(res => {
                      const { data=[] } = res
                      this.optionsRef[i] = this.initTree(data, { id: "id",label:"typeName", pid: "parentId" }, codeVal)
                      // console.log('------------======', this.optionsRef[i]);
                      this.iStore.setOptions(storeKey, this.optionsRef[i])
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
 
    
    const { ...otherFormAttr } = this.attrs

    return h(
      ElForm,
      {
        rules:this.status!='view' ? this.formRules : [],
        model:this.formData,
        ref: 'formRef',
        'label-position':'right',
        ...otherFormAttr,
        class: "xui-cpt-form"
      },
      () => [
        h(ElScrollbar,{
            'max-height':otherFormAttr['max-height'] || '60vh',
            style:{
              'padding-right':'10px',
              'border-bottom': '1px solid #eee',
              'padding-bottom': '10px',
              // 'box-shadow': 'inset 0 -10px 10px -10px rgba(0, 0, 0, 0.5)',
            }
          },
          ()=>h(ElRow,{}, {
            default: ()=> this.props.jsons?.map((el, i) =>{
              return this.getFormItem(el,i)
            }).filter(el=>el!=null)
          }),
        ),
        this.$slots?.default && this.$slots.default(),
        this.$slots?.footer ? this.$slots.footer() : this.defaultBtn(this.formRef),
        this.$slots?.otherButton
          ? h(
              "span",
              {
                style: {
                  // 'display':'flex',
                  // 'margin-top':'14px',
                  // 'justify-content': 'flex-start',
                  // 'align-items': 'center',
                },
              },
              this.$slots.otherButton()
            )
          : null,
      ]
    );
  },
};
// 工具方法
</script>
<style>
.xui-cpt-form {
  /* display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center; */
  color: "#666";
}
/* .xui-cpt-form .w-selects-table-box  */
.xui-cpt-form .footer-box .el-button{
  border-radius: 4px;
  min-width: 90px;
  /* height: 40px; */
  padding:10px;
  font-weight: 600;
  margin: auto 16px;
}
.xui-cpt-form .footer-box .el-button--primary{
  background-color: #0094FF;
}
.xui-cpt-form .el-input__wrapper {
  height: 36px !important;
}
.xui-cpt-form .el-form-item__label{
  color:#666;
  font-size: small;
}
.xui-cpt-form .form-item-view{
  width: 100%;
  min-height: 30px;
  border-bottom: 1px dashed #e6e6e6;
}
.xui-cpt-form textarea{
  padding:10px;
}

.xui-cpt-form .upload-img-box{
  position: relative;
}
.xui-cpt-form .upload-img-box span{
  display: none;
}
.xui-cpt-form .upload-img-box:hover span {
  display: inline-block;
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  border-radius: 50%;
  right: 8px;
  top:8px;
  font-size: 18px;
  color: rgba(235, 86, 0, 0.728);
  border: 1px solid rgb(232, 232, 232);
  cursor: pointer;
  transform: rotate(45deg);
}

.xui-cpt-form .upload-add-box{
  width: 80px;
  height: 80px;
  border: 1px solid rgb(232, 232, 232);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color:#cbcbcb;
}
.xui-cpt-form .upload-add-box :nth-child(1){
  font-size: 40px;
  font-weight: 300;
}

.el-dialog .el-dialog__header{
  /* border-bottom:1px dashed #d7d7d7;
  margin-bottom: 10px; */
}

/* .el-dialog__title{
  font-family: Source Han Sans CN-Medium, Source Han Sans CN;
  font-weight: 700;
  color: #0094FF;
}
.el-dialog{
  border-radius: 6px;
} */
</style>

