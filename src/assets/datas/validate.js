import { format } from "path";

//表单数据验证
const validateTry = (rule, value, callback) => {
    console.log(rule)
    console.log(value)
    if(value === '') return callback(new Error('不能为空值'))
        let numReg = /^[0-9]+.?[0-9]*$/;
    if(!numReg.test(value)){
        callback(new Error('请输入正数值'));
    }else{
        callback();
    }
}

//手机号码段规则 中国(+86)
const validatePhone = (rule, value, callback) => {
    let numReg = /^((\+?[0-9]{1,4})|(\(\+86\)))?(13[0-9]|14[5-9]|15[0-9]|16[56]|17[0-9]|18[0-9]|19[89])\d{8}$/;
    if(!numReg.test(value)){
        callback(new Error('请输入正确手机号'));
    }else{
        callback();
    }
}

//邮箱规则 
const validateEmail = (rule, value, callback) => {
    let numReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    if(!numReg.test(value)){
        callback(new Error('请输入正确邮箱地址'));
    }else{
        callback();
    }
}

//IP规则 
const validateIP = (rule, value, callback) => {
    let numReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])((\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}|(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){5})$/;
    if(!numReg.test(value)){
        callback(new Error('ip不正确'));
    }else{
        callback();
    }
}
//密码规则
const validatePassWD = (rule, value, callback) => {
    if(value===''){ callback('请输入密码') }
    let numReg = /^[a-zA-Z0-9_]{4,10}$/;
    if(!numReg.test(value)){
        callback(new Error('由4~10位的 数字/字母/_ 组成'));
    }else{
        callback();
    }
}

//账号验证规则 
const validateUserName= (rule, value, callback) => {
    let numReg = /^[a-zA-Z_]{4,10}$/
    if(!numReg.test(value)){
        callback(new Error('由4~10位的 字母,_ 组成'));
        // callback(new Error('由4~10位的 数字+字母 组成'));
    }else{
        callback();
    }
}
//用户名 验证规则
const validateAccount = (rule, value, callback) => {
    let numReg = /^[\u4e00-\u9fa5a-zA-Z0-9_]{4,10}$/// /^(?=[a-z0-9]*\d)(?=[a-z0-9]*[a-z])[0-z0-9]{4,10}$/gi;
    if(!numReg.test(value)){
        callback(new Error('由4~10位的 数字/字母/_ 组成'));
        // callback(new Error('由4~10位的 数字+字母 组成'));
    }else{
        callback();
    }
}



// //确认密码  （this指向问题 必须写到组件内 用var作区分）
// var validatePassWDConfirm = (rule, value, callback) => {
//     if (value === '') {
//         callback(new Error('请再次输入密码'));
//     } else if (value !== this.form.password) {
//         callback(new Error('两次输入密码不一致!'));
//     } else {
//         callback();
//     }
// }


export {
    validateTry,
    validateUserName,
    validatePhone,
    validateEmail,
    validateAccount,
    validateIP,
    validatePassWD,
}