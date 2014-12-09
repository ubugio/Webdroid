TEMP['socket'] = function(air){
    var wsServer = 'ws://'+air.Options.ip+':'+air.Options.socketPort+'/'; 
    window.websocket=null;
    var heartBeatFaultTimes=0;
    
    var connect=function(){
        try{
            websocket = new WebSocket(wsServer); 
        }catch(e){
            console.log("WebSocket Error");
        }
        websocket.onopen = function (evt) { onOpen(evt) }; 
        websocket.onclose = function (evt) { onClose(evt) }; 
        websocket.onmessage = function (evt) { onMessage(evt) }; 
        websocket.onerror = function (evt) { onError(evt) }; 
    };
    connect();
    
    var onOpen = function(evt) { 
        console.log("Connected to WebSocket server("+wsServer+") Success !"); 
        $(".layout-notify-container").removeClass("refreshing");
        if(heartBeatFaultTimes>0){
            heartBeatFaultTimes=0;
            air.require("notify").notify({
                id:"disconnect",
                icon:air.Options.imagePath+"icon-inf.png",
                title:air.Lang.connectedToServer,
                text:air.Lang.connectedToServerDesc,
                autoFadeOut:3000
            });
        }
    } 
    var onClose = function(evt) { 
        console.log("Disconnected From "+wsServer); 
        air.require("notify").toast("socket:"+air.Lang.socket_closed);
        $(".layout-notify-container").removeClass("refreshing");
        heartBeatFaultTimes++;
        $(".connect-status").addClass("unlink");
        if(heartBeatFaultTimes>=air.Options.heartBeatFaultTimesMax){
            air.require("notify").notify({
                id:"disconnect",
                icon:air.Options.imagePath+"icon-alert.png",
                title:air.Lang.disconnectFromServer,
                text:air.Lang.disconnectFromServerDesc,
                autoFadeOut:false,
                onclick:function(){
                    connect();
                }
            });
        }else{
            air.require("notify").notify({
                id:"disconnect",
                icon:air.Options.imagePath+"icon-inf.png",
                title:air.Lang.disconnectFromServer,
                text:air.Lang.connectingToServer+"("+heartBeatFaultTimes+")"
            });
            console.log("数据传输出错num:"+heartBeatFaultTimes);
            if(heartBeatFaultTimes<air.Options.heartBeatFaultTimesMax){
                setTimeout(function(){connect();},air.Options.heartBeatInterval);
            }
        }
    } 
    var Lists={};
    function onMessage(evt) {
        for(k in Lists){
            Lists[k](evt.data);
        }
    } 
    function onError(evt) { 
        console.log('Error occured: ' + evt.data); 
        air.require("notify").toast("socket:"+air.Lang.socket_error);
    }
    
    //----------------------------
    function addListener(id,func){
        Lists[id]=func;
        return Lists[id];
    }
    function removeListener(id){
        delete Lists[id];
    }
    function send(msg){
        websocket.send(msg);
    }
    //----------------------------
    return {
        reConnectSocket:connect,
        connectSocket:connect,
        websocket:websocket,
        Lists:Lists,
        addListener:addListener,
        removeListener:removeListener,
        send:send
    };
};