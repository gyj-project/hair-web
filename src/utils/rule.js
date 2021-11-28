// 手机号验证
var phone = (rule, value, callback) => {
  let regFormat = /^[1][3578][0-9]{9}$/; //正确手机号
  if (!value) {
    return callback(new Error('不能为空'));
  }
    if (!(regFormat.test(value))) {
      callback(new Error('请输入正确手机号'));
    } else {
      if (value < 18) {
        callback(new Error('必须大于18岁'));
      }else {
        callback();
      }
    }
};
//数字验证
var number = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('不能为空'));
  }
    if (!Number.isInteger(value)) {
      callback(new Error('请输入数字值'));
    } else {
      if (value < 18) {
        callback(new Error('必须大于18岁'));
      }else if(value >55){
        callback(new Error('必须小于55岁'));
      } else {
        callback();
      }
    }
};
//text不能为空
var text = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('不能为空'));
  }else{
    callback();
  }
};
//desc不能为空
var desc = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('不能为空'));
  }else{
    callback();
  }
};
//邮箱
var emailV = (rule, value, callback) => {
  let mal = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!value) {
    return callback(new Error('不能为空'));
  }
  if(!(mal.test(value))) {
    callback(new Error('请输入正确邮箱'));
  }else{
    callback();
  }
};
//开始时间
var startTime = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请选择开始日期'));
  }else{
    callback();
  }
};
//开始时间
var endTime = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请选择结束日期'));
  }else{
    callback();
  }
};
//时间
var time = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请选择日期'));
  }else{
    callback();
  }
};
//多选框
var checkbox = (rule, value, callback) => {
  if (value.length<1) {
    return callback(new Error('请选择一个'));
  }else{
    callback();
  }
};
//单选框
var radio = (rule, value, callback) => {
  if (value.length<1) {
    return callback(new Error('请选择一个'));
  }else{
    callback();
  }
};
//下拉框
var select = (rule, value, callback) => {
  if (value.length<1) {
    return callback(new Error('请选择一个'));
  }else{
    callback();
  }
};
//QQ号码验证
var QQV = (rule, value, callback) => {
  debugger
  if (value === '') {
    callback(new Error('输入QQ号'))
  } else if (/^[1-9][0-9]{4,10}$/.test(value)) {
    callback()
  } else {
    callback(new Error('输入正确的QQ号'))
  }
}
 
// 类似金钱,首位不为0,最多2位小数
export function checkNumPot2(rule, value, callback) {
  const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  if (!value) {
    return callback(new Error('请填写数字'))
  } else if (!reg.test(value)) {
    return callback(new Error('请填写数字,最多2位小数'))
  } else {
    callback()
  }
}
 
// 身份证
export function checkIdNum(rule, value, callback) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!value) {
    return callback(new Error('证件号码不能为空'))
  } else if (!reg.test(value)) {
    return callback(new Error('证件号码不正确'))
  } else {
    callback()
  }
}
 
// 整数
export function checkInterNum(rule, value, callback) {
  const reg = /^[0-9]*[1-9][0-9]*$/
  if (!value) {
    return callback(new Error('请填写整数'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入整数'))
  } else {
    callback()
  }
}
 
export default {
  QQ: [{ required: true, validator: QQV, trigger: 'blur' }],
  phone: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码', trigger: 'blur' }],
  numPot2: [{ required: true, validator: checkNumPot2, trigger: 'blur' }],
  InterNum: [{ required: true, validator: checkInterNum, trigger: 'blur' }],
  name:[{ required: true, message:'用户名不能为空', trigger: 'blur' }],
  password:[{ required: true, message:'密码不能为空', trigger: 'blur' }],
  email: [{ required: true, validator: emailV, trigger: 'blur' }],
  text: [{ required: true, validator: text, trigger: 'blur' }],

}