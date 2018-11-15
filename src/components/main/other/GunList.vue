<!--枪支列表-->

<template>
  <div class="gunList">
      <!-- MAIN CONTENT -->
			<div class="main-content">
				<div class="container-fluid">
					<h3 class="page-title">Tables</h3>
					
					<div class="row">
						<div class="col-md-12">
							<!-- BORDERED TABLE -->
							<div class="panel">
								<div class="panel-heading">
									<h3 class="panel-title">枪支列表</h3>
								</div>
                <div class="col-md-offset-10">
                  <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#exampleModalAdd" @click="createGunS">
                        <i class="fa fa-plus-square"></i> 新增
                  </button>
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
												<th class="text-center">枪支型号</th>
												<th class="text-center">枪支类型</th>
												<th class="text-center">蓝牙编号</th>
												<th class="text-center">库房</th>
												<th class="text-center">创建时间</th>
												<th class="text-center">操作</th>
											</tr>
										</thead>
										<tbody>
											<tr v-for="guns in filterBy(gunList,filterInput)" :key="guns.id">
												<td>
													<input type="checkbox" class="gIdcheckItem" v-bind:value="guns.id" v-model="checkDataIds">
												</td>
												<td class="text-center">{{guns.gunId}}</td>
												<td class="text-center">{{guns.gunModel}}</td>
												<td class="text-center">{{guns.gunType}}</td>
												<td class="text-center">{{guns.gunMac}}</td>
												<td class="text-center">{{guns.warehouseName}}</td>
												<td class="text-center">{{guns.createTime | formatDate}}</td>
												<td class="text-center">
														<!-- Button trigger modal -->
														<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#exampleModal" v-on:click="detailsGun(guns.id)">
															详情
														</button>
														<button type="button" class="btn btn-warning btn-sm" data-toggle="modal" data-target="#exampleModal" v-on:click="updateGunS(guns.id)">
															修改
														</button>
														<button type="button" class="btn btn-danger btn-sm"  v-on:click="deleteGun(guns.id)"><!-- <i class="fa fa-trash-o"></i> -->
															删除
														</button>
														<!-- Button trigger modal -->
												</td>
											</tr>
										</tbody>
									</table>

                  <button type="button" class="btn btn-danger btn-sm" id="batchAllocation" disabled="disabled"  @click="deleteGunAll">
											<i class="fa fa-trash-o"></i> 批量删除
								  </button>

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
				<!-- Select Gun Modal -->
				 <form >
							<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
								<div class="modal-dialog" role="document">
									<div class="modal-content">
										<div class="modal-header">
											<h5 class="modal-title" id="exampleModalLabel">{{headlineGun}}</h5>
											<button type="button" class="close" data-dismiss="modal" aria-label="Close">
												<span aria-hidden="true">&times;</span>
											</button>
										</div>
										<div class="modal-body">
										
											<form class="form-horizontal">
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">枪支编号</label>
													<div class="col-sm-6">
														<input class="form-control" type="hidden" id="formGroupInputSmall"  placeholder="" v-model="gun.id">
														<input class="form-control" type="hidden" id="formGroupInputSmall"  placeholder="" v-model="gun.version">
														<input class="form-control" type="text" id="formGroupInputSmall"  placeholder="枪支编号" v-model="gun.gunId">
														<input class="form-control" type="hidden" id="formGroupInputSmall"  placeholder="枪支编号" v-model="gun.uid">
														<input class="form-control" type="hidden" id="formGroupInputSmall"  placeholder="枪支编号" v-model="gun.isDel">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">枪支型号</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="枪支型号"  v-model="gun.gunModel">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">枪支类型</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="枪支类型"  v-model="gun.gunType">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">蓝牙编号</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="蓝牙编号" v-model="gun.gunMac">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">库室</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="库室"  v-model="gun.warehouseId">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">库房名称</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="库房名称" v-model="gun.warehouseName">
													</div>
												</div>
												<div v-show="isShowTime" class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">创建时间</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="创建时间" v-model="gun.createTime">
													</div>
												</div>
												<div v-show="isShowTime" class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">更新时间</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="更新时间"  v-model="gun.updateTime">
													</div>
												</div>
											</form>

										</div>
										<div class="modal-footer">
											<button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
											<button v-show="isShow" type="button" class="btn btn-primary" @click="updateGun">确认</button>
										</div>
									</div>
								</div>
							</div>
						</form>	
				<!-- Modal -->

				<!-- Add Gun Modal -->
				 <form >
							<div class="modal fade" id="exampleModalAdd" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
								<div class="modal-dialog" role="document">
									<div class="modal-content">
										<div class="modal-header">
											<h5 class="modal-title" id="exampleModalLabel">{{headlineGun}}</h5>
											<button type="button" class="close" data-dismiss="modal" aria-label="Close">
												<span aria-hidden="true">&times;</span>
											</button>
										</div>
										<div class="modal-body">
											<form class="form-horizontal">
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">枪支编号</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall"  placeholder="枪支编号" ref="gunId">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">枪支型号</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="枪支型号"  ref="gunModel">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">枪支类型</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="枪支类型"  ref="gunType">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">蓝牙编号</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="蓝牙编号" ref="gunMac">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">库室</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="库室"  ref="warehouseId">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">库房名称</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="库房名称" ref="warehouseName">
													</div>
												</div>
											</form>
										</div>
										<div class="modal-footer">
											<button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
											<button type="button" class="btn btn-primary" @click="createGun">提交</button>
										</div>
									</div>
								</div>
							</div>
						</form>	
				<!-- Modal -->

				  
  </div>
