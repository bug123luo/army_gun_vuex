<!--警告信息-->
<template>
  <div class="sosMessage">
       <div class="main-content">
           <div class="container-fluid">
           <!--  <h3 class="page-title">Tables</h3> -->
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
                                       <!--  <th ><input  id="cAll" type="checkbox" @click="checkAll($event)"></th> -->
                                        <th >#</th>
                                        <th class="text-center">枪支蓝牙</th>
                                        <th class="text-center">设备编号</th>
                                        <th class="text-center">上报时间</th>
                                        <th class="text-center">处理状态</th>
                                        <th class="text-center">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(sosMessage,index) in filterBy(sosMessageList,filterInput)" :key="sosMessage.id">
<!--                                    <td><input type="checkbox" class="gIdcheckItem" v-bind:value="sosMessage.id" v-model="checkDataIds"> </td>-->                                   
                                        <td style="width:63px">{{index+1}}</td>
                                        <td class="text-center">{{sosMessage.gunMac}}</td>
                                        <td class="text-center">{{sosMessage.guns.gunId}}</td>
                                        <td class="text-center">{{sosMessage.sosTime | formatDate}}</td>
                                        <td class="text-center">{{sosMessage.state}}</td>
                                       
                                        <td class="text-center">
                                                <!-- Button trigger modal -->
                                                <router-link :to="{name:'findMap',params:{sosId:sosMessage.id,log:sosMessage.longitude,lat:sosMessage.latitude,type:1}}" tag="button" class="btn btn-warning btn-sm">
                                                  位置详情
                                                </router-link>
                                                <router-link  v-if="(sosMessage.gunMac=='')"  :to="{name:'findMap',params:{sosId:sosMessage.id,log:sosMessage.longitude,lat:sosMessage.latitude,type:3}}" tag="button" class="btn btn-danger btn-sm">
                                                  紧急支援
                                                </router-link>
                                                <router-link  v-else :to="{name:'findMap',params:{sosId:sosMessage.id,log:sosMessage.longitude,lat:sosMessage.latitude,type:2}}" tag="button" class="btn btn-primary btn-sm">
                                                  协助查找
                                                </router-link>
                                                
                                                <!-- Button trigger modal -->
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                          <!--   <button type="button" class="btn btn-danger btn-sm" id="batchAllocation" disabled="disabled"  @click="">
                                        <i class="fa fa-trash-o"></i> 批量删除
                            </button> -->

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
  </div>
</template>

<script>
import { formatDate } from "../../common/js/formatDate.js";
export default {
  name: "SosMessage",
  data() {
    return {
      filterInput: "",
      checkDataIds: [], //将多个选中的复选框，绑定到同个数组中
      sosMessageList:[],
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
        if ($("#cAll").checked) {
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
    },
  },
  methods:{
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
    //获取位置
    getLocation(lng,lat){
       this.$axios.get('/locationUtil/getLocation?lng='+lng+"&lat="+lat).then(response => {
                    layer.alert(response.data.extend.realLocations);
       })            
    },
     //查询枪支列表
    getSosMessageLists(pn) {
      this.$axios.get("/sosMessage/readSosMessageList?pn=" + pn).then(response => {
        console.log(response.data);
        this.sosMessageList = response.data.extend.pageInfo.list;
        var listPage = response.data.extend.pageInfo;
        this.all = listPage.pages; //总页数
        this.cur = listPage.pageNum; //当前页码
        this.total = listPage.total;
        this.pageSize = listPage.pageSize;
      });
    },
    //进行模糊查询
    filterBy(sosMessageList, value) {
      return sosMessageList.filter(function(sosMessage) {
       return sosMessage.gunMac.match(value);
      });
    },
    //协助查找
    toHelpFind(log,lat){
         //iframe窗
       /*  layer.open({
            type: 2,
            title: '协助查询',
            shadeClose: true,
            shade: false,
            maxmin: true, //开启最大化最小化按钮
            area: ['893px', '600px'],
            content: '../../common/page/FindMap.html'
        }); */
    },
    //分页
    btnClick: function(data) {
      //页码点击事件
      if (data != this.cur) {
        (this.cur = data), this.getSosMessageLists(this.cur);
      }
    },
    pageClick: function() {
      this.getSosMessageLists(this.cur);
      console.log("现在在" + this.cur + "页");
    },
  }, 
  //进入页面就进行显示
  created() {
    this.getSosMessageLists(this.pn);
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
