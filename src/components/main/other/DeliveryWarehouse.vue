<template>
  <div class="deliveryWarehouse">
      <!-- MAIN CONTENT -->
			<div class="main-content">
				<div class="container-fluid">
					<h3 class="page-title">枪支出库操作</h3>
					<div class="row">

						<!-- INPUT SIZING -->
							<div class="panel">
								<div class="panel-body">
									截止时间：<input type="date" name="returnTime" id="returnTime" v-model="returnTime">
								</div>
								<button type="button" class="btn btn-primary btn-sm"  v-on:click="beforehandDeliveryAll()">
										批量出库
								</button>
								<button type="button" class="btn btn-warning btn-sm"  v-on:click="beforehandDeliveryAll()">
										批量撤销
								</button>
							</div>
								

						
						<div class="col-md-12">
							<!-- TASKS -->
							<div class="panel">
								<div class="panel-heading">
									<h3 class="panel-title">军械员操作出库</h3>
									<div class="right">
										<button type="button" class="btn-toggle-collapse"><i class="lnr lnr-chevron-up"></i></button>
										<button type="button" class="btn-remove"><i class="lnr lnr-cross"></i></button>
									</div>
								</div>
								<div class="panel-body">
									<table class="table table-bordered">
										<thead>
											<tr>
												<th><input id="cAllP" type="checkbox" @click="checkAllP($event)"></th>
												<th class="text-center">设备编号</th>
												<th class="text-center">人员姓名</th>
												<th class="text-center">人员编号</th>
												<th class="text-center">枪支编号</th>
												<th class="text-center">枪支型号</th>
												<th class="text-center">枪支类型</th>
												<th class="text-center">枪支蓝牙</th>
												<th class="text-center">操作</th>
											</tr>
										</thead>
										<tbody>
											
											<tr v-for="(gunsP,index) in filterByPreselected(gunListPreselected,filterInputPreselected)" :key="gunsP.id">
												<td><input type="checkbox" class="gIdcheckItemP" v-bind:value="gunsP.id" v-model="checkDataIdsP"></td>
												<td class="text-center">{{gunsP.apps.appName}}</td>
												<td class="text-center">{{userId[index]}}</td>
												<td class="text-center">{{userName[index]}}</td>
												<td class="text-center">{{gunsP.gunId}}</td>
												<td class="text-center">{{gunsP.gunModel}}</td>
												<td class="text-center">{{gunsP.gunType}}</td>
												<td class="text-center">{{gunsP.gunMac}}</td>
												<td class="text-center">
														<!-- Button trigger modal -->
														<button type="button" class="btn btn-primary btn-sm"  v-on:click="affirmDelivery(userId[index],gunsP.gunId,gunsP.gunMac,gunsP.apps.appName)">
															出库
														</button>
														<!-- Button trigger modal -->
														<button type="button" class="btn btn-warning btn-sm"  v-on:click="revocationDelivery(gunsP.gunId,gunsP.apps.appName)">
															撤销
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
  name: "DeliveryWarehouse",
  data() {
    return {
	  gunListPreselected: [],
	  filterInputPreselected: "",
	  checkDataIdsP: [],
	  gunIds:"",
	  appId:"",
	  gunUserId:"",
	  selectedUser: "",
		userAppList:[],
		userId:[],//人员编号
		userName:[],//人员姓名
		users:"",
		returnTime:""
    };
  },
   watch: {
   	checkDataIdsP: {
      handler() {
        // 数据数组有变化将触发此函数
        if (this.checkDataIdsP.length == 4) {
          document.querySelector("#cAllP").checked = true;
        } else {
          document.querySelector("#cAllP").checked = false;
        }
      },
      deep: true // 深度监视
    }
  },
  methods: {
	 checkAllP(e) {
      // 点击全选事件函数
      let checkObj = document.querySelectorAll(".gIdcheckItemP"); // 获取所有checkbox项
      if (e.target.checked) {
        // 判定全选checkbox的勾选状态
        for (let i = 0; i < checkObj.length; i++) {
          if (!checkObj[i].checked) {
            // 将未勾选的checkbox选项push到绑定数组中
            this.checkDataIdsP.push(checkObj[i].value);
          }
        }
      } else {
        // 如果是去掉全选则清空checkbox选项绑定数组
        this.checkDataIdsP = [];
      }
    },

	//查询所有被预出库的枪支
    getGunListPreselected() {
      this.$axios.get("/gun/readGunsPreselected").then(response => {
         console.log(response.data.extend.pageInfo.list);
				this.gunListPreselected = response.data.extend.pageInfo.list;
					for (var userApp of this.gunListPreselected) {
						this.getUser(userApp.apps.id);
				}
      });
    },
    //进行模糊查询
    filterByPreselected(gunListPreselected, value) {
      return gunListPreselected.filter(function(gunsP) {
        return gunsP.gunId.match(value);
      });
	},
	//军械员：单个出库
  affirmDelivery(userId,gunId,gunMac,appId){
		alert(userId+"++"+gunId+"++"+gunMac+"++"+this.returnTime+"++"+appId)
			if(!this.returnTime){
				alert("请选择截止时间");
			}else{
      	this.$axios.put("/wareHouseRecords/endWareHouseRecordsDelivery?userId="+userId+ "&gunId=" + gunId
				                 + "&gunMac=" + gunMac+ "&returnTime=" + this.returnTime+ "&appId=" + appId)
		        .then(response => {
                console.log(response.data);
          }); 
			}
	},
		//军械员：撤销出库
	revocationDelivery(gunId,appId){
			this.$axios.delete("/wareHouseRecords/revocationWareHouseRecordsDelivery?gunId="+gunId+ "&appId=" + appId)
		        .then(response => {
                console.log(response.data);
          }); 
	},
	//出库操作：单个
	beforehandDelivery(guncode){
		if(!this.selectedUser){
			alert("请选择绑定用户");
		}else{

		this.$axios.post("/wareHouseRecords/createWareHouseRecordsBeforehandDelivery?gunIds="+guncode+ "&gunUserId=" + this.selectedUser)
		        .then(response => {
                console.log(response.data);
          }); 
		}
	},
	//出库操作：多个
	beforehandDeliveryAll(){
		if(!this.selectedUser){
			alert("请选择绑定用户");
		}else if(this.checkDataIdsNP.length<1){
			alert("请选择出库的枪支");
		}else{
		this.$axios.post("/wareHouseRecords/createWareHouseRecordsBeforehandDelivery?gunIds="+this.checkDataIdsNP+ "&gunUserId=" + this.selectedUser)
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
	//根据设备号，获取分配的时候，所对应绑定的用户信息
	getUser(appId){
		this.$axios.get("/gunUser/readGunUser?appId="+appId).then(response => {
				this.users=response.data.extend.getUser;
				if(!this.users.userId || !this.users.userName){
					 this.userId.push("暂无");
					 this.userName.push("暂无");
				}else{
					this.userId.push(this.users.userId);
				  this.userName.push(this.users.userName);			
				}
		   	console.log(response.data.extend.getUser);
      });
		},	
  },
  //进入页面就进行显示
  created() {
	this.getGunListPreselected();
	this.getUserApp();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
