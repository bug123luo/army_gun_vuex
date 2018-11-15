/* 百度地图 */
<template>
  <div id="map">
    <div id="allmap" ref="allmap"></div>
  </div>


</template>
 
<script>
export default {
  name: "Map",
  data() {
    return {
      gunLocationList: [],
      //离位虚线
      lineoff:"<div style='height: 1px;border-bottom: 1px dashed rgba(255,255,255,0.5); width:128px; margin-bottom: -18px; margin-top: 2px;'></div>",
      //正常虚线
      lineon:"<div style='height: 1px;border-bottom: 1px dashed rgba(14,11,12,0.2); width:128px; margin-bottom: -18px; margin-top: 2px;'></div>",
    };
  },
  methods: {
    getMap() {
      //===============================================  Start 地图显示   ==================================================
      let map = new BMap.Map(this.$refs.allmap); // 创建Map实例
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
          mapTypes: BMAP_HYBRID_MAP
          /* [
                BMAP_HYBRID_MAP,
                BMAP_NORMAL_MAP
                //BMAP_SATELLITE_MAP//卫星地图
            ]*/
        })
      );
      //设置地图：使用混合地图
      map.setMapType(BMAP_SATELLITE_MAP);
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

      //===============================================  Start 动态数据 ==================================================
      var getLongitude = [];
      var getLatitude = [];
      //图标
      var myIcon = ""; 
       //离位虚线
      var lineoff="<div style='height: 1px;border-bottom: 1px dashed rgba(255,255,255,0.5); width:128px; margin-bottom: -18px; margin-top: 2px;'></div>";
      //正常虚线
      var lineon="<div style='height: 1px;border-bottom: 1px dashed rgba(14,11,12,0.2); width:128px; margin-bottom: -18px; margin-top: 2px;'></div>";

      //获取枪支动态数据
      this.$axios.get("/gunLocation/readGunDynamic").then(response => {
        console.log(response.data.extend.gunLocations);
        this.gunLocationList = response.data.extend.gunLocations;
        //遍历
        $.each(this.gunLocationList, function(i, p) {
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
              getGunLocationClick(p.gunId);
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
                + "枪支：" + (p.gunModel).slice(0, 8) + lineoff + "</br>"
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

        });
      });



      //为鼠标左键事件而创建
      function getGunLocationClick(gunId){
       $.ajax({
            url: "http://127.0.0.1:8888/gunLocation/readGunDynamic",
            type: "GET",
            data: {"gunId": gunId},
            async: true,
            dataType: "json",
            success: function (result) {
               //遍历
              $.each(result.extend.gunLocations, function(i, p) {
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
                    this.getMap();
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
                      + "枪支：" + (p.gunModel).slice(0, 8) + lineoff + "</br>"
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
            }
        })
      }

      function getLocationName(lng,lat){
         $.ajax({
            url: "http://127.0.0.1:8888/locationUtil/getLocation",
            type: "GET",
            data: {"lng": lng, "lat": lat},
            async: true,
            dataType: "json",
            success: function (result) {
               alert(result.extend.realLocations);
            }
        })
      };
      //===============================================  End 动态数据   ==================================================
    },
  },
  mounted() {
    this.getMap();
  }
};
</script>
 
<style>
@import '../common/css/tag.css'; /*引入公共样式*/

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
