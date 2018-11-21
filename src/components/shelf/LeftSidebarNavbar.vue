<template>
  <div class="leftSidebar">
    	<!-- NAVBAR -->
		<nav class="navbar navbar-default navbar-fixed-top">
		<!-- 	<div class="brand">
				<a href="index.html"><img src="assets/img/logo-dark.png" alt="Klorofil Logo" class="img-responsive logo"></a>
			</div> -->
			<div class="container-fluid">
				<div class="navbar-btn">
					<button type="button" class="btn-toggle-fullwidth"><i class="lnr lnr-arrow-left-circle"></i></button>
				</div>
        <div class="navbar-btn">
					<button type="button" class="btn-toggle-fullwidth" @click="loginOut">退出</button>
				</div>
			</div>

		</nav>
		<!-- END NAVBAR -->



    <div id="sidebar-nav" class="sidebar">
          <div class="sidebar-scroll">
            <nav>
              <ul class="nav">
								<li><router-link :to="{name:'map'}" class=""><i class="lnr lnr-home"></i> <span>实时动态</span></router-link></li>
								<li><router-link :to="{name:'distributionStorage'}" class=""><i class="lnr lnr-home"></i> <span>枪支分配</span></router-link></li>
                <li><router-link :to="{name:'predistribution'}" class=""><i class="lnr lnr-home"></i> <span>枪支预出库</span></router-link></li>
                <li><router-link :to="{name:'finalStorage'}" class=""><i class="lnr lnr-home"></i> <span>枪支出库</span></router-link></li>
								<li><router-link :to="{name:'storageWarehouse'}" class=""><i class="lnr lnr-home"></i> <span>枪支入库</span></router-link></li>
								<li><router-link :to="{name:'elements'}" class=""><i class="lnr lnr-home"></i> <span>警告信息</span></router-link></li>
								<li><router-link :to="{name:'gunList'}" class=""><i class="lnr lnr-home"></i> <span>枪支列表</span></router-link></li>
								<li><router-link :to="{name:'notifications'}" class=""><i class="lnr lnr-home"></i> <span>警员管理</span></router-link></li>
								<li><router-link :to="{name:'elements'}" class=""><i class="lnr lnr-home"></i> <span>库室管理</span></router-link></li>
								<li><router-link :to="{name:'elements'}" class=""><i class="lnr lnr-home"></i> <span>射弹计数</span></router-link></li>
							
               <li>
                  <a href="#subPages" data-toggle="collapse" class="collapsed"><i class="lnr lnr-file-empty"></i> <span>系统管理</span>
                    <i class="icon-submenu lnr lnr-chevron-left"></i></a>
                  <div id="subPages" class="collapse ">
                    <ul class="nav">
                     	<li><router-link :to="{name:'elements'}" class=""><i class="lnr lnr-home"></i> <span>权限管理</span></router-link></li>
											<li><router-link :to="{name:'elements'}" class=""><i class="lnr lnr-home"></i> <span>角色管理</span></router-link></li>
											<li><router-link :to="{name:'elements'}" class=""><i class="lnr lnr-home"></i> <span>菜单管理</span></router-link></li> 
                    </ul>
                  </div>
                </li> 
             
              </ul>
            </nav>
          </div>
        </div>
  </div>
</template>

<script>
// import  "../../../static/assets/vendor/jquery/jquery.min.js";
// import  "../../../static/assets/vendor/bootstrap/js/bootstrap.min.js";
// import  "../../../static/assets/vendor/jquery-slimscroll/jquery.slimscroll.min.js";
// import  "../../../static/assets/vendor/chartist/js/chartist.min.js";
// import  "../../../static/assets/scripts/klorofil-common.js";

/*   <script src="static/assets/vendor/jquery/jquery.min.js">
  <script src="static/assets/vendor/bootstrap/js/bootstrap.min.js">
  <script src="static/assets/vendor/jquery-slimscroll/jquery.slimscroll.min.js">
  <script src="static/assets/vendor/jquery.easy-pie-chart/jquery.easypiechart.min.js">
  <script src="static/assets/vendor/chartist/js/chartist.min.js">
  <script src="static/assets/scripts/klorofil-common.js">
  <script src="static/assets/vendor/toastr/toastr.min.js"> */
export default {
  name: 'LeftSidebar',
  data () {
    return {
    }
  },
  methods:{
    loginOut(){
      let _this=this;
         //询问框
      layer.confirm(
        "确定要退出登录？",
        {
          btn: ["确定", "取消"] //按钮
        },
        function() {
            _this.$axios.post("/webUser/loginOut").then(response => {
          var result=response.data;
          if(result.status=="1000"){
             //layer.msg(response.data.errorMessage)
            localStorage.clear();
            _this.$store.commit('SAVE_USERSTATE',false)
            _this.$router.replace('/login')
            }else{
              Lobibox.notify("error", {
                size: "mini",
                msg: result.errorMessage
              });
            }
             // console.log(response.data);
              layer.msg(result.errorMessage, {
                time: 500 //0.5s后自动关闭
              });
            });
        },
        function() {
          layer.msg("取消成功", {
            time: 500 //0.5s后自动关闭
          });
        }
      );
    }
  },created(){
    if(this.$store.state.userRefrsh){
      history.go(0);
       _this.$store.commit('SAVE_REFRESH',false)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../../../static/assets/vendor/linearicons/style.css';
</style>
