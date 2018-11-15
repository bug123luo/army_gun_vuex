<!--枪支入库操作-->
<template>
  <div class="storageWarehouse">
      <!-- MAIN CONTENT -->
			<div class="main-content">
				<div class="container-fluid">
					<h3 class="page-title">枪支入库操作</h3>
					<div class="row">

                        	<!-- INPUT SIZING -->
							<!-- <div class="panel">
								<button type="button" class="btn btn-primary btn-sm"  v-on:click="storagePreselecteds()">
										批量预出库
								</button>
								<button type="button" class="btn btn-warning btn-sm"  v-on:click="storagePreselecteds()">
										批量撤销
								</button>
							</div> -->

						<div class="col-md-6">
							<!-- TASKS -->
							<div class="panel">
								<div class="panel-heading">
									<h3 class="panel-title">已出库枪支</h3>
									<div class="right">
										<button type="button" class="btn-toggle-collapse"><i class="lnr lnr-chevron-up"></i></button>
										<button type="button" class="btn-remove"><i class="lnr lnr-cross"></i></button>
									</div>
								</div>
								<div class="panel-body">
									<table class="table table-bordered">
										<thead>
											<tr>
												<th><input id="wrAll" type="checkbox" @click="checkAll($event)"></th>
												<th class="text-center">设备编号</th>
												<th class="text-center">枪支编号</th>
                                                <th class="text-center">出库时间</th>
                                                <th class="text-center">操作</th>
											</tr>
										</thead>
                                        
										<tbody>
											<tr  v-for="(warehouse,index) in filterBy(warehouseList,filterInput)" :key="">
												<td style="width:63px"><input type="checkbox" class="wrIdcheckItem" v-bind:value="warehouse.gunId" v-model="checkDataIds">
                                                    <input type="hidden" :id='warehouse.gunId' v-bind:value="warehouse.apps.appImei" >
                                                </td>
												<td class="text-center">{{warehouse.appId}}</td>
												<td class="text-center">{{warehouse.gunId}}</td>
												<td class="text-center">{{warehouse.warehouseOutTime | formatDate}}</td>
                                                <td class="text-center">
	                                                    <!-- Button trigger modal -->
														<button type="button" class="btn btn-primary btn-sm"  v-on:click="storagePreselected(warehouse.gunId,warehouse.apps.appImei)">
															预入库
														</button>
														<!-- Button trigger modal -->
                        </td>
											</tr>
										</tbody>
									</table>

                     <div class="text-center" v-show="total>pageSize">
                      <div class="row">
                        <!-- 分页显示 -->
                        <div class="page-bar" style=" margin:0 auto; margin-left:20%;">
                          <ul>
                              <li v-if="cur>1"><a v-on:click="cur=1,pageClick()">首页</a></li>
                              <li v-if="cur>1"><a v-on:click="cur--,pageClick()"><</a></li>
                              <li v-if="cur==1"><a class="banclick"><</a></li>
                              <li v-for="index in indexs"  v-bind:class="{ 'active': cur == index}">
                                  <a v-on:click="btnClick(index)">{{ index }}</a>
                              </li>
                              <li v-if="cur!=all"><a v-on:click="cur++,pageClick()">></a></li>
                              <li v-if="cur == all"><a class="banclick">></a></li>
                              <li v-if="cur!=all"><a v-on:click="cur=all,pageClick()">尾页</a></li>
                              <li><a>共<i>{{all}}</i>页</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>


								</div>
							</div>
							<!-- END TASKS -->
						</div>
						
						<div class="col-md-6">
							<!-- TASKS -->
							<div class="panel">
								<div class="panel-heading">
									<h3 class="panel-title">军械员操作入库</h3>
									<div class="right">
										<button type="button" class="btn-toggle-collapse"><i class="lnr lnr-chevron-up"></i></button>
										<button type="button" class="btn-remove"><i class="lnr lnr-cross"></i></button>
									</div>
								</div>
								<div class="panel-body">
									<table class="table table-bordered">
										<thead>
											<tr>
												<th><input id="wrAlls" type="checkbox" @click="checkAlls($event)"></th>
												<th class="text-center">设备编号</th>
												<th class="text-center">枪支编号</th>
                                                <th class="text-center">枪支蓝牙</th>
                                                <th class="text-center">操作</th>
											</tr>
										</thead>
										<tbody>
											<tr v-for="warehouses in filterBys(warehouseLists,filterInputs)" :key="">
												<td style="width:63px"><input type="checkbox" class="wrIdcheckItems" v-bind:value="warehouses.gunId" v-model="checkDataIdss"></td>
												<td class="text-center">{{warehouses.appId}}</td>
												<td class="text-center">{{warehouses.gunId}}</td>
                        <td class="text-center">{{warehouses.guns.gunMac}}</td>
                        <td class="text-center">
                            <!-- Button trigger modal -->
                            <button type="button" class="btn btn-primary btn-sm"  v-on:click="affirmStorage(warehouses.gunId,warehouses.guns.gunMac,warehouses.apps.appImei)">
                                入库
                            </button>
                            <button type="button" class="btn btn-warning btn-sm"  v-on:click="revocationStorage(warehouses.gunId,warehouses.guns.gunMac,warehouses.apps.appImei)">
                                撤销
                            </button>
                            <!-- Button trigger modal -->
                        </td>
											</tr>
										</tbody>
									</table>
                  <div class="text-center" v-show="totalj>pageSizej">
                      <div class="row">
                        <!-- 分页显示 -->
                        <div class="page-bar" style=" margin:0 auto; margin-left:20%;">
                          <ul>
                              <li v-if="curj>1"><a v-on:click="curj=1,pageClickj()">首页</a></li>
                              <li v-if="curj>1"><a v-on:click="curj--,pageClickj()"><</a></li>
                              <li v-if="curj==1"><a class="banclick"><</a></li>
                              <li v-for="index in indexsj"  v-bind:class="{ 'active': curj == index}">
                                  <a v-on:click="btnClickj(index)">{{ index }}</a>
                              </li>
                              <li v-if="curj!=allj"><a v-on:click="curj++,pageClickj()">></a></li>
                              <li v-if="curj == allj"><a class="banclick">></a></li>
                              <li v-if="curj!=allj"><a v-on:click="curj=allj,pageClickj()">尾页</a></li>
                              <li><a>共<i>{{allj}}</i>页</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
								</div>
							</div>
							<!-- END TASKS -->
						</div>
				<!-- 	{{appImeis}}{{totalj}}{{total}} -->
					</div>
				</div>
			</div>
			<!-- END MAIN CONTENT -->
  </div>
