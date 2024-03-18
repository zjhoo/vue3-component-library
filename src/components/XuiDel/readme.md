<!--
 * @Author: zjhoo
 * @Date: 2023-09-10 15:19:48
 * @LastEditors: zjhoo
 * @LastEditTime: 2023-09-10 15:21:37
 * @Description: 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
> 使用方法

```js
import XuiDel from '@/components/XuiDel'

//简单使用
h(XuiDel,{
    delRequest:()=>{},
    data:{},
    onSuccess: ()=>{ console.log(params) }
})

//进一步使用
h(XuiDel,{
    delRequest:()=>{},
    data:{},
    onSuccess: ()=>{ console.log(params) }
},
{  default:()=>`${params.col1} 删除` }
)
```