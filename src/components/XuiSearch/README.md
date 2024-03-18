

```js
  <tui-search
      :condition="conditions"
      :data="tableSearch"
      @query="query"
      @reset="reset" />


const CONDITIONS = { // 列表查询参数
  drugTemp: '0',
  drugTime: '',
}
this.conditions = JSON.parse(JSON.stringify(CONDITIONS))


// 方案一：select 获取字典项 配置中传 code,codeVal

// 方案二：如果需要自己写选项 直接写在配置 options:[ {label:'', value:''} ] 

// 方案三：如果使用function方式 自定义选项 直接在setup中调用

 tableSearch: [ // 查询参数初始化
    {
        type: 'select',
        key: 'drugTemp',
        label: '类型',
        placeholder: '全部',
        options: [
            {
                label: '全部',
                value: '0',
            },
            {
                label: '有异常',
                value: '1',
            },
            {
                label: '无异常',
                value: '2',
            },
        ],
    },
    {
        type: 'daterange',
        key: 'drugTime',
        label: '时间',
        placeholder: '选择时间范围',
    },
]

query() {
    // console.log('查询', this.conditions)
},

reset() {
    this.conditions = JSON.parse(JSON.stringify(CONDITIONS))
    //。。。
},

```