</template>

<script>
import { formatDate } from "../../common/js/formatDate.js";
export default {
  name: "StorageWarehouse",
  data() {
    return {
      warehouseList: [], //库存信息
      filterInput: "",
      checkDataIds: [],
      warehouseLists: [], //库存信息
      filterInputs: "",
      checkDataIdss: [],
      appImeis: [],
      pn: 1,
      all: "", //总页数
      cur: "", //当前页码
      total: "", //总条数
      pageSize: "", //多少一页
      pnj: 1,
      allj: "", //总页数
      curj: "", //当前页码
      totalj: "", //总条数
      pageSizej: "", //多少一页
    };
  },
  watch: {
    // 监视
    cur: function(oldValue, newValue) {
      console.log(arguments);
    },
    curj: function(oldValue, newValue) {
      console.log(arguments);
    },
    checkDataIds: {
      handler() {
        // 数据数组有变化将触发此函数
        if ($("#wrAll").checked) {
          $(".wrIdcheckItem").prop("checked", $(this).prop("checked"));
        } else if (
          $(".wrIdcheckItem:checked").length == $(".wrIdcheckItem").length
        ) {
          $("#wrAll").prop("checked", flag);
        }
      },
      deep: true // 深度监视
    },
    checkDataIdss: {
      handler() {
        // 数据数组有变化将触发此函数
        if ($("#wrAlls").checked) {
          $(".wrIdcheckItems").prop("checked", $(this).prop("checked"));
        } else if (
          $(".wrIdcheckItems:checked").length == $(".wrIdcheckItems").length
        ) {
          $("#wrAlls").prop("checked", flag);
        }

        /*  if (this.checkDataIdss.length == 5) {
          document.querySelector("#wrAlls").checked = true;
        }else if(!$("#wrAlls").checked) {
          document.querySelector("#wrAlls").checked = false;
        } */
      },
      deep: true // 深度监视
    }
  },
  methods: {
    checkAll(e) {
      // 点击全选事件函数
      let checkObj = document.querySelectorAll(".wrIdcheckItem"); // 获取所有checkbox项
      if (e.target.checked) {
        // 判定全选checkbox的勾选状态
        for (let i = 0; i < checkObj.length; i++) {
          if (!checkObj[i].checked) {
            // 将未勾选的checkbox选项push到绑定数组中
            this.checkDataIds.push(checkObj[i].value);
            //  alert($("#"+checkObj[i].value).val());
            this.appImeis.push($("#" + checkObj[i].value).val());
          }
        }
      } else {
        // 如果是去掉全选则清空checkbox选项绑定数组
        this.appImeis = [];
        this.checkDataIds = [];
      }
    },
    checkAlls(e) {
      // 点击全选事件函数
      let checkObj = document.querySelectorAll(".wrIdcheckItems"); // 获取所有checkbox项
      if (e.target.checked) {
        // 判定全选checkbox的勾选状态
        for (let i = 0; i < checkObj.length; i++) {
          if (!checkObj[i].checked) {
            // 将未勾选的checkbox选项push到绑定数组中
            this.checkDataIdss.push(checkObj[i].value);
          }
        }
      } else {
        // 如果是去掉全选则清空checkbox选项绑定数组
        this.checkDataIdss = [];
      }
    },
    //获取库存记录相关信息
    getWarehouseList(pn) {
      this.$axios
        .get("/wareHouseRecords/readWareHouseRecords?typeState=2"+"&pn="+pn)
        .then(response => {
          console.log(response.data.extend.pageInfo.list);

          this.warehouseList = response.data.extend.pageInfo.list;
          
          var listPage = response.data.extend.pageInfo;
          this.all = listPage.pages; //总页数
          this.cur = listPage.pageNum; //当前页码
          this.total = listPage.total;
          this.pageSize = listPage.pageSize;
          /*  for (const iterator of this.warehouseList) {
                    alert(iterator.gunId);
                } */
        });
    }, //进行模糊查询
    filterBy(warehouseList, value) {
      return warehouseList.filter(function(warehouse) {
        return warehouse.gunId.match(value);
      });
    },
    //获取库存记录相关信息
    getWarehouseLists(pnj) {
      this.$axios
        .get("/wareHouseRecords/readWareHouseRecords?typeState=3"+"&pn="+pnj)
        .then(response => {
          console.log(response.data.extend.pageInfo.list);

          this.warehouseLists = response.data.extend.pageInfo.list;
        /*    for (const iterator of this.warehouseLists) {
                    alert(iterator.gunId);
                }  */
        /*   this.warehouseList = response.data.extend.pageInfo.list; */
          var listPage = response.data.extend.pageInfo;
          this.allj = listPage.pages; //总页数
          this.curj = listPage.pageNum; //当前页码
          this.totalj = listPage.total;
          this.pageSizej = listPage.pageSize;
        
        });
    }, //进行模糊查询
    filterBys(warehouseLists, value) {
      return warehouseLists.filter(function(warehouses) {
        return warehouses.gunId.match(value);
      });
    },
    //预入库:单个
    storagePreselected(gunId, appImei) {
      this.$axios
        .post(
          "/wareHouseRecords/createWareHouseRecordsBeforehandStorage?gunId=" +
            gunId +
            "&appImei=" +
            appImei
        )
        .then(response => {
          console.log(response.data);
        });
    },
    //预入库:多个
    storagePreselecteds() {
      if (this.checkDataIds.length < 1) {
        alert("请选择预入库的枪支");
      } else {
        this.$axios
          .post(
            "/wareHouseRecords/revocationWareHouseRecordsStorage?gunId=" +
              this.checkDataIds +
              "&appImei=" +
              appImei
          )
          .then(response => {
            console.log(response.data);
          });
      }
    },

    //确认入库
    affirmStorage(gunId, gunMac, appImei) {
      alert(gunId+"---"+gunMac+"----"+appImei)
      this.$axios
        .delete(
          "/wareHouseRecords/revocationWareHouseRecordsStorage?gunId=" +
            gunId +
            "&appId=" +
            appImei +
            "&gunMac=" +
            gunMac +
            "&state=1"
        )
        .then(response => {
          console.log(response.data);
        });
    },
    //撤销入库
    revocationStorage(gunId, gunMac, appImei) {
      this.$axios
        .delete(
          "/wareHouseRecords/revocationWareHouseRecordsStorage?gunId=" +
            gunId +
            "&appId=" +
            appImei +
            "&gunMac=" +
            gunMac +
            "&state=0"
        )
        .then(response => {
          console.log(response.data);
        });
    },
    //分页
    btnClick: function(data) {
      //页码点击事件
      if (data != this.cur) {
        (this.cur = data), this.getWarehouseList(this.cur);
      }
    },
    pageClick: function() {
      this.getWarehouseList(this.cur);
      console.log("现在在" + this.cur + "页");
    },
     //分页
    btnClickj: function(data) {
      //页码点击事件
      if (data != this.curj) {
        (this.curj = data), this.getWarehouseLists(this.curj);
      }
    },
    pageClickj: function() {
      this.getWarehouseLists(this.curj);
      console.log("现在在" + this.curj + "页");
    },
  },
  created() {
    this.getWarehouseList(this.pn);
    this.getWarehouseLists(this.pnj);
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
    },
      indexsj: function() {
      var left = 1;
      var right = this.allj;
      var ar = [];
      if (this.allj >= 5) {
        if (this.curj > 3 && this.curj < this.allj - 2) {
          left = this.curj - 2;
          right = this.curj + 2;
        } else {
          if (this.curj <= 3) {
            left = 1;
            right = 5;
          } else {
            right = this.allj;
            left = this.allj - 4;
          }
        }
      }
      while (left <= right) {
        ar.push(left);
        left++;
      }
      return ar;
    }
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../../common/css/paging.css"; /*引入公共样式*/
</style>