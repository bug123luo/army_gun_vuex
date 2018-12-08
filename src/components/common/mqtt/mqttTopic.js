$(document).ready(function() {
    //var userNames=localStorage.getItem("userName");//读取

    function doDisconnect() {
        client.disconnect();//响应一次，就关闭
    }

    // Web Messaging API callbacks
    var onSuccess = function(value) {
       // alert(1);
       /* $('#status').toggleClass('connected',true);
        $('#status').text('Success');*/
    }

    var onConnect = function(frame) {
        //layer.alert("服务连接成功");
       /* $('#status').toggleClass('connected',true);
        $('#status').text('Connected');*/
        client.subscribe("TestTopic");

    }
    var onFailure = function(error) {
        //alert(3);
       /* $('#status').toggleClass('connected',false);
        $('#status').text("Failure");*/
    }
    var options = {
        keepAliveInterval:10000,
        onSuccess: onConnect,
        onFailure: onFailure
    };

    function onConnectionLost(responseObject) {
        client.connect(options);
        //layer.alert("连接服务已断开，请刷新页面！");
        //alert(client.clientId+"\n"+responseObject.errorCode);
    }



    function onMessageArrived(message) {
        alert(message.payloadString);

       // var userNames=localStorage.getItem("userName");//读取

       // var json = JSON.parse(message.payloadString);

 
    }



    var client;
    var r = Math.round(Math.random()*Math.pow(10,5));
    var d = new Date().getTime();
    var cid = r.toString() + "-" + d.toString()

    //112.74.51.194 1884  120.76.156.120 61614
    client = new Messaging.Client("120.76.156.120", 61614, cid);
    client.onConnect = onConnect;
    client.onMessageArrived = onMessageArrived;

   // client.connectOptions=onFeconnect;
    client.onConnectionLost = onConnectionLost;
    client.connect(options);
    //client.connect({onSuccess: onConnect, onFailure: onFailure});

});