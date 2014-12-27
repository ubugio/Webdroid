TEMP['initAir'] = function(air){
    var PublicRander = function(){
        // 设置主题css
        this.setStyle(air.Options.themePath+'style.css',"theme-"+air.Options.theme+"-style");
        // 获取UI模块
        var ui = air.require('UI');
        // 获取icons信息
        var icons = air.require('icons');
        // 清除图标节点里面的内容
        air.Options.iconContainer.empty();
        // 设置各个icon
        var newOrder=[];
        var IconsOnDragfunction=function(tar,l,t){
            var l = (l-20)/90;
            console.log(t);
            var t = (t)/105;
            var keyNow = tar.attr("id").split("-")[1];
            var index = l*air.require("UI").vIconNum+t;
            var icons_Order = air.Options.icons_Order;
            var keyNowindex=icons_Order.indexOf(keyNow);
            var length = icons_Order.length;
            if(index>=length){
                index=length-1;
            }
            newOrder=[];
            for(var i=0;i<length;i++){
                if(keyNowindex>index){
                    if(i == index)newOrder.push(keyNow);
                    if(keyNow != icons_Order[i])newOrder.push(icons_Order[i]);
                }else{
                    if(keyNow != icons_Order[i])newOrder.push(icons_Order[i]);
                    if(i == index)newOrder.push(keyNow);
                }
            }
            air.require("UI").resetIcons(newOrder);
        };
        if(air.Options.icons_Order.length!=icons.length)air.Options.icons_Order=[];
        for(var key in icons){
            air.Options.icons_Order.push(icons[key]['id']);
            ui.newIcon({
                name:icons[key]['name'],
                src:air.Options.iconPath+icons[key]['src']+".png",
                id:icons[key]['id'],
                click:icons[key]['click']?icons[key]['click']:null
            }).jqDrag(null,{
                type:"grid",
                width:90,
                height:105,
                onDrag:function(tar,l,t){
                    IconsOnDragfunction(tar,l,t);
                },
                onStop:function(){
                    //判断图表顺序是不是发生改变，如果是赋值并提示保存
                    if (air.Options.icons_Order.length == newOrder.length){
                        for (var i = 0; i < newOrder.length; i++) {
                            if(air.Options.icons_Order[i]!=newOrder[i]){
                                air.Options.icons_Order=newOrder;
                                air.require("notify").toast(air.Lang.icons_Order_save);
                                break;
                            }
                        } 
                    }
                }
            });
        }
        air.require("connectPanel").init();
    };
    // 注入样式表方法
    var PublicSetStyle = function(path,id){
        if($("#"+id).length>0)return;
        $("head").append('<link id="'+id+'" rel="stylesheet" href="'+path+"?v="+new Date().getTime()+'" type="text/css" media="screen" />');
    };
    
    var alertLowBattery=false;
    var statusHandle = function(data){
        $(".connect-status").removeClass("unlink");
        if(data.network_isWIFI!="true"){
            $(".layout-taskbar-wifi").removeClass("wifi0 wifi1 wifi2 wifi3 wifi4").addClass("wifi0").attr("title",air.Lang.no_wifi);
        }else{
            $(".layout-taskbar-wifi").removeClass("wifi0 wifi1 wifi2 wifi3 wifi4")
            .addClass("wifi"+data.wifi_RSSI_level.split("/")[0]).attr("title",data.wifi_ssid+":"+data.wifi_ip);
        }
        var asu = data.gsm_signal_asu,bin=0;
        
        if (asu < 0 || asu >= 99) bin = 0;
        else if (asu >= 16) bin = 4;
        else if (asu >= 8) bin = 3;
        else if (asu >= 4) bin = 2;
        else bin = 1;
        $(".layout-taskbar-signal").removeClass("signal0 signal1 signal2 signal3 signal4").addClass("signal"+bin).attr("title","dbm:"+data.gsm_signal_dbm);
        $(".layout-taskbar-battery-vbg").css("width",data.battery+"%");
        if(data.battery_status=="charging"){
            alertLowBattery=!1;
            $(".layout-taskbar-battery-vbg").addClass("charging");
            $(".layout-taskbar-battery-v").addClass("i-taskbar-battery-v-charging");
        }else{
            $(".layout-taskbar-battery-vbg").removeClass("charging");
            $(".layout-taskbar-battery-v").removeClass("i-taskbar-battery-v-charging");
        }
        if(parseInt(data.battery)<20 && data.battery_status!="charging" && !alertLowBattery){
            alertLowBattery=!0;
            air.require("notify").alertNotify(air.Lang.low_battery,air.Lang.low_battery_des);
        }
        if(parseInt(data.battery)<20){
            $(".i-taskbar-battery-vbg").removeClass("i-taskbar-battery-vbg-full");
            $(".i-taskbar-battery-vbg").addClass("i-taskbar-battery-vbg-low");
        }else if(parseInt(data.battery)==100){
            $(".i-taskbar-battery-vbg").removeClass("i-taskbar-battery-vbg-low");
            $(".i-taskbar-battery-vbg").addClass("i-taskbar-battery-vbg-full");
        }else{
            $(".i-taskbar-battery-vbg").removeClass("i-taskbar-battery-vbg-low i-taskbar-battery-vbg-full");
        }
        $(".layout-taskbar-battery-vt").text(data.battery+"%").attr("title",data.battery_status);                
    }
    var tryConnectSocket = function(){
        air.require("socket").addListener("receive",function(mes){
            mes=mes.substring(0,mes.lastIndexOf("}")+1);
            mes = JSON.parse(mes);
            if(mes.type=="notify"){
                air.require("notify").simpleNotify(
                'http://'+air.Options.ip+':'+air.Options.port+'/?mode=image&package='+mes.data[0].packageName,
                mes.data[0].appName,mes.data[0].tickerText,function(){
                    if(mes.data[0].hasPendIntent)
                        $.get('http://'+air.Options.ip+':'+air.Options.port+'/?mode=device&action=openNotify&activity='+mes.data[0].packageName);
                });
            }else if(mes.type=="status"){
                statusHandle(mes.data);
            }else if(mes.type=="sms"){
                //if($("#"+mes.data.id).length==0)
                console.log(mes.data.id);
                air.require("notify").toast(air.Lang.text_sms+":"+air.Lang[mes.data.mes]);
                $("#"+mes.data.id+" .sms-mes-status").text(air.Lang["sms_status_"+mes.data.mes]);
            }else if(mes.type=="smsR"){
                air.require("SmsPhone").smsReceiver(mes.data);
            }else if(mes.type=="phoneStatus"){
                air.require("SmsPhone").phoneReceiver(mes.data);
            }
        });
    };
    var reConnectSocket=function(){
        $(".layout-notify-container").addClass("refreshing");
        air.require("socket").reConnectSocket();
    };
    var getBaseData = function(){//获取初始的联系人列表和软件列表
        air.require("dataTran").getJson({mode:"device","action":"contacts"},function(data){
            air.Options.baseData.contacts = data;
        });
        air.require("dataTran").getJson({mode:"device","action":"apps"},function(data){
            air.Options.baseData.apps = data;
        });
    };
    
    return {
        getBaseData:getBaseData,
        rander:PublicRander,
        setStyle:PublicSetStyle,
        statusHandle:statusHandle,
        reConnectSocket:reConnectSocket,
        tryConnectSocket:tryConnectSocket
    };
};