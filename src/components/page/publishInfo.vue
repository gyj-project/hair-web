<template>
    <el-container>
        <el-header>
            <h1 class="title">{{ title }}</h1>
            <el-link type="primary"  class="back" @click="back">返回</el-link>
        </el-header>
        <el-main>{{ contain }}</el-main>
        <el-footer>{{ time }}</el-footer>
    </el-container>
</template>
<script>
    import rules from '../../utils/rule'
    import axios from '../../utils/_axios'
    export default {
    data() {
        return {
            title:"",
            id:"",
            contain:"",
            time:""
           
            
        }
    },
    created() {
      
        this.id = this.$route.query.id;
        const _this = this;
        axios.get('/api/publish/info/'+ _this.id
        ).then(function(resp){ 
            console.log(resp.data)
            _this.title = resp.data.extend.publishInfo.title;
            _this.contain = resp.data.extend.publishInfo.info;
            _this.time = resp.data.extend.publishInfo.publishTime;
        });

    },
    methods: {
        
        
        back() {
            this.$router.push('/notice');
        }
    }
    }
</script>
<style>
    .title {
        margin-left: 470px;
        float: left;
    }
    .back {
        margin-left: 400px;
    }
    .el-header, .el-footer {
      background-color: #D3DCE6;
      color: #333;
      line-height: 60px;
    }
    
    
    .el-main {
      background-color: #E9EEF3;
      color: #333;
      text-align: center;
      line-height: 260px;
    }
    
    body > .el-container {
      margin-bottom: 40px;
    }
    
 
  </style>