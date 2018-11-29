/* 百度地图 */
<template>
  <div id="map">
    <div id="allmap" ref="allmap"></div>

    <div  
      class="state"
      style="width:420px; height:60px; background-color:rgba(255,255,255); position:absolute; z-index:99999; box-shadow:0px 0px 4px #cdcdcd; right:10px; top:100px; border-radius:4px;"
    >
      <div style="margin-top:16px; margin-left:20px; float:left;">
        <img src="static/assets/img/fanhui.png">
      </div>
      <div
        style="width:1px; height:40px; background-color:#dddddd; float:left; margin-left:20px; margin-top:10px;"
      ></div>
      <!--  <button v-if="type=='2'" type="button" @click="pushToAssist(0)" class="btn btn-primary" style="float:right; margin-right:20px; margin-top:12px;">一键协助查找</button>
      <button v-if="type=='3'" type="button" @click="pushToAssist(1)" class="btn btn-primary" style="float:right; margin-right:20px; margin-top:12px;">一键紧急支援</button>-->
    </div>

    <div
      class="state"
      style="width:280px; height:60px ;position:absolute; z-index:999999; right:80px; top:100px; "
    >
      <div @mouseover="hover(true)" @mousedown="hover(false)"  style=" font-size:18px; text-align:center; margin-top:16px;  margin-left:-100px;">在线警员</div>
    </div>

    <div v-show="state"
      class="state"
      style="width:420px; height:300px; background-color:rgba(255,255,255); position:absolute; z-index:99999; box-shadow:0px 0px 4px #cdcdcd; right:10px; top:166px; border-radius:4px;"
    >
      <table
        class="table table-condensed"
        id="gunTag_OffNormal_table"
        style="width:400px; margin-left:10px; margin-top:10px;"
      >
        <button
          type="button"
          id="close2"
          style="color: #ffffff"
          class="close"
          data-dismiss="model"
          aria-hidden="true"
        >&times</button>
        <!-- <h4 class="modal-title text-center" style="color:rgba(255,255,255,1); margin-top: 10px;margin-bottom:20px;">
        枪支离位列表</h4>-->
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
          <tr
            v-for="gunLocation in readGunDynamicList"
            :key="gunLocation.id"
            style="color:#4d4d4d; text-align:center; font-size:14PX; background-color:#fff;"
          >
            <td>{{gunLocation.gunId}}</td>
            <td>{{gunLocation.gunMac}}</td>
            <td>{{gunLocation.gunDeviceState}}</td>
            <td>
              <span @click="findLocation(gunLocation.gunMac)" class="label label-success">查询</span>
              <span @click="findTrajectory(gunLocation.gunMac)" class="label label-primary">轨迹</span>
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
                              <li><a>共<i>{{total}}</i>条</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
    </div>
  </div>
</template>
 
