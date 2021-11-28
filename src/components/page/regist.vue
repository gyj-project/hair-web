<template>
  
  <div class="login-wrap">
    
      <div class="ms-login">
          <div class="ms-title">用户注册</div>
          <el-form ref="regist" :model="form"  label-width="80px" >
              <el-form-item label="用户名"  prop="name" :rules="rules.name" >
                <el-col :span="20">
                  <el-input v-model="form.name" ></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="用户密码" prop="password" :rules="rules.password">
                <el-col :span="20">
                  <el-input v-model="form.password" type="password"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="用户手机" prop="phone" :rules="rules.phone">
                <el-col :span="20">
                  <el-input v-model="form.phone"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="用户邮箱" prop="email" :rules="rules.email">
                <el-col :span="20">
                  <el-input v-model="form.email"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="用户性别" prop="gender">
                <el-radio-group v-model="form.gender">
                  <el-radio label="1" >男</el-radio>
                  <el-radio label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="用户生日" prop="birthday">
                <el-col :span="13">
                  <el-date-picker type="date" placeholder="选择日期" v-model="form.birthday" style="width: 100%;"></el-date-picker>
                </el-col>
              </el-form-item>
             
             
              <el-form-item>
                <el-button type="primary" @click="onSubmit">注 册</el-button>
                <el-button @click="back">取 消</el-button>
              </el-form-item>
          </el-form>
      </div>
  </div>
</template>

<script>
import rules from '../../utils/rule'
import axios from '../../utils/_axios'
export default {
  data() {
    return {
      form: {
        name:"",
        password:"",
        phone:"",
        emial:"",
        birthday:"",
        gender:"1",
      },
      roleId:"3",
      rules,
    }
  },
  methods: {
    onSubmit() {
      const _this = this;
      this.$refs.regist.validate(valid => {
        if (valid) {
        
          axios.post('/user/regist',
          {
              "userName":_this.form.name,
              "userPassword":_this.form.password,
              "phone":_this.form.phone,
              "email":_this.form.email,
              "gender":_this.form.gender,
              "birthday":_this.form.birthday,
              "roleId":3
          }).then(function (response) {
            if(response.data.code == 200) {
              _this.$message.success('注册成功');
              _this.$router.push('/login');
            }else{
              _this.$message.error(response.data.extend.msg);
            }
          })
        }
      })
      console.log(this.rules);
    },
    back() {
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/regist-bg.jpg);
  background-size: 100%; 
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: rgb(161, 149, 149);
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -300px 100px 0 -175px;
  border-radius: 5px;
  background: rgba(216, 183, 183, 0.3);
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
.find-pass {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
  float: left;
}
.regist {
  margin-left: 30px;
  font-size: 12px;
  line-height: 30px;
  color: #fff;
  float: left;
}
</style>