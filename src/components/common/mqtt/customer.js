
/*接收出入库mq显示*/
//var url = "ws://120.76.156.120:61614/WebOutQueue";
var url = "ws://120.76.156.120:61614/TestTopic";
var login = "admin";
var passcode = "admin";
//监听的队列
//需要和发送者的发送的队列名称一致否则无法接受到数据
destination = "TestTopic";
var client = Stomp.client(url);
var onconnect = function (frame) {
    alert(123)
    client.subscribe(destination, function (message) {
        var json;
        try {
            json = JSON.parse(message.body);
            messageType=JSON.parse(message.messageType);
            alert(message);
        } catch (e) {
            json = eval("(" + message.body + ")");
        }
        //***************************    出库列    ************************
      
       
    });
};
client.connect(login, passcode, onconnect);
