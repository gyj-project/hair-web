<template>
    <div class="welcome-wrap">
        <div class="ms-login">
            <div class="ms-title">世间温暖，如约而至</div>
        </div>
      
    </div>
   
    
</template>

<script>

export default {
    data: function() {
        return {}
       
        
    },
    methods: {
    }
    
};
</script>

<style scoped>
.welcome-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 25px;
    color: black;
    border-bottom: 1px solid #ddd;
    font-family: STKaiti ;
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

</style>