<template>
  <div class="trajectoryTracking">
        <div id="map_canvas"></div>
   <!--      <button id="run">开始</button>
        <button id="stop">停止</button>
        <button id="pause">暂停</button>
        <button id="hide">隐藏信息窗口</button>
        <button id="show">展示信息窗口</button>
        <button type="button" class="btn btn-primary btn-sm"  @click="getData()">
                        <i class="fa fa-plus-square"></i> 新增
        </button>  -->
     
  </div>
</template>

<script>
export default {
  name: "TrajectoryTracking",
  data() {
    return {
        appImei:"",
        arrPois:[],//轨迹数据
        liu:[],
        map:"",
        nameType:"",
        lushu:"",
        imeiType:"",
    };
  },
  methods: {
    getMapTrajectory() {
       let _this=this;
      _this.map = new BMap.Map("map_canvas");
      _this.map.enableScrollWheelZoom();
      _this.map.centerAndZoom();  // 初始化地图,设置中心点坐标和地图级别
      //添加地图类型控件
      _this.map.addControl(new BMap.MapTypeControl({
        mapTypes:[
                BMAP_NORMAL_MAP,
                BMAP_HYBRID_MAP
            ]}));	  
	   // _this.map.setCurrentCity("北京");  

      var label = [];//经度
      var value = [];//纬度
      var point =[]; // 添加折线运动轨迹
        _this.$axios.get('/gunLocation/readGunTrajectory?appImei='+_this.appImei+"&imeiType="+_this.imeiType).then(response=>{
            var results = response.data.extend.gunTrajectoryList;
              if (response.data.status != "1000") {
                layer.msg(response.data.errorMessage)
              }else{
                for (let index = 0; index < results.length; index++) {
                    label[index] = results[index].longitude;
                    value[index] = results[index].latitude;
                    _this.arrPois.push(new BMap.Point(label[index],value[index]))
                }
                //现在地理位置，进行轨迹走动
                _this.getData()
             }
             
        });
          
    } ,   //获取轨迹数据
    getData() {
       let _this=this;
  //    map.addOverlay(new BMap.Polyline(arrPois, {strokeColor: '#111'})); //不画线
      var marker;
      //var lushu;
      _this.map.setViewport(_this.arrPois);
      marker = new BMap.Marker(_this.arrPois[0], {
        icon: new BMap.Icon(
          "http://developer.baidu.com/map/jsdemo/img/car.png",
          new BMap.Size(52, 26),
          { anchor: new BMap.Size(27, 13) }
        )
      });
     
      var label = new BMap.Label(_this.nameType, { offset: new BMap.Size(0, -30) });
      label.setStyle({
        border: "1px solid rgb(204, 204, 204)",
        color: "rgb(0, 0, 0)",
        borderRadius: "10px",
        padding: "5px",
        background: "rgb(255, 255, 255)"
      });
      marker.setLabel(label);

       _this.map.addOverlay(marker);
      BMapLib.LuShu.prototype._move = function(initPos, targetPos, effect) {
        var pointsArr = [initPos, targetPos]; //点数组
        var me = this,
          //当前的帧数
          currentCount = 0,
          //步长，米/秒
          timer = 10,
          step = this._opts.speed / (1000 / timer),
          //初始坐标
          init_pos = this._projection.lngLatToPoint(initPos),
          //获取结束点的(x,y)坐标
          target_pos = this._projection.lngLatToPoint(targetPos),
          //总的步长
          count = Math.round(me._getDistance(init_pos, target_pos) / step);
        //显示折线 syj201607191107
        this._map.addOverlay(
          new BMap.Polyline(pointsArr, {
            strokeColor: "#111",
            strokeWeight: 5,
            strokeOpacity: 0.5
          })
        ); // 画线
        //如果小于1直接移动到下一点
        if (count < 1) {
          me._moveNext(++me.i);
          return;
        }
        me._intervalFlag = setInterval(function() {
          //两点之间当前帧数大于总帧数的时候，则说明已经完成移动
          if (currentCount >= count) {
            clearInterval(me._intervalFlag);
            //移动的点已经超过总的长度
            if (me.i > me._path.length) {
              return;
            }
            //运行下一个点
            me._moveNext(++me.i);
          } else {
            currentCount++;
            var x = effect(init_pos.x, target_pos.x, currentCount, count),
              y = effect(init_pos.y, target_pos.y, currentCount, count),
              pos = me._projection.pointToLngLat(new BMap.Pixel(x, y));
            //设置marker
            if (currentCount == 1) {
              var proPos = null;
              if (me.i - 1 >= 0) {
                proPos = me._path[me.i - 1];
              }
              if (me._opts.enableRotation == true) {
                me.setRotation(proPos, initPos, targetPos);
              }
              if (me._opts.autoView) {
                if (!me._map.getBounds().containsPoint(pos)) {
                  me._map.setCenter(pos);
                }
              }
            }
            //正在移动
            me._marker.setPosition(pos);
            //设置自定义overlay的位置
            me._setInfoWin(pos);
          }
        }, timer);
      };
      _this.lushu = new BMapLib.LuShu(_this.map, _this.arrPois, {
        defaultContent:this.nameType, //"从天安门到百度大厦"
        autoView: true, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
        icon: new BMap.Icon(
          "http://developer.baidu.com/map/jsdemo/img/car.png",
          new BMap.Size(52, 26),
          { anchor: new BMap.Size(27, 13) }
        ),
        speed: 4500,
        enableRotation: true //是否设置marker随着道路的走向进行旋转
        /*                   landmarkPois:[
                   {lng:116.306954,lat:40.05718,html:'加油站',pauseTime:2}
                  ]*/
      });

      marker.addEventListener("click", function() {
        marker.enableMassClear(); //设置后可以隐藏改点的覆盖物
        marker.hide();
        _this.lushu.start();
        //map.clearOverlays();  //清除所有覆盖物
      });
      //}
      //        }
      //  });
      //drv.search('天安门', '百度大厦');
      // lushu.start();
      // lushu.pause();
      //绑定事件
      $("run").onclick = function() {
        marker.enableMassClear(); //设置后可以隐藏改点的覆盖物
        marker.hide();
        _this.lushu.start();
        // map.clearOverlays();    //清除所有覆盖物
      };
      $("stop").onclick = function() {
        _this.lushu.stop();
      };
      $("pause").onclick = function() {
        _this.lushu.pause();
      };
      $("hide").onclick = function() {
        _this.lushu.hideInfoWindow();
      };
      $("show").onclick = function() {
        _this.lushu.showInfoWindow();
      };
      function $(element) {
        return document.getElementById(element);
      }

    },
    stop(){
       this.lushu.stop();
    },
  },
  mounted() {
     let _this=this;
    _this.getMapTrajectory()
  },
  beforeCreate(){
    if(!this.$route.params.appImei){
        this.$router.push('/map')
    }
  },
  created() {
    this.appImei = this.$route.params.appImei;
    this.nameType = this.$route.params.name;
    this.imeiType = this.$route.params.imeiType;
  },
  beforeDestroy(){
      this.lushu.stop();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body,
html {
  width: 100%;
  height: 100%;
  margin: 0;
  font-family: "微软雅黑";
}
#map_canvas {
  width: 100%;
  height: 600px;
}
#result {
  width: 100%;
}
</style>
