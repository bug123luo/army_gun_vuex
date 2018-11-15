<!--给腕表分配枪支-->
<template>
  <div class="distributionStorage">
        <!-- MAIN CONTENT -->
			<div class="main-content">
				<div class="container-fluid">
					<h3 class="page-title">枪支分配</h3>
					<div class="row">
						<!-- INPUT SIZING -->
							<div class="panel">
								<div class="panel-body">

                  
                    <form class="form-horizontal">
                      <div class="row">
                        <div class="">
                          <label class="col-sm-2 control-label">用户</label>
                          <div class="col-md-3">
                            <select class="form-control"  @click="getUserApp()" v-model="selectedUser">
                                <option disabled value="">请选择用户</option>
                                <option v-for="userApps in userAppList" :value="userApps.userId">
                                    {{userApps.userName}}
                                </option>
                              </select>
                          </div>
                        </div>
                          <label for="inputPassword" class="col-sm-2 control-label">设备</label>
                          <div class="col-sm-3">
                            <select class="form-control"  @click="getApp()" v-model="selectedApp">
                                <option disabled value="">请选择设备</option>
                                <option v-for="apps in appList" :value="apps.id">
                                    {{apps.appName}}
                                </option>
                              </select>
                          </div>
                      </div>
                    </form>
                  

								</div>
                
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
									<table class="table table-bordered table-hover">
										<thead>
											<tr>
												<th style="width:63px"><input id="cAllNP" type="checkbox" @click="checkAllNP($event)"></th>
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
														<button type="button" class="btn btn-primary btn-sm"  v-on:click="distributionStorage(gunsNP.gunId)">
															枪支分配
														</button>
												</td>
											</tr>
										</tbody>
									</table>
                  
                  <div>
                      <button type="button" class="btn btn-primary btn-sm" id="batchAllocation" disabled="disabled"  v-on:click="distributionStorageAll()">
                          批量枪支分配
                      </button>
                  </div>
                    <div class="text-center" v-show="total>pageSize">
                      <div class="row">
                        <!-- 分页显示 -->
                        <div class="page-bar" style=" margin:0 auto; margin-left:20%;">
                          <ul>
                              <li v-if="cur>1"><a v-on:click="cur=1,pageClick()">首页</a></li>
                              <li v-if="cur>1"><a v-on:click="cur--,pageClick()"><span aria-hidden="true">&laquo;</span></a></li>
                              <li v-if="cur==1"><a class="banclick"><span aria-hidden="true">&laquo;</span></a></li>
                              <li v-for="index in indexs"  v-bind:class="{ 'active': cur == index}">
                                  <a v-on:click="btnClick(index)">{{ index }}</a>
                              </li>
                              <li v-if="cur!=all"><a v-on:click="cur++,pageClick()"><span aria-hidden="true">&raquo;</span></a></li>
                              <li v-if="cur == all"><a class="banclick"><span aria-hidden="true">&raquo;</span></a></li>
                              <li v-if="cur!=all"><a v-on:click="cur=all,pageClick()">尾页</a></li>
                              <li><a>到第<i>{{cur}}</i>页</a></li>
                              <li><a>共<i>{{all}}</i>页</a></li>
                              <li><a>共<i>{{total}}</i>条</a></li>
                              <li><a><i>{{pageSize}}</i>条/页</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>

                  
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
  name: "DistributionStorage",
  data() {
    return {
      gunListNotPreselected: [],
      filterInputNotPreselected: "",
      checkDataIdsNP: [], //将多个选中的复选框，绑定到同个数组中
      gunIds: "",
      appId: "",
      gunUserId: "",
      selectedUser: "",
      selectedApp: "",
      userAppList: [],
      appList: [],
      pn: 1,
      all: "", //总页数
      cur: "", //当前页码
      total: "", //总条数
      pageSize: "" //多少一页
    };
  },
  watch: {
    // 监视双向绑定的数据数组
    checkDataIdsNP: {
      handler() {
        if(this.checkDataIdsNP.length==0){
          $("#batchAllocation").attr('disabled', 'disabled');
        }else{
          $("#batchAllocation").removeAttr('disabled');
        }
        // 数据数组有变化将触发此函数
        /*    if (this.checkDataIdsNP.length == 5) {
          document.querySelector("#cAllNP").checked = true;
        }else if(!$("#cAllNP").checked) {
          document.querySelector("#cAllNP").checked = false;
        } */

        // 数据数组有变化将触发此函数
        if ($("#cAllNP").checked) {
          $(".gIdcheckItemNP").prop("checked", $(this).prop("checked"));
        } else if (
          $(".gIdcheckItemNP:checked").length == $(".gIdcheckItemNP").length
        ) {
          $("#cAllNP").prop("checked", flag);
        }
      },
      deep: true // 深度监视
    },
    cur: function(oldValue, newValue) {
      console.log(arguments);
    }
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
    getGunListNotPreselected(pn) {
      this.$axios.get("/gun/readGunsNotPreselected?pn=" + pn).then(response => {
        console.log(response.data.extend.pageInfo);
        this.gunListNotPreselected = response.data.extend.pageInfo.list;
        var listPage = response.data.extend.pageInfo;
        this.all = listPage.pages; //总页数
        this.cur = listPage.pageNum; //当前页码
        this.total = listPage.total;
        this.pageSize = listPage.pageSize;
      });
    },
    //进行模糊查询
    filterByNotPreselected(gunListNotPreselected, value) {
      return gunListNotPreselected.filter(function(gunsNP) {
        return gunsNP.gunId.match(value);
      });
    },

    //出库分配操作：单个
    distributionStorage(guncode) {
      if (!this.selectedApp) {
        alert("请选择绑定设备");
      } else if (!this.selectedUser) {
        alert("请选择绑定设备");
      } else {
        this.$axios
          .post(
            "/appGun/createAppGun?gunIds=" +
              guncode +
              "&appId=" +
              this.selectedApp +
              "&gunUserId=" +
              this.selectedUser
          )
          .then(response => {
            this.getGunListNotPreselected();
            console.log(response.data);
          });
      }
    },
    //出库分配操作：多个
    distributionStorageAll() {
      if (!this.selectedApp) {
        alert("请选择绑定用户");
      } else if (this.checkDataIdsNP.length < 1) {
        alert("请选择出库的枪支");
      } else {
        this.$axios
          .post(
            "/appGun/createAppGun?gunIds=" +
              this.checkDataIdsNP +
              "&appId=" +
              this.selectedApp +
              "&gunUserId=" +
              this.selectedUser
          )
          .then(response => {
            document.querySelector("#cAllNP").checked = false;
            console.log(response.data);
            this.getGunListNotPreselected(this.pn);
          });
      }
    },
    //获取没有绑定的了腕表的用户
    getUserApp() {
      this.$axios.get("/gunUser/readGunUserNoBinding").then(response => {
        console.log(response.data.extend.gunUserList);
        this.userAppList = response.data.extend.gunUserList;
      });
    },
    //获取设备用户
    getApp() {
      this.$axios.get("/app/readAppList").then(response => {
        console.log(response.data.extend.pageInfo.list);
        this.appList = response.data.extend.pageInfo.list;
      });
    },

    //分页
    btnClick: function(data) {
      //页码点击事件
      if (data != this.cur) {
        (this.cur = data), this.getGunListNotPreselected(this.cur);
      }
    },
    pageClick: function() {
      this.getGunListNotPreselected(this.cur);
      console.log("现在在" + this.cur + "页");
    },
   
  },

  //进入页面就进行显示
  created() {
    this.getGunListNotPreselected(this.pn);
    this.getUserApp();
    this.getApp();
  },
  computed: {
    indexs: function() {
      var left = 1;
      var right = this.all;
      var ar = [];
      if (this.all >= 5) {
        if (this.cur > 3 && this.cur < this.all - 2) {
          left = this.cur - 2;
          right = this.cur + 2;
        } else {
          if (this.cur <= 3) {
            left = 1;
            right = 5;
          } else {
            right = this.all;
            left = this.all - 4;
          }
        }
      }
      while (left <= right) {
        ar.push(left);
        left++;
      }
      return ar;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import '../../common/css/paging.css'; /*引入公共样式*/
</style>