<script>
export default {
  name: "Map",
  data() {
    return {
      setState:false,//定时状态
      state:false,
      gunLocationList: [],
      readGunDynamicList:[],
      //离位虚线
      lineoff:
        "<div style='height: 1px;border-bottom: 1px dashed rgba(255,255,255,0.5); width:128px; margin-bottom: -18px; margin-top: 2px;'></div>",
      //正常虚线
      lineon:
        "<div style='height: 1px;border-bottom: 1px dashed rgba(14,11,12,0.2); width:128px; margin-bottom: -18px; margin-top: 2px;'></div>",
      map: "",
      pn: 1,
      all: "", //总页数
      cur: "", //当前页码
      total: "", //总条数
      pageSize: "" //多少一页
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

   //===============================================  Start 动态数据 ==================================================
    //地图动态数据展示
    findMap(map) {
      let _this = this;
      //启动定时
      if(_this.setState){
        setTimeout(() => {
                _this.findMap(map);
            }, 1000); 
      }else{
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
        .get("/gunLocation/readGunDynamic")
        .then(response => {
          console.log(response.data.extend.gunLocations);
          _this.gunLocationList = response.data.extend.gunLocations;
          //遍历
          $.each(_this.gunLocationList, function(i, p) {
            getLongitude[i] = p.longitude;
            getLatitude[i] = p.latitude;

            /* Start  枪支图片 */
            myIcon = new BMap.Icon(
              "/static/assets/img/shortGun1.png",
              new BMap.Size(68, 75)
            ); //手枪
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
                _this.findLocation(p.gunMac);
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
            tag =
              "<div class='tag2' style='padding-left:10px;padding-top:6px;line-height:20px;width:150px; height:133px; border:1px solid #f8b400; position:relative; border-radius:8px; background-color:#f8b400;'>" +
              "IMIE：" +
              p.appIMEI +
              lineoff +
              "</br>" +
              "电话：" +
              p.appPhone +
              lineoff +
              "</br>" +
              // + "枪支：" + (p.gunModel).slice(0, 8) + lineoff + "</br>"
              "枪号：" +
              p.gunId +
              lineoff +
              "</br>" +
              /*  + ((p.gunState) == 0 ? accompany : (p.gunState) == 1 ? gunOffNormal : gunOffNormal)
                + ((p.deviceState) == 0 ? onLine : (p.deviceState) == 1 ? gunOffNormal : (p.deviceState) == 2 ? offLine : assist) + "</br>"  */ "</div>";
            /* End 框里面的内容 */

            /* Start 鼠标触摸事件 */

            marker.addEventListener("mouseover", function(e) {
              //alert("tangchu")
              _this.setState=false;//关闭定时
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
    findLocation(gunId) {
      let _this = this;
     // _this.map.clearOverlays(); // 清除标注信息
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
        .get("/gunLocation/readGunDynamic?gunId=" + gunId)
        .then(response => {
          var result = response.data;
          //遍历
          $.each(result.extend.gunLocations, function(i, p) {
            getLongitude[i] = p.longitude;
            getLatitude[i] = p.latitude;
            /* Start  枪支图片 */
            myIcon = new BMap.Icon(
              "/static/assets/img/shortGun1.png",
              new BMap.Size(68, 75)
            ); //手枪
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
              "电话：" +
              p.appPhone +
              lineoff +
              "</br>" +
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
              marker.setLabel(labela);
            });
            marker.addEventListener("mouseout", function(e) {
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
            _this.map.setViewport(getLongitude);
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //查询轨迹
    findTrajectory(appImei) {
        let _this=this;
        _this.map.clearOverlays(); // 清除标注信息
        var label = [];//保存日期
        var value = [];//数量
        var points = []; // 添加折线运动轨迹
        var ii ;
        var myIcon;//图标点
        _this.$axios.get('/gunLocation/readGunTrajectory?appImei='+appImei).then(response=>{
                var result=response.data;

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
                    strokeWeight : 5,
                    strokeOpacity : 1
                });
                _this.map.addOverlay(polyline);
        }).catch(function(error) {
          console.log(error);
        });

    },
    hover:function (params) {
     this.state=Boolean(params)
   },
   //枪支列表
   getReadGunDynamicList(pn){
      let _this=this;
      _this.$axios.get('/gunLocation/readGunDynamicList?pn='+pn).then(response=>{
        _this.readGunDynamicList=response.data.extend.pageInfo.list;
        var listPage = response.data.extend.pageInfo;
        _this.all = listPage.pages; //总页数
        _this.cur = listPage.pageNum; //当前页码
        _this.total = listPage.total;
        _this.pageSize = listPage.pageSize;
      })
   },
    //分页
    btnClick: function(data) {
      //页码点击事件
      if (data != this.cur) {
        (this.cur = data), this.getReadGunDynamicList(this.cur);
      }
    },
    pageClick: function() {
      this.getReadGunDynamicList(this.cur);
      console.log("现在在" + this.cur + "页");
    }
  },
  mounted() {
      this.getMap()
  },
  created(){
      let _this=this
      _this.setState=true
      _this.getReadGunDynamicList(_this.pn)
      _this.findLocation(_this.map)
  },
  computed: {
    indexs: function() {
      let _this=this;
      var left = 1;
      var right = _this.all;
      var ar = [];
      if (_this.all >= 5) {
        if (_this.cur > 3 && _this.cur < _this.all - 2) {
          left = _this.cur - 2;
          right = _this.cur + 2;
        } else {
          if (_this.cur <= 3) {
            left = 1;
            right = 5;
          } else {
            right = _this.all;
            left = _this.all - 4;
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
  height: 580px;
  overflow: hidden;
}

.BMap_cpyCtrl {
  display: none;
}

.anchorBL {
  display: none;
}
</style>