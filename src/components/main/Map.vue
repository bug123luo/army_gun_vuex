/* 百度地图 */
<template>
  <div id="map">
    <div id="allmap" ref="allmap"></div>


<!-- @mousedown="hover(false)"  -->
<div class="news" id="news" style="	width: 400px;height: 60px;background-color:rgba(0,0,0,0.75);position: absolute;z-index: 99999;right:10px;top:100px;border:1px solid rgba(255,255,255,0.70)">
    <div  @mouseover="hoverApp(true)"   class="dislocation" style="margin-top:10px;float:left; padding-left:40px;">
        <img src="static/assets/img/suixing.png" style="float:left;">
        <dl style="color:#2db5ee; float:left; margin-left:10px; margin-top:-2px; padding-right:50px; border-right:1px solid rgba(255,255,255,0.70)">
            <dd style="font-size:14px;"><span id="dislocation" style="font-size:16px">{{readOnLineAppCount}}</span>个</dd>
            <dd style="font-size:14px;">在线设备数</dd>
        </dl>
    </div>

    <div  @mouseover="hoverGun(true)"   class="offline" style="margin-top:10px;float:left; padding-left:50px;">
        <img src="static/assets/img/lixian.png" style="float:left;">
        <dl style="color:#fa117a; float:left; margin-left:10px; margin-top:-2px;">
            <dd style="font-size:14px;"><span id="offline" style="font-size:16px">{{readOffNormalGunCount}}</span>个</dd>
            <dd style="font-size:14px;">枪支离位数</dd>
        </dl>
    </div>
</div>


<!--在线设备-->

  <div v-show="stateApp || total_d>pageSize_d" class="state" style="width:400px; height:300px; background-color:rgba(0,0,0,0.75); position:absolute; z-index:99999; right:10px; top:166px;border:1px solid rgba(255,255,255,0.70);">
      <table class="table table-condensed" >
        <thead>
          <tr style="color:#e5e5e5; font-size:14PX; background-color:rgba(36,36,36,0.9); ">
            <th class="text-center">设备名</th>
            <th class="text-center">枪号</th>
            <th class="text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          <button
          type="button"
          id="close2"
          style="color:#fff; position:absolute; margin-top:-28px; right:10px;"
          class="close"
          data-dismiss="model"  @click="close(1)"
          aria-hidden="true">&times
          </button>
          <tr v-for="onLineApp in readOnLineAppList"
              :key="onLineApp.id" style="color:#e5e5e5; text-align:center; font-size:14PX; background-color:rgba(46,46,46,0.9);">
            <td>{{onLineApp.apps.appName}}</td>
            <td>{{onLineApp.gunId}}</td>
            <td>
              <span @click="findLocation(onLineApp.apps.appImei)" class="label label-success">查询</span>
              <router-link :to="{name:'trajectoryTracking',params:{appImei:onLineApp.apps.appImei,name:onLineApp.apps.appName,imeiType:0}}"  class="label label-primary">
                    轨迹
              </router-link>
              <!-- <span @click="openFindTrajectory(onLineApp.apps.appImei)" class="label label-primary">轨迹</span> -->
            </td>
          </tr>
        </tbody>
      </table>
</div>  

