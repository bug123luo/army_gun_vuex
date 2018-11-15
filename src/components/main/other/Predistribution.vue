<!--枪支预分配-->
<template>
  <div class="predistribution">
<!-- MAIN CONTENT -->
			<div class="main-content">
				<div class="container-fluid">
					<h3 class="page-title">枪支出库操作</h3>
					<div class="row">
						
					<div class="col-md-12">
							<!-- TASKS -->
							<div class="panel">
								<div class="panel-heading">
									<h3 class="panel-title">枪支分配列表</h3>
									<div class="right">
										<button type="button" class="btn-toggle-collapse"><i class="lnr lnr-chevron-up"></i></button>
										<button type="button" class="btn-remove"><i class="lnr lnr-cross"></i></button>
									</div>
								</div>
								<div class="panel-body">
									<table class="table table-bordered">
										<thead>
											<tr>
												<th >#</th>
												<th class="text-center">设备名称</th>
												<th class="text-center">绑定枪支数目</th>
												<th class="text-center">操作</th>
											</tr>
										</thead>
										<tbody>
											
											<tr v-for="(appsP,index) in filterByPreselected(appListPreselected,filterInputPreselected)" :key="">
												<td style="width:63px"><span>{{index+1}}</span></td>
												<td class="text-center">{{appsP.appName}}</td>
												<td class="text-center">{{appsP.counts}}</td>
												<td class="text-center">
                                                    <!-- Button trigger modal -->
                                                    <button type="button" class="btn btn-primary btn-sm"  v-on:click="distributionStorage(appsP.appId)">
                                                        预出库
                                                    </button>
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
  name: "Predistribution",
  data() {
    return {
      filterInputPreselected: "",
      appListPreselected: [],
      pn: 1,
      all: "", //总页数
      cur: "", //当前页码
      total: "", //总条数
      pageSize: "" //多少一页
    };
  },
  watch: {
    // 监视
    cur: function(oldValue, newValue) {
      console.log(arguments);
    }
  },
  methods: {
    //查询所有可以进行预出库的枪支
    getAppListPreselected(pn) {
      this.$axios.get("/appGun/readAppGunBinding?pn="+pn).then(response => {
        console.log(response.data.extend.pageInfo.list);
        this.appListPreselected = response.data.extend.pageInfo.list;
         var listPage = response.data.extend.pageInfo;
        this.all = listPage.pages; //总页数
        this.cur = listPage.pageNum; //当前页码
        this.total = listPage.total;
        this.pageSize = listPage.pageSize;
      });
    },
    //进行模糊查询
    filterByPreselected(appListPreselected, value) {
      return appListPreselected.filter(function(appsP) {
        return appsP.appName.match(value);
      });
    },
    //枪支预出库
    distributionStorage(appId) {
        this.$axios
          .post(
            "/wareHouseRecords/createDeviceBindingGunsBeforehandDelivery?appId=" +
              appId +
              "&type=5"
          )
          .then(response => {
            console.log(response.data);
          });
      },
       //分页
    btnClick: function(data) {
      //页码点击事件
      if (data != this.cur) {
        (this.cur = data), this.getAppListPreselected(this.cur);
      }
    },
    pageClick: function() {
      this.getAppListPreselected(this.cur);
      console.log("现在在" + this.cur + "页");
    }
  },
  created() {
    this.getAppListPreselected(this.pn);
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