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
			</div>
		</nav>
		<!-- END NAVBAR -->



    <div id="sidebar-nav" class="sidebar">
          <div class="sidebar-scroll">
            <nav>
              <ul class="nav">
								<li><router-link :to="{name:'Map'}" class=""><i class="lnr lnr-home"></i> <span>实时动态</span></router-link></li>
								<li><router-link :to="{name:'DistributionStorage'}" class=""><i class="lnr lnr-home"></i> <span>枪支分配</span></router-link></li>
                <li><router-link :to="{name:'Predistribution'}" class=""><i class="lnr lnr-home"></i> <span>枪支预出库</span></router-link></li>
                <li><router-link :to="{name:'FinalStorage'}" class=""><i class="lnr lnr-home"></i> <span>枪支出库</span></router-link></li>
								<li><router-link :to="{name:'StorageWarehouse'}" class=""><i class="lnr lnr-home"></i> <span>枪支入库</span></router-link></li>
								<li><router-link :to="{name:'Elements'}" class=""><i class="lnr lnr-home"></i> <span>警告信息</span></router-link></li>
								<li><router-link :to="{name:'GunList'}" class=""><i class="lnr lnr-home"></i> <span>枪支列表</span></router-link></li>
								<li><router-link :to="{name:'Elements'}" class=""><i class="lnr lnr-home"></i> <span>警员管理</span></router-link></li>
								<li><router-link :to="{name:'Elements'}" class=""><i class="lnr lnr-home"></i> <span>库室管理</span></router-link></li>
								<li><router-link :to="{name:'Elements'}" class=""><i class="lnr lnr-home"></i> <span>射弹计数</span></router-link></li>
							
               <li>
                  <a href="#subPages" data-toggle="collapse" class="collapsed"><i class="lnr lnr-file-empty"></i> <span>系统管理</span>
                    <i class="icon-submenu lnr lnr-chevron-left"></i></a>
                  <div id="subPages" class="collapse ">
                    <ul class="nav">
                     	<li><router-link :to="{name:'Elements'}" class=""><i class="lnr lnr-home"></i> <span>权限管理</span></router-link></li>
											<li><router-link :to="{name:'Elements'}" class=""><i class="lnr lnr-home"></i> <span>角色管理</span></router-link></li>
											<li><router-link :to="{name:'Elements'}" class=""><i class="lnr lnr-home"></i> <span>菜单管理</span></router-link></li> 
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
export default {
  name: 'LeftSidebar',
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
