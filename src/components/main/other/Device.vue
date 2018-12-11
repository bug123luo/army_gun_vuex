<!--设备-->
<template>
  <div class="gunList">
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
												<th class="text-center">设备名称</th>
												<th class="text-center">IMEI</th>
												<th class="text-center">设备电话</th>
												<th class="text-center">设备类型</th>
												<th class="text-center">操作</th>
											</tr>
										</thead>
										<tbody>
											<tr v-for="apps in filterBy(appList,filterInput)" :key="apps.id">
												<td>
													<input type="checkbox" class="gIdcheckItem" v-bind:value="apps.id" v-model="checkDataIds">
												</td>
												<td class="text-center">{{apps.appName}}</td>
												<td class="text-center">{{apps.appImei}}</td>
												<td class="text-center">{{apps.appPhone}}</td>
												<td class="text-center">{{apps.appType}}</td>
												<td class="text-center">
														<!-- Button trigger modal  -->
														<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#exampleModalParameter" v-on:click="setUpParametersS(apps.appImei)">
															设置参数
														</button>
														<button type="button" class="btn btn-warning btn-sm" data-toggle="modal" data-target="#exampleModal" v-on:click="updateAppS(apps.id)">
															修改
														</button>
														<!-- <button type="button" class="btn btn-danger btn-sm"  v-on:click="deleteGun(guns.id,guns.gunId)">
															删除
														</button> -->
														<!-- Button trigger modal -->
												</td>
											</tr>
										</tbody>
									</table>

                  <button type="button" v-show="total!=0"  class="btn btn-danger btn-sm" id="batchAllocation" disabled="disabled"  @click="deleteGunAll">
											<i class="fa fa-trash-o"></i> 批量删除
								  </button>
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
				<!-- Select Gun Modal -->
				 <form >
							<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
								<div class="modal-dialog" role="document">
									<div class="modal-content">
										<div class="modal-header">
											<h5 class="modal-title" id="exampleModalLabel">{{headlineApp}}</h5>
											<button type="button" class="close" data-dismiss="modal" aria-label="Close">
												<span aria-hidden="true">&times;</span>
											</button>
										</div>
										<div class="modal-body">
										
											<form class="form-horizontal">
                                                <input class="form-control" type="hidden" id="formGroupInputSmall"  placeholder="" v-model="app.id">
                                                <input class="form-control" type="hidden" id="formGroupInputSmall"  placeholder="" v-model="app.version">
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">设备系统</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall"  placeholder="设备系统" v-model="app.appSystem">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">设备系统版本</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="设备系统版本"  v-model="app.appSystemVersion">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">设备名</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="设备名"  v-model="app.appPhoneTypeName">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">设备名字</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="设备名字" v-model="app.appName">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">设备蓝牙号</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="设备蓝牙号"  v-model="app.appMac">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">IMEI号</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="IMEI号" v-model="app.appImei">
													</div>
												</div>
                                                <div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">设备电话</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="设备电话" v-model="app.appPhone">
													</div>
												</div>
                                                <div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">可识别号</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="可识别号" v-model="app.appReadableCode">
													</div>
												</div>
                                                <div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">设备类型</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="设备类型" v-model="app.appType">
													</div>
												</div>
											</form>

										</div>
										<div class="modal-footer">
											<button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
											<button v-show="isShow" type="button" class="btn btn-primary" @click="updateApp">确认</button>
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
											<h5 class="modal-title" id="exampleModalLabel">{{headlineApp}}</h5>
											<button type="button" class="close" data-dismiss="modal" aria-label="Close">
												<span aria-hidden="true">&times;</span>
											</button>
										</div>
										<div class="modal-body">
											<form class="form-horizontal">
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">设备系统</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall"  placeholder="设备系统" ref="appSystem">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">设备系统版本</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="设备系统版本"  ref="appSystemVersion">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">设备名</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="设备名"  ref="appPhoneTypeName">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">设备名字</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="设备名字" ref="appName">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">设备蓝牙号</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="设备蓝牙号"  ref="appMac">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">IMEI号</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="IMEI号" ref="appImei">
													</div>
												</div>
                                                <div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">设备电话</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="设备电话" ref="appPhone">
													</div>
												</div>
                                                <div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">可识别号</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="可识别号" ref="appReadableCode">
													</div>
												</div>
                                                <div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">设备类型</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" placeholder="设备类型" ref="appType">
													</div>
												</div>
											</form>
										</div>
										<div class="modal-footer">
											<button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
											<button type="button" class="btn btn-primary" @click="createApp">提交</button>
										</div>
									</div>
								</div>
							</div>
						</form>	
				<!-- Modal -->


			<!-- Add Gun Modal -->
				 <form >
							<div class="modal fade" id="exampleModalParameter" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
								<div class="modal-dialog" role="document">
									<div class="modal-content">
										<div class="modal-header">
											<h5 class="modal-title" id="exampleModalLabel">设置参数</h5>
											<button type="button" class="close" data-dismiss="modal" aria-label="Close">
												<span aria-hidden="true">&times;</span>
											</button>
										</div>
										<div class="modal-body">
											<form class="form-horizontal">
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">电量报警级别</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall"  onkeyup="this.value=this.value.replace(/[^-\d\.]/ig,'')" value="12"  ref="powerAlarmLevel">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">发射功率</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" onkeyup="this.value=this.value.replace(/[^-\d\.]/ig,'')" value="12"   ref="transmittingPower">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">广播间隔</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" onkeyup="this.value=this.value.replace(/[^-\d\.]/ig,'')" value="12"   ref="broadcastInterval">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">连接间隔</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" onkeyup="this.value=this.value.replace(/[^-\d\.]/ig,'')" value="12"  ref="connectionInterval">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">连接超时</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" onkeyup="this.value=this.value.replace(/[^-\d\.]/ig,'')" value="12"   ref="connectionTimeout">
													</div>
												</div>
												<div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">软硬件版本</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" onkeyup="this.value=this.value.replace(/[^-\d\.]/ig,'')" value="12"  ref="softwareDeviceVersion">
													</div>
												</div>
                                                <div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">心跳间隔</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" onkeyup="this.value=this.value.replace(/[^-\d\.]/ig,'')" value="12"  ref="heartbeat">
													</div>
												</div>
                                                <div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">电量采样间隔</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" onkeyup="this.value=this.value.replace(/[^-\d\.]/ig,'')" value="12"   ref="powerSampling">
													</div>
												</div>
                         <div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">匹配最大时间</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" onkeyup="this.value=this.value.replace(/[^-\d\.]/ig,'')" value="12"  placeholder="匹配最大时间" ref="matchTime">
													</div>
												</div>
                         <div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">定位间隔</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" onkeyup="this.value=this.value.replace(/[^-\d\.]/ig,'')" value="12"  ref="positioningInterval">
													</div>
												</div>
                           <div class="form-group form-group-sm">
													<label class="col-sm-2 control-label" for="formGroupInputSmall">安全字</label>
													<div class="col-sm-6">
														<input class="form-control" type="text" id="formGroupInputSmall" onkeyup="this.value=this.value.replace(/[^-\d\.]/ig,'')" value="12" ref="safeCode">
													</div>
												</div>

                        
											</form>
										</div>
										<div class="modal-footer">
											<button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
											<button type="button" class="btn btn-primary"  v-on:click="setUpParameters()">推送设置</button>
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
      appList: [],
      filterInput: "",
      app: "",
      gunAdd: "",
      headlineApp: "",
      isShow: false,
      isShowTime: false,
      appImei:"",
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
    getAppLists(pn) {
      this.$axios.get("/app/readAppList?pn=" + pn).then(response => {
        //console.log(response.data.extend.pageInfo.list);
        this.appList = response.data.extend.pageInfo.list;
        for (const key in  this.appList) {
          this.appList[key].appType=(this.appList[key].appType)==0?"腕表":"手机";
        }
        var listPage = response.data.extend.pageInfo;
        this.all = listPage.pages; //总页数
        this.cur = listPage.pageNum; //当前页码
        this.total = listPage.total;
        this.pageSize = listPage.pageSize;
      });
    },
    //进行模糊查询
    filterBy(appList, value) {
      return appList.filter(function(apps) {
        return apps.appName.match(value);
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
        this.headlineApp = "枪支详细";
      });
    },
    //查看枪支详情,进行修改
    updateAppS(id) {
      this.isShow = true;
      this.isShowTime = false;
      this.$axios.get("/app/readApp?appId=" + id).then(response => {
        this.app = response.data.extend.getapp;
        this.headlineApp = "修改设备信息";
      });
    },
    //修改枪支信息
    updateApp(e) {
      if (!this.app.appSystem || !this.app.appSystemVersion || !this.app.appPhoneTypeName) {
        layer.alert("请添加对应的信息!");
        // console.log("请添加对应的信息!");
      } else {
        var qs = require("qs");
        let params = new URLSearchParams();
          params.append("id", this.app.id),
          params.append("appSystem", this.app.appSystem),
          params.append("appSystemVersion", this.app.appSystemVersion),
          params.append("appPhoneTypeName", this.app.appPhoneTypeName),
          params.append("appName", this.app.appName),
          params.append("appMac", this.app.appMac),
          params.append("appImei", this.app.appImei),
          params.append("appPhone", this.app.appPhone),
          params.append("appReadableCode", this.app.appReadableCode),
          params.append("appType", this.app.appType);
          params.append("version", this.app.version);

        this.$axios
          .put("/app/updateApp", params)
          .then(response => {
            if (response.data.status == "1000") {
              $("#exampleModal").modal("hide");
              this.getAppLists(this.cur);
              Lobibox.notify("success", {
                size: "mini",
                msg: response.data.errorMessage
              });
            } else {
              layer.alert(response.data.errorMessage, {
                icon: 2,
                skin: "layer-ext-moon"
              });
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
    deleteGun(id, gunId) {
      let _this = this;
      //询问框
      layer.confirm(
        "确定要[" + gunId + "]删除？",
        {
          btn: ["确定", "取消"] //按钮
        },
        function() {
          _this.$axios
            .delete("/gun/deleteGun?gunId=" + id + "&type=" + 1)
            .then(response => {
              var data = response.data;
              if (response.data.status == "1000") {
                $("#batchAllocation").attr("disabled", "disabled");
                 _this.checkDataIds = [];
                 _this.getAppLists(_this.cur);
                 $(".gIdcheckItem:checked").prop("checked", false);
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
              // console.log(response.data);
              layer.msg("删除成功", {
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
    }, //批量删除
    deleteGunAll() {
      let _this = this;
      if (_this.checkDataIds < 1) {
        layer.alert("请勾选您要删除的信息", {
          icon: 3,
          skin: "layer-ext-moon"
        });
      } else {
        layer.confirm(
          "确定要[" + _this.checkDataIds + "]删除？",
          {
            btn: ["确定", "取消"] //按钮
          },
          function() {
            _this.$axios
              .delete("/gun/deleteGun?gunId="+_this.checkDataIds+"&type=1")
              .then(response => {
                var data = response.data;
                if (response.data.status == "1000") {
                  _this.getAppLists(_this.cur);
                  $("#batchAllocation").attr("disabled", "disabled");
                  _this.checkDataIds = [];
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
                // console.log(response.data);
                layer.msg("删除成功", {
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

        /*   this.$axios
          .delete("/gun/deleteGun?gunId=" + this.checkDataIds + "&type=" + 1)
          .then(response => {
            console.log(response.data);
            this.getGunLists(this.cur);
          }); */
      }
    },
    //重置表单数据
    reset_from(ele) {
      //重置表单内容
      $(ele)[0].reset();
    },
    //新增过度开启
    createGunS() {
      this.isShow = false;
      this.isShowTime = false;
      this.headlineApp = "新增枪支信息";
      this.reset_from("#exampleModalAdd form");
    },
    //新增设备信息
    createApp(e) {
      let _this=this;
      if (
        !_this.$refs.appSystem.value ||
        !_this.$refs.appSystemVersion.value ||
        !_this.$refs.appPhoneTypeName.value
      ) {
        layer.alert("请添加对应的信息!");
      } else {
        var qs = require("qs");
        let params = new URLSearchParams();
          params.append("appSystem", _this.$refs.appSystem.value),
          params.append("appSystemVersion", _this.$refs.appSystemVersion.value),
          params.append("appPhoneTypeName", _this.$refs.appPhoneTypeName.value),
          params.append("appName", _this.$refs.appName.value),
          params.append("appMac", _this.$refs.appMac.value),
          params.append("appImei", _this.$refs.appImei.value);
          params.append("appPhone", _this.$refs.appPhone.value);
          params.append("appReadableCode", _this.$refs.appReadableCode.value);
          params.append("appType", _this.$refs.appType.value);

        _this.$axios
          .post("/app/createApp", params)
          .then(response => {
            console.log(response.data);
            if (response.data.status == "1000") {
              $("#exampleModalAdd").modal("hide");
              _this.getAppLists(_this.cur);
              Lobibox.notify("success", {
                size: "mini",
                msg: response.data.errorMessage
              });
            } else if (response.data.status == "1001") {
              layer.msg(response.data.errorMessage,{icon:3})
              /* Lobibox.notify("error", {
                size: "mini",
                msg: response.data.errorMessage
              }); */
            } else {
              layer.msg(response.data.errorMessage,{icon:3})
             /*  Lobibox.notify("warning", {
                size: "mini",
                msg: response.data.errorMessage
              }); */
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
    setUpParametersS(appImei){
      let _this=this;
      this.reset_from("#exampleModalParameter form");
      _this.appImei="",
      _this.appImei=appImei;
    },
    //设置参数
    setUpParameters(){
         let _this=this;
         let params = new URLSearchParams();
         var powerAlarmLevel=_this.$refs.powerAlarmLevel.value;
         var transmittingPower=_this.$refs.transmittingPower.value;
         var broadcastInterval=_this.$refs.broadcastInterval.value;
         var connectionInterval=_this.$refs.connectionInterval.value;
         var connectionTimeout=_this.$refs.connectionTimeout.value;
         var softwareDeviceVersion=_this.$refs.softwareDeviceVersion.value;
         var heartbeat=_this.$refs.heartbeat.value;
         var powerSampling=_this.$refs.powerSampling.value;
         var matchTime=_this.$refs.matchTime.value;
         var positioningInterval=_this.$refs.positioningInterval.value;
         var safeCode=_this.$refs.safeCode.value;
         //判断
         if(!powerAlarmLevel || !transmittingPower || !broadcastInterval|| !connectionInterval|| !connectionTimeout
         || !softwareDeviceVersion || !heartbeat|| !powerSampling|| !matchTime|| !positioningInterval|| !safeCode){
           layer.msg("推送参数不能有空值");
         }else{
       
          params.append("powerAlarmLevel", powerAlarmLevel),
          params.append("transmittingPower", transmittingPower),
          params.append("broadcastInterval", broadcastInterval),
          params.append("connectionInterval",connectionInterval),
          params.append("connectionTimeout",connectionTimeout),
          params.append("softwareDeviceVersion",softwareDeviceVersion),
          params.append("heartbeat", heartbeat),
          params.append("powerSampling", powerSampling),
          params.append("matchTime", matchTime),
          params.append("positioningInterval", positioningInterval);
          params.append("safeCode", safeCode);
          }

          layer.confirm( "确定要参数设置正确？",
          {
            btn: ["确定", "取消"] //按钮
          },
          function() {
            _this.$axios.post('/app/appSetUpParameters?appImei='+_this.appImei,params).then(response =>{
                if (response.data.status == "1000") {
                  $("#exampleModalParameter").modal("hide");
                  Lobibox.notify("success", {
                    size: "mini",
                    msg: response.data.errorMessage
                  });
                   // console.log(response.data);
                layer.msg("推送成功", {
                  time: 500 //0.5s后自动关闭
                });
                } else if (response.data.status == "1001") {
                  layer.msg(response.data.errorMessage,{icon:3})
                } else {
                  layer.msg(response.data.errorMessage,{icon:3})
                }
            });
            }, function() {
            layer.msg("取消成功", {
              time: 500 //0.5s后自动关闭
            });
           }
         );

    },
    //分页
    btnClick: function(data) {
      //页码点击事件
      if (data != this.cur) {
        (this.cur = data), this.getAppLists(this.cur);
      }
    },
    pageClick: function() {
      this.getAppLists(this.cur);
      console.log("现在在" + this.cur + "页");
    }
  },
  //进入页面就进行显示
  created() {
    this.getAppLists(this.pn);
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
