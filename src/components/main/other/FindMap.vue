/* 百度地图 */
<template>
  <div id="findMap">
    <div id="allmap" ref="allmap"></div>
   <!--    <div class="news" id="news">
      <div class="follows" style="margin-top:15px; margin-left:20px; float:left;">
              <img src="img/suixing.png" style="float:left;">
              <dl style="color:#18f084; float:left; margin-left:10px; margin-top:-2px; padding-right:20px; border-right:1px solid rgba(255,255,255,0.70)">
                  <dd style="font-size:14px;"><span id="follow" style="font-size:16px;"></span>个</dd>
                  <dd style="font-size:14px;">随行在线数</dd>
              </dl>
          </div>
          <div class="offlines" style="margin-top:15px;float:left; padding-left:20px;">
              <img src="img/liwei.png" style="float:left; ">
              <dl style="color:#2db5ee; float:left; margin-left:10px; margin-top:-2px; padding-right:20px; border-right:1px solid rgba(255,255,255,0.70)">
                  <dd style="font-size:14px;"><span id="dislocation" style="font-size:16px"></span>个</dd>
                  <dd style="font-size:14px;">随行离位数</dd>
              </dl>
          </div>
          <div class="dislocations" style="margin-top:15px;float:left; padding-left:20px;">
              <img src="img/lixian.png" style="float:left;">
              <dl style="color:#fa117a; float:left; margin-left:10px; margin-top:-2px;">
                  <dd style="font-size:14px;"><span id="offline" style="font-size:16px"></span>个</dd>
                  <dd style="font-size:14px;">枪支离位数</dd>
              </dl>
          </div>
      </div> -->

      <div v-if="type!='1'">
        <div   class="state" style="width:420px; height:60px; background-color:rgba(255,255,255); position:absolute; z-index:99999; box-shadow:0px 0px 4px #cdcdcd; right:10px; top:100px; border-radius:4px;">
          <div @click="previous($event)" style="margin-top:16px; margin-left:20px; float:left;" >
            <img src="static/assets/img/fanhui.png">
          </div>
            <div style="width:1px; height:40px; background-color:#dddddd; float:left; margin-left:20px; margin-top:10px;"></div>
            <button v-if="type=='2'" type="button" @click="pushToAssist(0)" class="btn btn-primary" style="float:right; margin-right:20px; margin-top:12px;">一键协助查找</button>
            <button v-if="type=='3'" type="button" @click="pushToAssist(1)" class="btn btn-primary" style="float:right; margin-right:20px; margin-top:12px;">一键紧急支援</button>

        </div>

        <div   class="state" style="width:280px; height:60px ;position:absolute; z-index:999999; right:80px; top:100px; ">
          <div @mouseover="hover(true)" @mousedown="hover(false)" style=" font-size:18px; text-align:center; margin-top:16px;  margin-left:-100px;">附近警员</div>
        </div>  

        <div v-show="state" class="state" style="width:420px; height:300px; background-color:rgba(255,255,255); position:absolute; z-index:99999; box-shadow:0px 0px 4px #cdcdcd; right:10px; top:166px; border-radius:4px;">

             <table class="table table-condensed" id="gunTag_OffNormal_table"
                  style="width:400px; margin-left:10px; margin-top:10px;">
                <button type="button" id="close2" style="color: #ffffff" class="close" data-dismiss="model" aria-hidden="true">
                    &times
                </button>
                <!-- <h4 class="modal-title text-center" style="color:rgba(255,255,255,1); margin-top: 10px;margin-bottom:20px;">
                    枪支离位列表</h4> -->
                <thead>
                <tr style="color:#4d4d4d; font-size:14PX; background-color:#fff;">
                    <th class="text-center">枪号</th>
                    <th class="text-center">IMEI</th>
                    <th class="text-center">状态</th>
                    <th class="text-center">操作</th>
                    <!--<th class="text-center">状态</th>-->
                </tr>
                </thead>
                <tbody>
                  <tr v-for="gunLocation in gunLocationList" :key="gunLocation.id" style="color:#4d4d4d; text-align:center; font-size:14PX; background-color:#fff;">
                    <td>{{gunLocation.gunId}}</td>
                    <td>{{gunLocation.gunMac}}</td>
                    <td>{{gunLocation.gunDeviceState}}</td>
                    <td>协助查找</td>
                  </tr>
                </tbody>
            </table>
        </div>
      </div>

  </div>
</template>
 
