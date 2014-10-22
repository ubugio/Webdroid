TEMP['socket'] = function(air){
    var wsServer = 'ws://'+air.Options.ip+':'+air.Options.socketPort+'/'; 
    window.websocket=null;
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
    
    function onOpen(evt) { 
        console.log("Connected to WebSocket server("+wsServer+") Success !"); 
    } 
    function onClose(evt) { 
        console.log("Disconnected From "+wsServer); 
        air.require("notify").toast("socket:"+air.Lang.socket_closed);
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
        websocket:websocket,
        Lists:Lists,
        addListener:addListener,
        removeListener:removeListener,
        send:send
    };
};