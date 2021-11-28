<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">理发预约系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="userName">
                    <el-input v-model="param.userName" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="userPassword">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="param.userPassword"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <div class="login-btn">
                    <el-button type="primary" @click="regist()">注册</el-button>
                </div>
                <p class="code-login"  @click="dialogVisible = true">验证码登录</p>
                <p class="find-pass" @click="showFindPassword()">邮箱找回</p>
            </el-form>
        </div>
        <el-dialog
        title="验证码登录"
        :visible.sync="dialogVisible"
        width="30%"
        >
        
            <el-form   :model="captcha" label-width="80px" :rules="rules">
                  <el-form-item label="手机号" prop="phone">
                    <el-col :span="20">
                      <el-input v-model="captcha.phone"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="验证码" prop="code">
                    <el-col :span="12">
                      <el-input v-model="captcha.code"></el-input>
                    </el-col>
                   
                    <el-button type="primary" style="margin-left: 40px;" @click="getCaptcha">发 送</el-button>
                    
                  </el-form-item>
                  
                  <el-form-item>
                        <el-button type="primary" @click="codeLogin" style="width: 240px;">登 录</el-button>
                  </el-form-item>
                 
            </el-form>
           
            <!-- <el-button @click="closeDialog()">取 消</el-button>
            <el-button type="primary" @click="codeLogin">确 定</el-button> -->
          
        </el-dialog>

        <el-dialog
        title="邮箱找回"
        :visible.sync="emailVisible"
        width="30%"
        >
        
            <el-form   :model="findPass" label-width="80px" :rules="rules">
                  <el-form-item label="用户名" >
                    <el-col :span="20">
                      <el-input v-model="findPass.name"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="邮箱" >
                    <el-col :span="20">
                      <el-input v-model="findPass.email"></el-input>
                    </el-col>
                
                  </el-form-item>
                  
                  <el-form-item>
                        <el-button type="primary"  style="width: 240px;" @click="findPassword">找回密码</el-button>
                  </el-form-item>
                 
            </el-form>
           
        </el-dialog>


    </div>

    
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default {
    data: function() {
        return {
            param: {
                userName: '',
                userPassword: '',
            },
            rules: {
                userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                userPassword: [{ required : true, message: '请输入密码', trigger: 'blur' }],
                phone : [{  required: true, message: '请输入手机号码'},// 'blur'是鼠标失去焦点的时候会触发验证
                        { min: 11, max: 11, message: '长度为11位' }],
            },
            emailVisible:false,
            dialogVisible: false,
            captcha: {
                phone:"",
                code:"",
            }, 
            findPass:{
                name:"",
                email:""
            }
      }
      
        
    },
    methods: {
        submitForm() {
            const _this = this;
            this.$refs.login.validate(valid => {
                if (valid) {
                    let data = {
                        "client_id":"c1",
                        "grant_type":"password",
                        "client_secret":"secret",
                        "username":_this.param.userName,
                        "password":_this.param.userPassword,

                    }
                    const options = {
                        method: 'POST',
                        headers: { 'content-type': 'application/x-www-form-urlencoded' },
                        data: qs.stringify(data),   // 用 qs 将js对象转换为字符串 'name=edward&age=25'
                        url: 'http://127.0.0.1:8084/oauth/token'
                    };

                    axios(options).then(function (response) {
                        console.log(response)
                        if(response.data.access_token === undefined ) {
                            _this.$message.error("用户名或密码错误");
                        } else {
                          _this.$store.commit("changeLogin", response.data.access_token);
                          axios.defaults.headers['Authorization'] = 'Bearer ' + response.data.access_token;
                          axios.post('/hair/user/login',
                              {
                                "userName":_this.param.userName,
                                "userPassword":_this.param.userPassword,
                              }).then(function (response) {
                            if(response.data.code == 500) {
                              _this.$message.error("用户名或密码错误");
                            } else {
                              _this.$message.success('登录成功');
                              console.log(response.data.extend.user);
                              sessionStorage.setItem('loginName', response.data.extend.user.userName);
                              sessionStorage.setItem('loginRole', response.data.extend.user.roleId);
                              sessionStorage.setItem('userId', response.data.extend.user.userId);
                              _this.$router.push('/');
                            }
                          })
                        }
                    });



                    // axios.post('http://127.0.0.1:8084/oauth/token',
                    // {
                    //     "client_id":"c1",
                    //     "grant_type":"password",
                    //     "client_secret":"secret",
                    //     "username":_this.param.userName,
                    //     "password":_this.param.userPassword,
                    //
                    // }).then(function (response) {
                    //    console.log(response)


                   /// })
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        regist() {
                this.$router.push('/regist');
            },
            handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        getCaptcha() {
          
           if(this.checkPhone() == true){
               console.log(this.captcha.phone)
                const _this = this;
                var param = new FormData();
                param.append("phone",_this.captcha.phone);

                axios.post('/hair/captcha/getCaptcha', param)
                .then(function (response) {
                console.log(response.data);
                if(response.data.code == 500) {
                _this.$message.error('该手机号未注册');
                } else {
                    _this.$message.success('验证码已发送');
                  }
                })
                .catch(function (error) {
                    console.log(error);
                });
        
            }
        },   
        codeLogin(){
            const _this = this;
            const moment = require('moment')
            var myDate = new Date();
            const date = moment(myDate).format('YYYY-MM-DD HH:mm:ss');
            axios.post('/hair/captcha/codeLogin',
            {
                "phone":_this.captcha.phone,
                "code":_this.captcha.code,
                "date":date
            }).then(function (response) {
                console.log(response.data);
                if(response.data.code == 500) {
                    _this.$message.error(response.data.extend.msg);
                } else {
                  console.log(response.data)
                    _this.$message.success('登录成功');
                    sessionStorage.setItem('loginName', response.data.extend.user.userName);
                    sessionStorage.setItem('loginRole', response.data.extend.user.roleId);
                   // sessionStorage.setItem('userId', response.data.extend.user.id);
                    sessionStorage.setItem('userId', response.data.extend.user.userId);
                  _this.$store.commit("changeLogin", response.data.extend.token);


                  _this.$router.push('/');
                }
            })
        },
        closeDialog() {
           
            this.captcha.phone = "";
            this.captcha.code = "";
            this.dialogVisible = false;
        },
        checkPhone() {
            var strTemp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
            if (strTemp.test(this.captcha.phone)) {
            
                return true;
            }
            return false;
        },
        showFindPassword() {
           
            this.emailVisible = true;
        },
        findPassword() {
            const _this =this;
            axios.post('/hair/user/find/pass',
            {
                "userName":_this.findPass.name,
               
                "email":_this.findPass.email
            }).then(function (response) {
                if(response.data.code == 500) {
                    _this.$message.error(response.data.extend.msg);
                } else {
                    _this.$message.success(response.data.extend.msg);
                }
            });
        }
    },
    
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/welcome.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: black;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.code-login {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
    float: left;
}
.find-pass {
    margin-left: 176px;
    font-size: 12px;
    line-height: 30px;
    color: #fff;
    float: left;
}
</style>