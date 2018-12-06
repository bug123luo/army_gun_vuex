<!--枪支列表-->

<template>
  <div class="projectileBase">
      <!-- MAIN CONTENT -->
			<div class="main-content">
				<div class="container-fluid">
				<!-- 	<h3 class="page-title">Tables</h3> -->
					
					<div class="row">
						<div class="col-md-12">
							<!-- BORDERED TABLE -->
							<div class="panel">
								<div class="panel-heading">
									<h3 class="panel-title">{{ $route.name}}</h3>
								</div>
                
                <div class="col-md-offset-10">
                
								</div>

								<div class="panel-body">
									<input type="text" class="form-control" placeholder="搜索" v-model="filterInput">
									<table class="table table-bordered">
										<thead>
											<tr>
												<th >
													<input  id="cAll" type="checkbox" @click="checkAll($event)">
												</th>
												<th class="text-center">枪支编号</th>
												<th class="text-center">枪支IMEI</th>
												<th class="text-center">设备号</th>
												<th class="text-center">设备IMEI</th>
												<th class="text-center">创建时间</th>
												<th class="text-center">操作</th>
											</tr>
										</thead>
										<tbody>
											<tr v-for="whrs in filterBy(wareHouseRecordList,filterInput)" :key="whrs.id">
												<td>
													<input type="checkbox" class="gIdcheckItem" v-bind:value="whrs.id" v-model="checkDataIds">
												</td>
												<td class="text-center">{{whrs.guns.gunId}}</td>
												<td class="text-center">{{whrs.guns.gunImei}}</td>
												<td class="text-center">{{whrs.apps.appName}}</td>
												<td class="text-center">{{whrs.apps.appImei}}</td>
												<td class="text-center">{{whrs.cancelTime | formatDate}}</td>
												<td class="text-center">
														<!-- Button trigger modal -->
													  <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#exampleModal" v-on:click="getProjectileBase(whrs.apps.id,whrs.guns.gunId)">
															申请射弹计数
														</button>
                            <!--
														<button type="button" class="btn btn-warning btn-sm" data-toggle="modal" data-target="#exampleModal" v-on:click="updateGunS(guns.id)">
															修改
														</button>
														<button type="button" class="btn btn-danger btn-sm"  v-on:click="deleteGun(guns.id,guns.gunId)">
															删除
														</button> -->
														<!-- Button trigger modal -->
												</td>
											</tr>
										</tbody>
									</table>
                  <div class="text-center"  v-show="total==0"> <span style="color:orange"> 暂无数据...... </span> </div>


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
							<!-- END BORDERED TABLE -->
						</div>
					</div>
				</div>
			</div>

			
				<!-- END MAIN CONTENT -->

				
  </div>
</template>

<script>
import { formatDate } from "../../common/js/formatDate.js";
import qs from "qs";
export default {
  name: "ProjectileBase",
  data() {
    return {
      wareHouseRecordList: [],
      filterInput: "", 
      wareHouseRecord: "",
      headlineGun: "",
      isShow: false,
      isShowTime: false,
      checkDataIds: [], //将多个选中的复选框，绑定到同个数组中
      pn: 1,
      all: "", //总页数
      cur: "", //当前页码
      total: "", //总条数
      pageSize: "" //多少一页
    };
  },
  watch: {
    // 监视双向绑定的数据数组
    checkDataIds: {
      handler() {
        if (this.checkDataIds.length == 0) {
          $("#batchAllocation").attr("disabled", "disabled");
        } else {
          $("#batchAllocation").removeAttr("disabled");
        }
        // 数据数组有变化将触发此函数
        /*   if (this.checkDataIds.length == 4) {
          document.querySelector("#cAll").checked = true;
        } else {
          document.querySelector("#cAll").checked = false;
				}
				 */
        // 数据数组有变化将触发此函数
        if ($("#cAll").checked) {
          alert(123);
          $(".gIdcheckItem").prop("checked", $(this).prop("checked"));
        }else if(this.checkDataIds.length <  $(".gIdcheckItem").length){
                    $("#cAll").prop("checked", false);
        } else if (
          $(".gIdcheckItem:checked").length == $(".gIdcheckItem").length
        ) {
            $("#cAll").prop("checked", true);
        }
      },
      deep: true // 深度监视
    },
    // 监视
    cur: function(oldValue, newValue) {
      console.log(arguments);
    }
  },
  methods: {
    checkAll(e) {
      // 点击全选事件函数
      let checkObj = document.querySelectorAll(".gIdcheckItem"); // 获取所有checkbox项
      if (e.target.checked) {
        // 判定全选checkbox的勾选状态
        for (let i = 0; i < checkObj.length; i++) {
          if (!checkObj[i].checked) {
            // 将未勾选的checkbox选项push到绑定数组中
            this.checkDataIds.push(checkObj[i].value);
          }
        }
      } else {
        // 如果是去掉全选则清空checkbox选项绑定数组
        this.checkDataIds = [];
      }
    },
    //查询枪支列表
    getWareHouseRecordLists(pn) {
      this.$axios.get("/wareHouseRecords/readWareHouseRecordsByDelivery?pn=" + pn).then(response => {
        //console.log(response.data);
        this.wareHouseRecordList = response.data.extend.pageInfo.list;
        var listPage = response.data.extend.pageInfo;
        this.all = listPage.pages; //总页数
        this.cur = listPage.pageNum; //当前页码
        this.total = listPage.total;
        this.pageSize = listPage.pageSize;
      });
    },
    //进行模糊查询
    filterBy(wareHouseRecordList, value) {
      return wareHouseRecordList.filter(function(guns) {
        return guns.gunId.match(value);
      });
    },
    //申请射弹计算
    getProjectileBase(appId,gunId){
        this.$axios.get("/wareHouseRecords/theProjectileBase?appId="+appId+"&gunId="+gunId).then(response => {
           if (response.data.status == "1000") {
                  Lobibox.notify("success", {
                    size: "mini",
                    msg: response.data.errorMessage
                  });
                } else {
                  Lobibox.notify("error", {
                    size: "mini",
                    msg: response.data.errorMessage
                  });
                }
        })
    },
    //重置表单数据
    reset_from(ele) {
      //重置表单内容
      $(ele)[0].reset();
    },
    
    //分页
    btnClick: function(data) {
      //页码点击事件
      if (data != this.cur) {
        (this.cur = data), this.getWareHouseRecordLists(this.cur);
      }
    },
    pageClick: function() {
      this.getWareHouseRecordLists(this.cur);
      console.log("现在在" + this.cur + "页");
    }
  },
  //进入页面就进行显示
  created() {
    this.getWareHouseRecordLists(this.pn);
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
