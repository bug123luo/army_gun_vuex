<template>
  <div id="login">
        <div class="nav_bg">
            <div class="bor">
                <div class="wel">用户登录</div>
                <form id="login_form" method="POST">
                    <div class="Login">
                        <img src="img/yonghu.png"/>
                        <p><input type="text" id="userName"  placeholder="用户名" ref="userName"></p>
                    </div>
                    <div class="pass">
                        <img src="img/pass.png"/>
                        <p><input type="password" id="passWord"  placeholder="请输入密码" ref="passWord"></p>
                    </div>
                    <div></div>
                    <p><input class="sure" type="button" id="login" @click="loginSubmit()" value="登录"/></p>

                </form>
                <dl class="sign">
                    <dt><a href="retrievePassword.html">忘记密码？</a></dt>
                    <dd>新用户请先<a href="index.html">注册</a></dd>
                </dl>
                <div class="clearfix"></div>
                <div class="rem"><input class="kuai" type="checkbox" value="1"/>
                    <p>记住密码</p></div>
                <div class="text-center">
                    <span id="error" style="color:red"></span>
                    <span id="errorpass" style="color:red"></span>
                </div>
            </div>
            <div class="jpg"><img src="img/beijing.png"/></div>
        </div>
    </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {

    };
  },
  methods: {
    loginSubmit() {
      //获取登录信息
      let _this = this;
      var userName = _this.$refs.userName.value;
      var passWord = _this.$refs.passWord.value;
      if(!userName || !passWord){
        alert("用户或者密码不能为空");
      }else{
          let params = new URLSearchParams();
          params.append("webUserName", userName),
          params.append("webUserPassword", passWord),

          this.$axios.post('/webUser/loginWeb',params)
                     .then(response =>{
                         console.log(response.data);
                         var user=response.data;
                         if(user.status=="1000"){
                            this.$router.replace('/')
                         }else{
                              $("#error").text("用户名不能为空");
                         }
                     })
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../common/css/loginForm";
</style>