</template>

<script>
import { formatDate } from "../../common/js/formatDate.js";
import qs from "qs";
export default {
  name: "GunList",
  data() {
    return {
      gunList: [],
      filterInput: "",
      gun: "",
      gunAdd: "",
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
        if(this.checkDataIds.length==0){
          $("#batchAllocation").attr('disabled', 'disabled');
        }else{
          $("#batchAllocation").removeAttr('disabled');
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
          $(".gIdcheckItem").prop("checked", $(this).prop("checked"));
        } else if (
          $(".gIdcheckItem:checked").length == $(".gIdcheckItem").length
        ) {
          $("#cAll").prop("checked", flag);
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
    getGunLists(pn) {
      this.$axios.get("/gun/readGunList?pn=" + pn).then(response => {
        //console.log(response.data);
        this.gunList = response.data.extend.pageInfo.list;
        var listPage = response.data.extend.pageInfo;
        this.all = listPage.pages; //总页数
        this.cur = listPage.pageNum; //当前页码
        this.total = listPage.total;
        this.pageSize = listPage.pageSize;
      });
    },
    //进行模糊查询
    filterBy(gunList, value) {
      return gunList.filter(function(guns) {
        return guns.gunId.match(value);
      });
    },
    //查看枪支详情
    detailsGun(id) {
      this.isShow = false;
      this.isShowTime = true;
      this.$axios.get("/gun/readGun?gunId=" + id).then(response => {
        //console.log(response.data.extend.getGun);
        this.gun = response.data.extend.getGun;
        for (var js2 in this.gun) {
          var dateCreate = new Date(this.gun.createTime);
          var dateUpdate = new Date(this.gun.updateTime);
          this.gun.createTime = formatDate(dateCreate, "yyyy-MM-dd hh:mm:ss");
          this.gun.updateTime = formatDate(dateUpdate, "yyyy-MM-dd hh:mm:ss");
          //alert( js2+"="+this.gun[js2]);
        }
        this.headlineGun = "枪支详细";
      });
    },
    //查看枪支详情,进行修改
    updateGunS(id) {
      this.isShow = true;
      this.isShowTime = false;
      this.$axios.get("/gun/readGun?gunId=" + id).then(response => {
        //console.log(response.data.extend.getGun);
        this.gun = response.data.extend.getGun;
        this.headlineGun = "修改枪支信息";
      });
    },
    //修改枪支信息
    updateGun(e) {
      if (!this.gun.gunId || !this.gun.gunModel || !this.gun.gunType) {
        alert("请添加对应的信息!");
        // console.log("请添加对应的信息!");
      } else {
        var qs = require("qs");
        let params = new URLSearchParams();
          params.append("id", this.gun.id),
          params.append("uid", this.gun.uid),
          params.append("isDel", this.gun.isDel),
          params.append("gunId", this.gun.gunId),
          params.append("gunModel", this.gun.gunModel),
          params.append("gunType", this.gun.gunType),
          params.append("gunMac", this.gun.gunMac),
          params.append("warehouseId", this.gun.warehouseId),
          params.append("warehouseName", this.gun.warehouseName),
          params.append("version", this.gun.version);

        this.$axios
          .put("/gun/updateGun", params)
          .then(response => {
            if (response.data.status == "1000") {
              $("#exampleModal").modal("hide");
              this.getGunLists(this.cur);
              alert(response.data.errorMessage);
            }
          })
          .catch(error => {
            console.log("error", error);
            return error;
          });
        e.preventDefault();
      }
      e.preventDefault();
    },
    //删除枪支信息
    deleteGun(id) {
      this.$axios
        .delete("/gun/deleteGun?gunId=" + id + "&type=" + 1)
        .then(response => {
          console.log(response.data);
          this.getGunLists(this.cur);
        });
    },
    deleteGunAll() {
      if (this.checkDataIds < 1) {
        alert("请勾选您要删除的信息");
      } else {
        this.$axios
          .delete("/gun/deleteGun?gunId=" + this.checkDataIds + "&type=" + 1)
          .then(response => {
            console.log(response.data);
            this.getGunLists(this.cur);
          });
      }
    },
    //重置表单数据
    reset_from(ele){
         //重置表单内容
        $(ele)[0].reset();
    },
    //新增过度开启
    createGunS() {
      this.isShow = false;
      this.isShowTime = false;
      this.headlineGun = "新增枪支信息";
      this.reset_from("#exampleModalAdd form");
    },
    //新增枪支信息
    createGun(e) {
      if (
        !this.$refs.gunId.value ||
        !this.$refs.gunModel.value ||
        !this.$refs.gunType.value
      ) {
        alert("请添加对应的信息!");
      } else {
        var qs = require("qs");
        let params = new URLSearchParams();
          params.append("gunId", this.$refs.gunId.value),
          params.append("gunModel", this.$refs.gunModel.value),
          params.append("gunType", this.$refs.gunType.value),
          params.append("gunMac", this.$refs.gunMac.value),
          params.append("warehouseId", this.$refs.warehouseId.value),
          params.append("warehouseName", this.$refs.warehouseName.value);

        this.$axios
          .post("/gun/createGun", params)
          .then(response => {
            console.log(response.data);
            if (response.data.status == "1000") {
              $("#exampleModalAdd").modal("hide");
              this.getGunLists(this.cur);
              alert(response.data.errorMessage);
            } else if (response.data.status == "1001") {
              alert(response.data.errorMessage);
            } else {
              alert(response.data.errorMessage);
            }
          })
          .catch(error => {
            console.log("error", error);
            return error;
          });
        e.preventDefault();
      }
      e.preventDefault();
    },
    //分页
    btnClick: function(data) {
      //页码点击事件
      if (data != this.cur) {
        (this.cur = data), this.getGunLists(this.cur);
      }
    },
    pageClick: function() {
      this.getGunLists(this.cur);
      console.log("现在在" + this.cur + "页");
    }
  },
  //进入页面就进行显示
  created() {
    this.getGunLists(this.pn);
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