<!--离位枪支--> 
<div v-show="stateGun || total_g>pageSize_g" class="state" style="width:400px; height:300px; background-color:rgba(0,0,0,0.75); position:absolute; z-index:99999; right:10px; top:166px;border:1px solid rgba(255,255,255,0.70);">
      <table class="table table-condensed" >
        <thead>
          <tr style="color:#e5e5e5; font-size:14PX; background-color:rgba(36,36,36,0.9); ">
            <th class="text-center">枪号</th>
            <th class="text-center">设备名</th>
            <th class="text-center">类型</th>
            <th class="text-center">操作</th> 
            <!--<th class="text-center">状态</th>-->
          </tr>
        </thead>
        <tbody>
          <button
          type="button"
          id="close2"
          style="color:#fff; position:absolute; margin-top:-28px; right:10px;"
          class="close"
          data-dismiss="model" @click="close(2)"
          aria-hidden="true">&times
          </button>
          <tr v-for="offNormalGun in readOffNormalGunList"
              :key="offNormalGun.id" style="color:#e5e5e5; text-align:center; font-size:14PX; background-color:rgba(46,46,46,0.9);">
            <td>{{offNormalGun.gunId}}</td>
            <td>{{offNormalGun.apps.appName}}</td>
            <td>{{offNormalGun.guns.gunType}}</td>
            <td>
              <span @click="findLocation(offNormalGun.guns.gunImei)" class="label label-success">查询</span>
               <router-link :to="{name:'trajectoryTracking',params:{appImei:offNormalGun.guns.gunImei,name:offNormalGun.gunId,imeiType:1}}"  class="label label-primary">
                    轨迹
              </router-link>
             <!--  <span @click="openFindTrajectory(offNormalGun.guns.gunImei)" class="label label-primary">轨迹</span> -->
            </td>
          </tr>
        </tbody>
      </table>
</div>
    </div>
  </div>
</template>
 
