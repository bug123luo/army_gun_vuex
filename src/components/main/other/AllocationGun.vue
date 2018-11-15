<!--给腕表分配枪支-->
<template>
  <div class="allocationGun">
        <!-- MAIN CONTENT -->
			<div class="main-content">
				<div class="container-fluid">
					<h3 class="page-title">枪支分配</h3>
					<div class="row">

						<!-- INPUT SIZING -->
							<div class="panel">
								<div class="panel-body">
									<select class="form-control"  @click="getUserApp()" v-model="selectedUser">
										<option disabled value="">请选择用户</option>
										<option v-for="userApps in userAppList" :value="userApps.gunUser.userName">
												{{userApps.gunUser.userName}}
										</option>
									</select>
                                    <select class="form-control"  @click="getApp()" v-model="selectedApp">
										<option disabled value="">请选择设备</option>
										<option v-for="apps in appList" :value="apps.appImei">
												{{apps.appName}}
										</option>
									</select>
                                   
								</div>
								<button type="button" class="btn btn-primary btn-sm"  v-on:click="beforehandDeliveryAll()">
										批量出库分配
								</button>
							</div>
								
						<!-- END INPUT SIZING -->

						<div class="col-md-12">
							<!-- TASKS -->
							<div class="panel">
								<div class="panel-heading">
									<h3 class="panel-title">枪支列表</h3>
									<div class="right">
										<button type="button" class="btn-toggle-collapse"><i class="lnr lnr-chevron-up"></i></button>
										<button type="button" class="btn-remove"><i class="lnr lnr-cross"></i></button>
									</div>
								</div>
								<div class="panel-body">
									<table class="table table-bordered">
										<thead>
											<tr>
												<th><input id="cAllNP" type="checkbox" @click="checkAllNP($event)"></th>
												<th class="text-center">枪支编号</th>
												<th class="text-center">枪支型号</th>
												<th class="text-center">枪支类型</th>
												<th class="text-center">蓝牙号</th>
												<th class="text-center">操作</th>
											</tr>
										</thead>
										<tbody>
											
											<tr v-for="gunsNP in filterByNotPreselected(gunListNotPreselected,filterInputNotPreselected)" :key="gunsNP.id">
												<td><input type="checkbox" class="gIdcheckItemNP" v-bind:value="gunsNP.gunId" v-model="checkDataIdsNP"></td>
												<td class="text-center">{{gunsNP.gunId}}</td>
												<td class="text-center">{{gunsNP.gunModel}}</td>
												<td class="text-center">{{gunsNP.gunType}}</td>
												<td class="text-center">{{gunsNP.gunMac}}</td>
												<td class="text-center">
														<!-- Button trigger modal -->
														<button type="button" class="btn btn-primary btn-sm"  v-on:click="beforehandDelivery(gunsNP.gunId)">
															出库分配
														</button>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<!-- END TASKS -->
						</div>
						
					</div>
				</div>
			</div>
			<!-- END MAIN CONTENT -->
		
  </div>
</template>
<script>
export default {
  name: "AllocationGun",
  data() {
    return {
      gunListNotPreselected: [],
	  filterInputNotPreselected: "",
	  checkDataIdsNP: [], //将多个选中的复选框，绑定到同个数组中
	  gunIds:"",
	  appId:"",
	  gunUserId:"",
      selectedUser: "",
      selectedApp: "",
      userAppList:[],
      appList:[],
    };
  },
   watch: {
    // 监视双向绑定的数据数组
    checkDataIdsNP: {
      handler() {
        // 数据数组有变化将触发此函数
        if (this.checkDataIdsNP.length == 4) {
          document.querySelector("#cAllNP").checked = true;
        } else {
          document.querySelector("#cAllNP").checked = false;
        }
      },
      deep: true // 深度监视
	},
  },
  methods: {
	   checkAllNP(e) {
      // 点击全选事件函数
      let checkObj = document.querySelectorAll(".gIdcheckItemNP"); // 获取所有checkbox项
      if (e.target.checked) {
        // 判定全选checkbox的勾选状态
        for (let i = 0; i < checkObj.length; i++) {
          if (!checkObj[i].checked) {
            // 将未勾选的checkbox选项push到绑定数组中
            this.checkDataIdsNP.push(checkObj[i].value);
          }
        }
      } else {
        // 如果是去掉全选则清空checkbox选项绑定数组
        this.checkDataIdsNP = [];
      }
	},

    //查询所有可以进行预出库的枪支
    getGunListNotPreselected() {
      this.$axios.get("/gun/readGunsNotPreselected").then(response => {
        //console.log(response.data);
        this.gunListNotPreselected = response.data.extend.pageInfo.list;
      });
    },
    //进行模糊查询
    filterByNotPreselected(gunListNotPreselected, value) {
      return gunListNotPreselected.filter(function(gunsNP) {
        return gunsNP.gunId.match(value);
      });
	},
	
	//预出库操作：单个
	beforehandDelivery(guncode){
		if(!this.selectedApp){
			alert("请选择绑定设备");
		}else{

		this.$axios.post("/wareHouseRecords/createWareHouseRecordsBeforehandDelivery?gunIds="+guncode+ "&gunUserId=" + this.selectedUser)
		        .then(response => {
                console.log(response.data);
          }); 
		}
	},
	//预出库操作：多个
	beforehandDeliveryAll(){
		if(!this.selectedApp){
			alert("请选择绑定用户");
		}else if(this.checkDataIdsNP.length<1){
			alert("请选择出库的枪支");
		}else{
		this.$axios.post("/wareHouseRecords/createWareHouseRecordsBeforehandDelivery?gunIds="+this.checkDataIdsNP+ "&appIMEI=" + this.selectedApp+ "&gunUserId=" + this.selectedUser)
		        .then(response => {
                console.log(response.data);
          }); 
		}
	},
	//获取已经绑定的了腕表的用户
	getUserApp(){
		this.$axios.get("/appGunUser/readAppGunUserList").then(response => {
        console.log(response.data.extend.pageInfo);
        this.userAppList = response.data.extend.pageInfo;
      });
    },
    //获取设备用户
	getApp(){
		this.$axios.get("/app/readAppList").then(response => {
        console.log(response.data.extend.pageInfo.list);
        this.appList = response.data.extend.pageInfo.list;
      });
	},
  },
  //进入页面就进行显示
  created() {
	this.getGunListNotPreselected();
    this.getUserApp();
    this.getApp();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