<script>
export default {
  name: "FindMap",
  data() {
    return {
      gunLocationList: [],
      log: "",
      lat: "",
      type:"",
      sosId:"",
      state:false,
      appImeiList:[],
    };
  },
  methods: {
    getFindMap() {
      let _this = this;
      //===============================================  Start 地图显示   ==================================================
      let map = new BMap.Map(_this.$refs.allmap); // 创建Map实例
      var point = new BMap.Point(114.034656, 22.616798);
      map.centerAndZoom(point, 5);
      //1、设置地图的样式
      //map.setMapStyle({style:'midnight'});
      //2、设置地图默认的鼠标指针样式
      map.setDefaultCursor("url('bird.cur')");
      //3、启用滚轮放大缩小，默认禁用
      map.enableScrollWheelZoom();
      //4、启用地图惯性拖拽，默认禁用
      map.enableContinuousZoom();
      //5、进行拖拽
      map.enableScrollWheelZoom(true);
      map.disableDragging(); //禁止拖拽
      setTimeout(function() {
        map.enableDragging(); //两秒后开启拖拽
        map.enableInertialDragging(); //两秒后开启惯性拖拽
      }, 2000);
      //设置地图
      map.addControl(
        new BMap.MapTypeControl({
          mapTypes: BMAP_NORMAL_MAP
          /* [
                BMAP_HYBRID_MAP,
                BMAP_NORMAL_MAP
                //BMAP_SATELLITE_MAP//卫星地图
            ]*/
        })
      );
      //设置地图：使用混合地图
      map.setMapType(BMAP_NORMAL_MAP);
      //6、 添加带有定位的导航控件
      var navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_TOP_LEFT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        // 启用显示定位
        enableGeolocation: true
      });
      map.addControl(navigationControl);
      // 添加定位控件
      var geolocationControl = new BMap.GeolocationControl();
      geolocationControl.addEventListener("locationSuccess", function(e) {
        // 定位成功事件
        var address = "";
        address += e.addressComponent.province;
        address += e.addressComponent.city;
        address += e.addressComponent.district;
        address += e.addressComponent.street;
        address += e.addressComponent.streetNumber;
        layer.alert("当前定位地址为：" + address);
      });
      geolocationControl.addEventListener("locationError", function(e) {
        // 定位失败事件
        layer.alert(e.message);
      });
      map.addControl(geolocationControl);

      //6、左下角地图查看空间
      var overviewControl1 = new BMap.OverviewMapControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        isOpen: true
      });
      map.addControl(overviewControl1);

      //===============================================  End 地图显示   ==================================================




      //===============================================  start 单个地图显示   ==================================================
      if(this.type=="1"){
      //图标
      var myIcon = "";
      //离位虚线
      var lineoff =
        "<div style='height: 1px;border-bottom: 1px dashed rgba(255,255,255,0.5); width:128px; margin-bottom: -18px; margin-top: 2px;'></div>";
      //正常虚线
      var lineon =
        "<div style='height: 1px;border-bottom: 1px dashed rgba(14,11,12,0.2); width:128px; margin-bottom: -18px; margin-top: 2px;'></div>";
      /* Start  枪支图片 */
      myIcon = new BMap.Icon("/static/assets/img/shortGun1.png",new BMap.Size(68, 75)); //手枪
      /* End  枪支图片 */

      var marker = null;
      //这就是对象的字面量形式
      marker = new BMap.Marker(new BMap.Point(this.log, this.lat), { icon: myIcon });
      //将标注添加到地图中
      map.addOverlay(marker);

      /* Start 鼠标事件 */
      AddClickHandler(marker);
      RightClickHandler(marker);
      //1、鼠标左键单击事件
      function AddClickHandler(marker) {
        marker.addEventListener("click", function(e) {
         // this.getMap();
        });
      }
      //右键单击marker出现右键菜单事件
      function RightClickHandler(marker) {
        marker.addEventListener("rightclick", function(e) {
          if (e.overlay) {
            //判断右键单击的是否是marker
            alert("12312");
          } else {
            getLocationName(this.log, this.lat);
          }
        });
      }
      /* End 鼠标事件 */

      /* Start <!--框--> */
      var gunOffNormal =
        '<span style=" background:url(img/red.png); background-repeat:no-repeat; background-position:left; padding-left: 16px; margin-right: 22px">离位</span>';
      var unused =
        '<span style=" background:url(img/red.png); background-repeat:no-repeat; background-position:left; padding-left: 16px; margin-right: 22px">未使用</span>';
      var accompany =
        '<span style=" background:url(img/green.png); background-repeat:no-repeat; background-position:left; padding-left: 16px; margin-right: 22px" >随行</span>';
      var onLine =
        '<span style=" background:url(img/green.png); background-repeat:no-repeat; background-position:left; padding-left: 16px; margin-right: 22px">在线</span>';
      var offLine =
        '<span style=" background:url(img/red.png); background-repeat:no-repeat; background-position:left; padding-left: 16px; margin-right: 22px">离线</span>';
      var assist =
        '<span style=" background:url(img/orange.png); background-repeat:no-repeat; background-position:left; padding-left: 16px; margin-right: 22px">协助</span>';
      /* End <!--框--> */

/* Start 框里面的内容 */
      var tag;
      tag =
        "<div class='tag2' style='padding-left:10px;padding-top:6px;line-height:20px;width:150px; height:133px; border:1px solid #f8b400; position:relative; border-radius:8px; background-color:#f8b400;'>" +
        "IMIE：" +
        +lineoff +
        "</br>" +
        "电话：" +
        +lineoff +
        "</br>" +
        //+ "枪支：" + (p.gunModel).slice(0, 8) + lineoff + "</br>"
        "枪号：" +
        +lineoff +
        "</br>" +
        /*  + ((p.gunState) == 0 ? accompany : (p.gunState) == 1 ? gunOffNormal : gunOffNormal)
                      + ((p.deviceState) == 0 ? onLine : (p.deviceState) == 1 ? gunOffNormal : (p.deviceState) == 2 ? offLine : assist) + "</br>"  */ "</div>";
      /* End 框里面的内容 */

      /* Start 鼠标触摸事件 */

      marker.addEventListener("mouseover", function(e) {
        //创建标注的hover事件,触摸事件
        //  clearInterval(timing);//清除定时
        //7.2 添加字体
        var labela;
        //可做判断,让文字的显示位置变化
        labela = new BMap.Label(tag, { offset: new BMap.Size(-50, -145) });

        labela.setStyle({
          color: "#302e18",
          width: "100%",
          height: "100%",
          fontSize: "14px"
        });
        marker.setLabel(labela);
      });
      marker.addEventListener("mouseout", function(e) {
        var label = this.getLabel();
        setTimeout(function() {
          label.setContent(""); //设置标签内容为空
          label.setStyle({ border: "none", width: "0px", padding: "0px" }); //设置标签边框宽度为0
        }, 1000);
      });
      //7.4 将经纬坐标划入地图
      var viewpoints = [];
      viewpoints.push(new BMap.Point(this.log, this.lat));
      map.setViewport(viewpoints);
      }
      //===============================================  end 单个地图显示   ==================================================

      //===============================================  start 周围在线   ==================================================
      if(this.type=="2"){
      var getLongitude = [];
      var getLatitude = [];
      //图标
      var myIcon = ""; 
       //离位虚线
      var lineoff="<div style='height: 1px;border-bottom: 1px dashed rgba(255,255,255,0.5); width:128px; margin-bottom: -18px; margin-top: 2px;'></div>";
      //正常虚线
      var lineon="<div style='height: 1px;border-bottom: 1px dashed rgba(14,11,12,0.2); width:128px; margin-bottom: -18px; margin-top: 2px;'></div>";
      //获取枪支动态数据
      _this.$axios.get("/gunLocation/readRoundDevice?lng="+this.log+"&lat="+this.lat).then(response => {
        //保存周围在线的警员
          _this.gunLocationList = response.data.extend.gunRoundDevices;
        for (const iterator of  _this.gunLocationList) {
            _this.appImeiList.push(iterator.gunMac);
        }
         console.log("周围在线");
        console.log(response.data.extend.gunRoundDevices);
      
        //遍历
        $.each(_this.gunLocationList, function(i, p) {
          getLongitude[i] = p.longitude;
          getLatitude[i] = p.latitude;

          /* Start  枪支图片 */
          myIcon = new BMap.Icon("/static/assets/img/shortGun1.png", new BMap.Size(68, 75)); //手枪
          /* End  枪支图片 */

          var marker = null;
          //这就是对象的字面量形式
          marker = new BMap.Marker(
            new BMap.Point(getLongitude[i], getLatitude[i]),
            { icon: myIcon }
          );
          //将标注添加到地图中
          map.addOverlay(marker);

          /* Start 鼠标事件 */
          AddClickHandler(marker);
          RightClickHandler(marker);
          //1、鼠标左键单击事件
          function AddClickHandler(marker) {
            marker.addEventListener("click", function(e) {
              getGunLocationClick(p.gunMac);
            });
          }
          //右键单击marker出现右键菜单事件
          function RightClickHandler(marker) {
            marker.addEventListener("rightclick", function(e) {
              if (e.overlay) {
                //判断右键单击的是否是marker
                alert("12312");
              } else {
                getLocationName(p.longitude, p.latitude);
              }
            });
          }
           /* End 鼠标事件 */
    

        /* Start <!--框--> */
        var gunOffNormal = '<span style=" background:url(img/red.png); background-repeat:no-repeat; background-position:left; padding-left: 16px; margin-right: 22px">离位</span>';
        var unused = '<span style=" background:url(img/red.png); background-repeat:no-repeat; background-position:left; padding-left: 16px; margin-right: 22px">未使用</span>';
        var accompany = '<span style=" background:url(img/green.png); background-repeat:no-repeat; background-position:left; padding-left: 16px; margin-right: 22px" >随行</span>';
        var onLine = '<span style=" background:url(img/green.png); background-repeat:no-repeat; background-position:left; padding-left: 16px; margin-right: 22px">在线</span>';
        var offLine = '<span style=" background:url(img/red.png); background-repeat:no-repeat; background-position:left; padding-left: 16px; margin-right: 22px">离线</span>';
        var assist = '<span style=" background:url(img/orange.png); background-repeat:no-repeat; background-position:left; padding-left: 16px; margin-right: 22px">协助</span>';
        /* End <!--框--> */


         /* Start 框里面的内容 */
         var tag;
         tag = "<div class='tag2' style='padding-left:10px;padding-top:6px;line-height:20px;width:150px; height:133px; border:1px solid #f8b400; position:relative; border-radius:8px; background-color:#f8b400;'>"
                + "IMIE：" + p.appIMEI + lineoff + "</br>"
                + "电话：" + p.appPhone + lineoff + "</br>"
               // + "枪支：" + (p.gunModel).slice(0, 8) + lineoff + "</br>"
                + "枪号：" + p.gunId + lineoff + "</br>"
               /*  + ((p.gunState) == 0 ? accompany : (p.gunState) == 1 ? gunOffNormal : gunOffNormal)
                + ((p.deviceState) == 0 ? onLine : (p.deviceState) == 1 ? gunOffNormal : (p.deviceState) == 2 ? offLine : assist) + "</br>"  */+ "</div>";
         /* End 框里面的内容 */


          /* Start 鼠标触摸事件 */
         
          marker.addEventListener("mouseover", function(e) { //创建标注的hover事件,触摸事件
            //  clearInterval(timing);//清除定时
            //7.2 添加字体
            var labela;
            //可做判断,让文字的显示位置变化
            labela = new BMap.Label(tag, {offset: new BMap.Size(-50, -145)});

            labela.setStyle({
              color: "#302e18",
              width: "100%",
              height: "100%",
              fontSize: "14px"
            });
            marker.setLabel(labela);
          });
          marker.addEventListener("mouseout", function(e) {
            var label = this.getLabel();
            setTimeout(function() {
              label.setContent(""); //设置标签内容为空
              label.setStyle({ border: "none", width: "0px", padding: "0px" }); //设置标签边框宽度为0
            }, 1000);
          });
          /* End 鼠标触摸事件 */

          //7.4 将经纬坐标划入地图
          getLongitude[i] = new BMap.Point(getLongitude[i], getLatitude[i]);
          map.setViewport(getLongitude);

        });
      }).catch(function (error) {
              console.log(error);
              });
      }
      //===============================================  end 周围在线   ==================================================

      function getLocationName(lng,lat){
         _this.$axios.get('/locationUtil/getLocation?lng='+lng+"&lat="+lat).then(response => {
                    layer.alert(response.data.extend.realLocations);
        });
    }
    },
    //协助查找
    pushToAssist(type) {
      alert(type)
       let _this=this;
       let params = new URLSearchParams();
          params.append("appImei",_this.appImeiList),
          params.append("sosId",  _this.sosId),
          params.append("type",type),
      _this.$axios.post('/sosMessage/createForHelpGun?appImei='+_this.appImeiList+"&sosId="+ _this.sosId+"&type="+type).then(response=>{
        console.log(response.data)
      })
    
    },
    //回到上次浏览的位置
   previous(){
       history.go(-1);
   },
   hover:function (params) {
     this.state=Boolean(params)
   },
   hovers:function (params) {
     this.state=false
   },
  },
  mounted() {
     this.getFindMap();
  },
  created() {
  
    this.log = this.$route.params.log;
    this.lat = this.$route.params.lat;
    this.type = this.$route.params.type;
    this.sosId = this.$route.params.sosId;
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../../common/css/tag.css"; /*引入公共样式*/

#allmap {
  height: 580px;
  overflow: hidden;
}
/* .BMap_cpyCtrl
{
    display:none; 
}
.anchorBL{
    display:none; 
} */

.news{
	width: 454px;
	height: 70px;
	background-color:rgba(0,0,0,0.75);
	position: absolute;
	z-index: 99999;
	right: 1%;
	top:100px;
	border:1px solid rgba(255,255,255,0.70)
}
#news p{ float:left; color:#F00; font-family:"微软雅黑"}
#news li a{ font-size:14px; margin-left:10px;margin-top:5px; float:left; color:#06F; text-decoration:underline;font-family:"微软雅黑"}
</style>
