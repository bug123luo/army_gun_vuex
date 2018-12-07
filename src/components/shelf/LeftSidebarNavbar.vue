<template>
  <div class="leftSidebar">
    	<!-- NAVBAR -->
		<nav class="navbar navbar-default navbar-fixed-top">
		<!-- 	<div class="brand">
				<a href="index.html"><img src="assets/img/logo-dark.png" alt="Klorofil Logo" class="img-responsive logo"></a>
			</div> -->
			<div class="container-fluid">
        <div  style="float:left; margin-top:16px; font-size:20px; margin-left:30px; margin-right:80px;">
          枪支定位管理
        </div>
				<div class="navbar-btn">
					<button type="button" class="btn-toggle-fullwidth"><i class="lnr lnr-arrow-left-circle"></i></button>
				</div>
        <div class="navbar-btn" style="float:right; margin-top:20px; margin-right:10px; ">
					<button type="button"  @click="loginOut">退出</button>
				</div>
			</div>
		</nav>
		<!-- END NAVBAR -->



    <div id="sidebar-nav" class="sidebar">
          <div class="sidebar-scroll">
            <nav>
             
              <ul class="nav" v-for="(p,index) in permmissionLists" :key="">
              <li v-if="p.children!=null">
                  <a href="#subPages" data-toggle="collapse" class="collapsed"><i :class="p.icon"></i> <span>{{p.descpt}}</span>
                    <i class="icon-submenu lnr lnr-chevron-left"></i></a>
                  <div id="subPages" class="collapse ">
                    <ul class="nav" v-for="(c,index) in p.children" :key="" >
                     	<li><router-link  :to="c.page" exact-active-class ="" append><i :class="c.icon"></i> <span>{{c.descpt}}</span></router-link></li>
                    </ul>
                  </div>
              </li> 
               <li v-else >
                <router-link  :to="p.page" exact-active-class ="" append><i :class="p.icon"></i> <span>{{p.descpt}}</span></router-link>
              </li>  
							<!-- 	<li><router-link :to="{name:'map'}" exact-active-class ="active" append><i class="lnr lnr-home"></i> <span>实时动态</span></router-link></li>
								<li><router-link  to="/distributionStorage" exact-active-class ="" append><i class="lnr lnr-home"></i> <span>枪支分配</span></router-link></li>
                <li><router-link  to="/predistribution" class=""><i class="lnr lnr-home"></i> <span>枪支预出库</span></router-link></li>
                <li><router-link  to="/finalStorage" class=""><i class="lnr lnr-home"></i> <span>枪支出库</span></router-link></li>
								<li><router-link  to="/storageWarehouse" class=""><i class="lnr lnr-home"></i> <span>枪支入库</span></router-link></li>
								<li><router-link  to="/sosMessage" class=""><i class="lnr lnr-home"></i> <span>警告信息</span></router-link></li>
                <li><router-link  to="/mission" class=""><i class="lnr lnr-home"></i> <span>离位启停</span></router-link></li>
								<li><router-link  to="/gunList" class=""><i class="lnr lnr-home"></i> <span>枪支列表</span></router-link></li>
								<li><router-link  to="/notifications" class=""><i class="lnr lnr-home"></i> <span>警员管理</span></router-link></li>
								<li><router-link  to="/elements" class=""><i class="lnr lnr-home"></i> <span>库室管理</span></router-link></li>
								<li><router-link  to="/elements" class=""><i class="lnr lnr-home"></i> <span>射弹计数</span></router-link></li>
							
               <li>
                  <a href="#subPages" data-toggle="collapse" class="collapsed"><i class="lnr lnr-file-empty"></i> <span>系统管理</span>
                    <i class="icon-submenu lnr lnr-chevron-left"></i></a>
                  <div id="subPages" class="collapse ">
                    <ul class="nav">
                     	<li><router-link  to="/elements" class=""><i class="lnr lnr-home"></i> <span>用户管理</span></router-link></li>
											<li><router-link  to="/roleManage" class=""><i class="lnr lnr-home"></i> <span>角色管理</span></router-link></li>
											<li><router-link  to="/elements" class=""><i class="lnr lnr-home"></i> <span>权限管理</span></router-link></li> 
                    </ul>
                  </div>
                </li>  -->
             
              </ul>
            </nav>
          </div>
        </div>
  </div>
</template>

<script>

export default {
  name: "LeftSidebar",
  data() {
    return {
      permmissionLists:[],
    };
  },
  methods: {
    loginOut() {
      let _this = this;
      //询问框
      layer.confirm(
        "确定要退出登录？",
        {
          btn: ["确定", "取消"] //按钮
        },
        function() {
          _this.$axios.post("/webUser/loginOut").then(response => {
            var result = response.data;
            if (result.status == "1000") {
              //layer.msg(response.data.errorMessage)
              localStorage.clear();
              _this.$store.commit("SAVE_USERSTATE", false);
              _this.$router.replace("/login");
            } else {
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
    },
    //渲染菜单列表
    getMenu(){
       let userInfo=JSON.parse(this.$store.state.userInfo);
       this.permmissionLists=userInfo.extend.permissionLists;
       //this.permmissionListsChildren=permmissionLists.children;
       for (const key in this.permmissionLists) {
          //alert(this.permmissionLists[key].children)
       }
       //console.log(this.permmissionLists);
       
    }
  },
  created() {
    if (this.$store.state.userRefrsh) {
      history.go(0);
      _this.$store.commit("SAVE_REFRESH", false);
    }
    this.getMenu();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../../../static/assets/vendor/linearicons/style.css";
</style>
