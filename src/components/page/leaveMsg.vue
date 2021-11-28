<template>
    <div>
        <el-form  label-width="80px" :model="form">
            <el-form-item label="标题" >
              <el-input  v-model="form.title" class="titlel"></el-input>
            </el-form-item>
            <el-form-item label="内容" >
                <el-input
                class="info"
                type="textarea"
                placeholder="请输入内容"
                :autosize="{ minRows: 10, maxRows: 15}"
                maxlength="800"
                show-word-limit
                v-model="form.info"
                >
                </el-input>
            </el-form-item>
           
            <el-form-item>
              <el-button type="primary" @click="submit">发 布</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
    </div>
</template>

<script>
    import axios from '../../utils/_axios'
    import rules from '../../utils/rule'
    import bus from '../../components/common/bus.js';
    export default {
       
        data: function(){
            return {
                form: {
                    title:"",
                    info:"",
                    time:"",
                }
            }
        },
        methods: {
            submit() {
               
                const _this = this;
                axios.post('http://127.0.0.1:8081/api/publish/info', 
                {      
                    "id":"",
                    "title":_this.form.title,
                    "info":_this.form.info,
                }).then(function (response) {
                    if(response.data.code == 200) {
                        _this.$message.success('发布成功');
                    }
                });
                //bus.$emit('infoMessage', 1)
            }
        }
        
       
    }
</script>
<style scoped>
    
    .titlel >>>  {
       
        font-size: 20px;
        font-family:"宋体"
      
    }
    .info >>> {
        font-size: 17px;
    }
</style>