<script>
export default {
  name: "Map",
  data() {
    return {
      setState:true,//定时状态
      setStateGunApp:true,
      stateGun:false,
      stateApp:true,
      gunLocationList: [],
      readGunDynamicList:[],
      toggole:true,//开关轨迹
      map: "",
      //离位枪支数
      readOffNormalGunCount:"",
      //在线设备数
      readOnLineAppCount:"",
      //离位枪支
      readOffNormalGunList:[],
      pn_g: 1,
      all_g: "", //总页数
      cur_g: "", //当前页码
      total_g: "", //总条数
      pageSize_g: "", //多少一页
      //在线设备
      readOnLineAppList:[],
      pn_d: 1,
      all_d: "", //总页数
      cur_d: "", //当前页码
      total_d: "", //总条数
      pageSize_d: "" //多少一页

    };
  },
  methods: {
    getMap() {
      let _this = this;
      //===============================================  Start 地图显示   ==================================================
      let map = new BMap.Map(_this.$refs.allmap); // 创建Map实例
      _this.map = map;
     
      var point = new BMap.Point(114.034656, 22.616798);
      _this.map.centerAndZoom(point, 5);
      //1、设置地图的样式
      //map.setMapStyle({style:'midnight'});
      //2、设置地图默认的鼠标指针样式
      _this.map.setDefaultCursor("url('bird.cur')");
      //3、启用滚轮放大缩小，默认禁用
      _this.map.enableScrollWheelZoom();
      //4、启用地图惯性拖拽，默认禁用
      _this.map.enableContinuousZoom();
      //5、进行拖拽
      _this.map.enableScrollWheelZoom(true);
      _this.map.disableDragging(); //禁止拖拽
      setTimeout(function() {
        _this.map.enableDragging(); //两秒后开启拖拽
        _this.map.enableInertialDragging(); //两秒后开启惯性拖拽
      }, 2000);
      //设置地图
      _this.map.addControl(
        new BMap.MapTypeControl({
          mapTypes: BMAP_HYBRID_MAP
          /* [
                BMAP_HYBRID_MAP,
                BMAP_NORMAL_MAP
                //BMAP_SATELLITE_MAP//卫星地图
            ]*/
        })
      );
      //设置地图：使用混合地图
      _this.map.setMapType(BMAP_SATELLITE_MAP);
      //6、 添加带有定位的导航控件
      var navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_TOP_LEFT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        // 启用显示定位
        enableGeolocation: true
      });
      _this.map.addControl(navigationControl);
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
      _this.map.addControl(geolocationControl);

      //6、左下角地图查看空间
      var overviewControl1 = new BMap.OverviewMapControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        isOpen: true
      });
      _this.map.addControl(overviewControl1);
      //===============================================  End 地图显示   ==================================================
      //地图动态数据展示
      _this.findMap(_this.map);
    },
    //开启
    openFindMap(map){
      
      let _this=this;
       var ka;
      if(setState==false){
         //alert("结束"+_this.setState)
        //关闭定时
        clearTimeout(()=>{ka});
      }else if(setState==true){
        //alert("开启"+_this.setState)
        ka=setTimeout(() => {
                _this.findMap(map);
            }, 1000); 
      }
    },
   //===============================================  Start 动态数据 ==================================================
    //地图动态数据展示
    findMap(map) {
      
      let _this = this;
 
      //启动定时
      if(_this.setState){
       // alert("开启"+_this.setState)
        setTimeout(() => {
                _this.findMap(map);
            }, 1000); 
      }else{
        //alert("结束"+_this.setState)
        //关闭定时
        clearTimeout(()=>{_this.findMap(map)});
      }

      var getLongitude = [];
      var getLatitude = [];
      //图标
      var myIcon = "";
      //离位虚线
      var lineoff =
        "<div style='height: 1px;border-bottom: 1px dashed rgba(255,255,255,0.5); width:128px; margin-bottom: -18px; margin-top: 2px;'></div>";
      //正常虚线
      var lineon =
        "<div style='height: 1px;border-bottom: 1px dashed rgba(14,11,12,0.2); width:128px; margin-bottom: -18px; margin-top: 2px;'></div>";
      //获取枪支动态数据
      _this.$axios
        .get("/gunLocation/readAppAndGunLocation")
        .then(response => {
          _this.map.clearOverlays(); // 清除标注信息
          //console.log("你是不");
          //console.log(response.data.extend.gunLocations);
          _this.gunLocationList = response.data.extend.gunLocations;
          //遍历
          $.each(_this.gunLocationList, function(i, p) {
            getLongitude[i] = p.longitude;
            getLatitude[i] = p.latitude;
            //alert(p.realTimeState)
            /* Start  枪支图片 */
            if(p.typeImei==0){
               myIcon = new BMap.Icon("/static/assets/img/device.png",new BMap.Size(68, 75)); //手枪
            }else{
               myIcon = new BMap.Icon("/static/assets/img/offNormalGun.png",new BMap.Size(68, 75)); //手枪
            }
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
                //alert(p.gunMac)
                _this.findLocation(p.imei);
                //getGunLocationClick(p.gunMac);
              });
            }
            //右键单击marker出现右键菜单事件
            function RightClickHandler(marker) {
              marker.addEventListener("rightclick", function(e) {
                if (e.overlay) {
                  //判断右键单击的是否是marker
                  alert("12312");
                } else {
                  _this.getLocationName(p.longitude, p.latitude);
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
            if(p.typeImei==0){//在线设备
            //var guns=p.gunIds.split(',');
            //alert(p.gunIds)
           /*  var gs="";
            for (let index = 0; index < guns.length-3; index++) {
              gs+="枪号：" + guns[index] +"</br>";
            } */
              tag =
              "<div class='tag2' style='padding-left:10px;padding-top:6px;line-height:20px;width:150px; height:133px; border:1px solid #f8b400; position:relative; border-radius:8px; background-color:#f8b400;'>" +
              "设备名：" +
              p.appName +
              lineoff +
              "</br>" +
              "电话：" +
              p.appPhone +
              lineoff +
              "</br>" +
             // gs+lineoff+"</br>" +
              /*  + ((p.gunState) == 0 ? accompany : (p.gunState) == 1 ? gunOffNormal : gunOffNormal)
                + ((p.deviceState) == 0 ? onLine : (p.deviceState) == 1 ? gunOffNormal : (p.deviceState) == 2 ? offLine : assist) + "</br>"  */ "</div>";
            }else{
              //离位枪支
              tag =
              "<div class='tag2' style='padding-left:10px;padding-top:6px;line-height:20px;width:150px; height:133px; border:1px solid #f8b400; position:relative; border-radius:8px; background-color:#f8b400;'>" +
              "枪号：" +
              p.gunId +
              lineoff +
              "</br>" +
              "设备名：" +
              p.appName +
              lineoff +
              "</br>" +
               "类型：" +
              (p.gunType==0?"长枪":"短枪") +
              lineoff +
              "</br>" +
            /*    "型号：" +
              p.gunModel +
              lineoff +
              "</br>" + */
               "</div>";
            }
            
            /* End 框里面的内容 */

            /* Start 鼠标触摸事件 */

            marker.addEventListener("mouseover", function(e) {
              //alert("tangchu")
              _this.setState=true;//关闭定时
              //alert("触摸"+_this.setState)
              //创建标注的hover事件,触摸事件
              // clearTimeout(()=>{_this.findMap(map)});
              //7.2 添加字体
              var labela;
              //可做判断,让文字的显示位置变化
              labela = new BMap.Label(tag, {
                offset: new BMap.Size(-50, -145)
              });

              labela.setStyle({
                color: "#302e18",
                width: "100%",
                height: "100%",
                fontSize: "14px"
              });
              marker.setLabel(labela);
            });
            marker.addEventListener("mouseout", function(e) {
               _this.setState=true;//启动定时
               //alert("松开"+_this.setState)
             /*   setTimeout(() => {
                _this.findMap(map);
            }, 1000);  */
              var label = this.getLabel();
              setTimeout(function() {
                label.setContent(""); //设置标签内容为空
                label.setStyle({
                  border: "none",
                  width: "0px",
                  padding: "0px"
                }); //设置标签边框宽度为0
              }, 1000);
            });
            /* End 鼠标触摸事件 */

            //7.4 将经纬坐标划入地图
            getLongitude[i] = new BMap.Point(getLongitude[i], getLatitude[i]);
          });
        })
        .catch(function(error) {
          console.log(error);
        });


      /*     $.ajax({
            url: "/locationUtil/getLocation",
            type: "GET",
            data: {"lng": lng, "lat": lat},
            async: true,
            dataType: "json",
            success: function (result) {
              
            }
        }) */

      //===============================================  End 动态数据   ==================================================
    },
    //具体位置
    getLocationName(lng, lat) {
      this.$axios
        .get("/locationUtil/getLocation?lng=" + lng + "&lat=" + lat)
        .then(response => {
          layer.alert(response.data.extend.realLocations);
        });
    },
    //扩大具体位置
    findLocation(imei) {
      //alert(gunId)
      let _this = this;
      _this.map.clearOverlays(); // 清除标注信息
     // _this.setState=true;
      var getLongitude = [];
      var getLatitude = [];
      //图标
      var myIcon = "";
      //离位虚线
      var lineoff =
        "<div style='height: 1px;border-bottom: 1px dashed rgba(255,255,255,0.5); width:128px; margin-bottom: -18px; margin-top: 2px;'></div>";
      //正常虚线
      var lineon =
        "<div style='height: 1px;border-bottom: 1px dashed rgba(14,11,12,0.2); width:128px; margin-bottom: -18px; margin-top: 2px;'></div>";
      //获取枪支动态数据
      _this.$axios
        .get("/gunLocation/readAppAndGunLocation?imei=" + imei)
        .then(response => {
          var result = response.data;
          //遍历
          $.each(result.extend.gunLocations, function(i, p) {
            getLongitude[i] = p.longitude;
            getLatitude[i] = p.latitude;
            /* Start  枪支图片 */
             if(p.typeImei==0){
               myIcon = new BMap.Icon("/static/assets/img/device.png",new BMap.Size(68, 75)); //手枪
            }else{
               myIcon = new BMap.Icon("/static/assets/img/offNormalGun.png",new BMap.Size(68, 75)); //手枪
            }
            /* End  枪支图片 */

            var marker = null;
            //这就是对象的字面量形式
            marker = new BMap.Marker(
              new BMap.Point(getLongitude[i], getLatitude[i]),
              { icon: myIcon }
            );
            //将标注添加到地图中
            _this.map.addOverlay(marker);

            /* Start 鼠标事件 */
            AddClickHandler(marker);
            RightClickHandler(marker);
            //1、鼠标左键单击事件
            function AddClickHandler(marker) {
              marker.addEventListener("click", function(e) {
                this.getMap();
              });
            }
            //右键单击marker出现右键菜单事件
            function RightClickHandler(marker) {
              marker.addEventListener("rightclick", function(e) {
                if (e.overlay) {
                  //判断右键单击的是否是marker
                  layer.alert("12312");
                } else {
                  _this.getLocationName(p.longitude, p.latitude);
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
              p.appIMEI +
              lineoff +
              "</br>" +
             /*  "电话：" +
              p.appPhone +
              lineoff +
              "</br>" + */
              //+ "枪支：" + (p.gunModel).slice(0, 8) + lineoff + "</br>"
              "枪号：" +
              p.gunId +
              lineoff +
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
              labela = new BMap.Label(tag, {
                offset: new BMap.Size(-50, -145)
              });

              labela.setStyle({
                color: "#302e18",
                width: "100%",
                height: "100%",
                fontSize: "14px"
              });
              //marker.setLabel(labela);触摸弹出
            });
            /* marker.addEventListener("mouseout", function(e) {
              var label = this.getLabel();
              setTimeout(function() {
                label.setContent(""); //设置标签内容为空
                label.setStyle({
                  border: "none",
                  width: "0px",
                  padding: "0px"
                }); //设置标签边框宽度为0
              }, 1000);
            }); */
            /* End 鼠标触摸事件 */

            //7.4 将经纬坐标划入地图
            getLongitude[i] = new BMap.Point(getLongitude[i], getLatitude[i]);
            _this.map.setViewport(getLongitude);
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //轨迹开启和关闭
    openFindTrajectory(appImei){
      let _this=this;
       if (_this.toggole) {
         alert("轨迹：开启")
        //查询轨迹
        _this.findTrajectory(appImei) 
        _this.setState=false
        } else {
           alert("轨迹：关闭")
          //扩大显示
          _this.setState=true
          _this.findMap(_this.map)
          _this.findLocation(appImei);
        }
        _this.toggole = !_this.toggole; 
    },
    //查询轨迹
    findTrajectory(appImei) {
        //alert(appImei);
        let _this=this;
        _this.map.clearOverlays(); // 清除标注信息
 
        var label = [];//保存日期
        var value = [];//数量
        var points = []; // 添加折线运动轨迹
        var ii ;
        var myIcon;//图标点
        _this.$axios.get('/gunLocation/readGunTrajectory?appImei='+appImei).then(response=>{
                var result=response.data;
                console.log(result);
              /*   if(result.extend.gunTrajectoryList.length==0){
                  layer.msg("暂无实时轨迹");
                  return false;
                } */
                $.each(result.extend.gunTrajectoryList,function (i,p) {
                    label[i] = p.longitude;
                    value[i] = p.latitude;
                    var point= new BMap.Point(label[i],value[i]); // 填充标注点

                    //1、自定义标注图形
                    if(i==0){
                        myIcon = new BMap.Icon('/static/assets/img/start.png', new BMap.Size(40, 100));
                    }else if(i==result.extend.numberLocations-1){
                        myIcon = new BMap.Icon('/static/assets/img/end.png', new BMap.Size(40, 100));
                    }else{
                        /* if(value.state==0){
                             myIcon = new BMap.Icon('img/blues.png', new BMap.Size(4, 4));
                         }else*/
                        if(p.gunDeviceState==1){
                            myIcon = new BMap.Icon('/static/assets/img/onlieCenter.png', new BMap.Size(10, 10));
                        }else if(p.gunDeviceState==0){
                            myIcon = new BMap.Icon('/static/assets/img/centre.png', new BMap.Size(10, 10));
                        }

                    }
                    var marker;//标注
                    marker = new BMap.Marker(point, {icon: myIcon});// 创建标注，为要查询的地方对应的经纬度
                    if(i==0 || i==result.extend.numberLocations-1 || p.gunDeviceState==1 || p.gunDeviceState==2){
                        _this.map.addOverlay(marker);
                    }
                    RightClickHandler(marker);//右键单击marker出现右键菜单事件
                    //右键单击marker出现右键菜单事件
                    function RightClickHandler(marker) {
                        marker.addEventListener("rightclick", function (e) {
                            if(e.overlay){//判断右键单击的是否是marker
                                alert("12312");
                            }else{
                                 _this.getLocationName(p.longitude,p.latitude);
                            }
                        });
                    };
                    //2、标注内容
                    var tips;//标注
                    var line="<div style='height: 1px;border-bottom: 1px dashed rgba(255,255,255,0.5); width:120px; margin-bottom: -18px; margin-top: 2px;'></div>";//虚线
                    if(i==0){
                        tips = "<div class='list-information' style='width:144px; height:80px; border:2px solid rgba(17,123,36,0.8); position:relative; border-radius:8px; background-color:rgba(0,0,0,0.7); padding-top:4px; padding-left:10px;'>"
                            + "开始："+ (i+Number(1)) + line +"</br>"
                            +"警员编号："+p.deviceNo+ line +"</br>"
                            +"时间："+1+"</br>"
                            +"</div>";
                    }else if(i==result.extend.numberLocations-1){
                        tips = "<div class='list-information' style='width:144px; height:80px; border:2px solid rgba(109,109,109,0.87); position:relative; border-radius:8px; background-color:rgba(0,0,0,0.7); padding-top:4px;  padding-left:10px;'>"
                            + "结束："+ (i+Number(1)) + line +"</br>"
                            +"警员编号："+p.deviceNo + line+"</br>"
                            +"时间："+1+"</br>"
                            +"</div>";
                    }else{
                        tips = "<div class='list-information' style='width:144px; height:80px; border:2px solid rgba(249,0,15,0.8); position:relative; border-radius:8px; background-color:rgba(0,0,0,0.7); padding-top:4px;  padding-left:10px;'>"
                            +"位数："+ (i+Number(1)) + line+"</br>"
                            +"警员编号："+p.deviceNo + line+"</br>"
                            +"时间："+1+"</br>"
                            +"</div>";
                    }
                    //1、鼠标左键单击事件
                    function addClickHandler(marker) {
                        marker.addEventListener("click", function (e) {
                                var labela;//3、创建标注
                                if(i==0){
                                    labela = new BMap.Label(tips,{offset:new BMap.Size(25,50)});
                                }else if(i==result.extend.numberLocations-1){
                                    labela = new BMap.Label(tips,{offset:new BMap.Size(25,50)});
                                }else{
                                    labela = new BMap.Label(tips,{offset:new BMap.Size(-142,-75)});
                                }
                                labela.setStyle({
                                    color: "#eeeeee",
                                    width: "100%",
                                    height: "100%",
                                    fontSize: "14px",
                                });
                                marker.setLabel(labela);
                            }
                        );
                    }
                    //创建标注的hover事件
                    marker.addEventListener("mouseover", function (e) {
                        //7.2 添加字体
                        var labela;//3、创建标注
                        if(i==0){
                            labela = new BMap.Label(tips,{offset:new BMap.Size(25,50)});
                        }else if(i==result.extend.numberLocations-1){
                            labela = new BMap.Label(tips,{offset:new BMap.Size(25,50)});
                        }/*else{
                                labela = new BMap.Label(tips,{offset:new BMap.Size(-142,-75)});
                            }*/
                        labela.setStyle({
                            color: "#eeeeee",
                            width: "100%",
                            height: "100%",
                            fontSize: "14px",
                        });
                        marker.setLabel(labela);
                    });
                    marker.addEventListener("mouseout", function (e) {
                        var label = this.getLabel();
                        setTimeout(function () {
                            label.setContent("");//设置标签内容为空
                            label.setStyle({border: "none", width: "0px", padding: "0px"});//设置标签边框宽度为0
                        }, 1000);
                    });

                    points.push(point);
                    //7.4 将经纬坐标划入地图
                    label[i] = new BMap.Point(label[i], value[i]);
                    _this.map.setViewport(label);
                })
                var polyline = new BMap.Polyline(points, {
                    strokeColor : "blue",
                    strokeWeight : 2,
                    strokeOpacity : 1
                });
                _this.map.addOverlay(polyline);
        }).catch(function(error) {
          console.log(error);
        });

    },
    getTrajectory(){

    },
    hoverApp:function (params) {
     this.stateApp=Boolean(params)
     this.stateGun=Boolean(!params)
     this.getOnLineAppList(this.pn_d)
     this.getOffNormalGunCount()
     this.getOnLineAppCount()
   },
    hoverGun:function (params) {
     this.stateGun=Boolean(params)
     this.stateApp=Boolean(!params)
     this.getOffNormalGunList(this.pn_g)
      this.getOffNormalGunCount()
     this.getOnLineAppCount()
   },
   close(state){
     if(state==1){
        this.stateApp=Boolean(false)
     }else if(state==2){
        this.stateGun=Boolean(false)
     }
   },
   //枪支列表
   getReadGunDynamicList(pn){
   // alert(123123)
      let _this=this;
      _this.$axios.get('/gunLocation/readGunDynamicOptimize?pn='+pn).then(response=>{
        console.log(response.data.extend.gunLocations)
        _this.readGunDynamicList=response.data.extend.gunLocations/* .pageInfo.list */;
        for (var js2 in _this.readGunDynamicList) {
          _this.readGunDynamicList[js2].gunDeviceState=(_this.readGunDynamicList[js2].gunDeviceState)==0?"在线":"离位"
         // alert(_this.readGunDynamicList[js2].gunDeviceState)
          //alert( js2+"="+_this.readGunDynamicList[js2].gunId);
        }
       /*  var listPage = response.data.extend.pageInfo;
        _this.all = listPage.pages; //总页数
        _this.cur = listPage.pageNum; //当前页码
        _this.total = listPage.total;
        _this.pageSize = listPage.pageSize; */
      });
   },

   //在线设备
   getOnLineAppList(pn){
      let _this=this;
      _this.$axios.get('/appGun/readOnLineApp?pn='+pn).then(response=>{
        // console.log("在线设备")
        //console.log(response.data)
        _this.readOnLineAppList=response.data.extend.pageInfo.list;
       /*  for (var js2 in _this.readOnLineAppList) {
          _this.readOnLineAppList[js2].gunDeviceState=(_this.readOnLineAppList[js2].gunDeviceState)==0?"在线":"离位"
        } */
        var listPage = response.data.extend.pageInfo;
        _this.all_d = listPage.pages; //总页数
        _this.cur_d = listPage.pageNum; //当前页码
        _this.total_d = listPage.total;
        _this.pageSize_d = listPage.pageSize; 
      });
   },
    //离位枪支
   getOffNormalGunList(pn){
      let _this=this;
      _this.$axios.get('/appGun/readOffNormalGun?pn='+pn).then(response=>{
         //console.log("离位枪支")
         //console.log(response.data)
        _this.readOffNormalGunList=response.data.extend.pageInfo.list;
         for (var js2 in _this.readOffNormalGunList) {
          _this.readOffNormalGunList[js2].guns.gunType=(_this.readOffNormalGunList[js2].guns.gunType)==0?"长枪":"短枪"
        } 
        var listPage = response.data.extend.pageInfo;
        _this.all_g = listPage.pages; //总页数
        _this.cur_g = listPage.pageNum; //当前页码
        _this.total_g = listPage.total;
        _this.pageSize_g = listPage.pageSize; 
      });
   },

   //离位枪支数
   getOffNormalGunCount(){
      let _this=this;
      //启动定时
       _this.$axios.get('/appGun/readOffNormalGunCount').then(response=>{
          _this.readOffNormalGunCount=response.data.extend.gunCount;
        });
   },

    //在线设备数
   getOnLineAppCount(){
      let _this=this;
      _this.$axios.get('/appGun/readOnLineAppCount').then(response=>{
          _this.readOnLineAppCount=response.data.extend.countApp;
        });
   },
   appAndGun(){
     let _this=this
     //alert(_this.setStateGunApp)
      var ka;
      //启动定时
      if(_this.setStateGunApp){
        alert(_this.setStateGunApp)
        ka=setTimeout(() => {
              _this.getOnLineAppCount(),
              _this.getOffNormalGunCount()
            },1000); 
      }else{
        clearTimeout(()=>{ka});
      }
   },

    //==========  在线设备
    //分页
    btnClick_d: function(data) {
      //页码点击事件
      if (data != this.cur_d) {
        (this.cur = data), this.getReadGunDynamicList(this.cu_d);
      }
    },
    pageClick_d: function() {
      this.getReadGunDynamicList(this.cur_d);
      console.log("现在在" + this.cur_d + "页");
    },

     //==========  离位枪支
    //分页
    btnClick_g: function(data) {
      //页码点击事件
      if (data != this.cur_g) {
        (this.cur = data), this.getReadGunDynamicList(this.cu_g);
      }
    },
    pageClick_g: function() {
      this.getReadGunDynamicList(this.cur_g);
      console.log("现在在" + this.cur_g + "页");
    }

  },
  mounted() {
    let _this=this;
    _this.getMap()
    
  },
  created(){
      let _this=this
      //为 true 打开定时 
      _this.setState=false
      _this.getReadGunDynamicList(_this.pn)
      _this.getOnLineAppList(_this.pn_d)
      _this.getOnLineAppCount()
      _this.getOffNormalGunCount()
     // _this.appAndGun()
     // _this.openFindMap(_this.map,_this.setState)
      //_this.openFindMap(_this.map);
      //_this.getOffNormalGunList(_this.pn_g)
    
     // _this.findLocation(_this.map)
  },
  computed: {
    indexs_d: function() {
      let _this=this;
      var left = 1;
      var right = _this.all_d;
      var ar = [];
      if (_this.all_d >= 5) {
        if (_this.cur_d > 3 && _this.cur_d < _this.all_d - 2) {
          left = _this.cur_d - 2;
          right = _this.cur_d + 2;
        } else {
          if (_this.cur_d <= 3) {
            left = 1;
            right = 5;
          } else {
            right = _this.all_d;
            left = _this.all_d - 4;
          }
        }
      }
      while (left <= right) {
        ar.push(left);
        left++;
      }
      return ar;
    },
     indexs_g: function() {
      let _this=this;
      var left = 1;
      var right = _this.all_g;
      var ar = [];
      if (_this.all_g >= 5) {
        if (_this.cur_g > 3 && _this.cur_g < _this.all_g - 2) {
          left = _this.cur_g - 2;
          right = _this.cur_g + 2;
        } else {
          if (_this.cur_g <= 3) {
            left = 1;
            right = 5;
          } else {
            right = _this.all_g;
            left = _this.all_g - 4;
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
   beforeDestroy () {
       let _this=this;
       _this.setState=false
       _this.setStateGunApp=false
    }, 
    //离开当前页面后执行
    /* destroyed: function () {
      
    }, */
};
</script>
 
<style>
@import "../common/css/tag.css"; /*引入公共样式*/
@import "../common/css/paging.css"; /*引入公共样式*/

 #allmap {
  width: 100%;
  height: 600px;
  overflow: hidden;
 }

.BMap_cpyCtrl {
  display: none;
}

.anchorBL {
  display: none;
}
</style>