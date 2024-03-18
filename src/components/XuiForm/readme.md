

```js
{
  ele:'Select',
  key: 'selectsVal',
  label: '下拉多选',
  // labelW: 
  span: 12,
  placeholder: '',
  default:'',
  controls: {
    disabled: { add: true, edit: false, view: false }, 
    show: { add: false, edit: true, view: true }
  },
  validator: [
    {type: "required"},
    {
      type: "regex",
      regex: "/(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x|Y|y|Z|z)$)/"
    }
  ]
  slot:'',
  // 个性化属性...
  code: 'headquarters_type',
  codeVal:'id', //默认id 可不写
  multiple:true,
  options: [/* 可通过code查询字典项， 也可自行用一下格式配置{value:'',label} */],

}


state: add/ edit/ view

```
## 3种状态 查看/新增/修改 / ...定义状态...

