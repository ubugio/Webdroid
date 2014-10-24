TEMP['SmsPhone'] = function(air){
//TODO
// 电话接听，挂断和短信挂断服务器交互
//------------------------短信状态
var addNum=function(num){
    if($("#icon-sms .num").length>0){
        num += parseInt($("#icon-sms .num").text());
        cancelNum();
    }
    var num = $('<span class="num">'+num+'<span>');
    $("#icon-sms").append(num);
};
var cancelNum=function(){
    $("#icon-sms .num").remove();
};
$("#icon-sms").dblclick(function(){
    cancelNum();
});
var smsReceiver=function(data){
    console.log("new message");
    if($(".window-sms-list").length>0 && $(".window-sms-list").data("address")==data.sender){
        var src='<img src="'+$(".window-sms-contact-head img").attr("src")+'"/>';
        var out=$('<li class="sms-mes-1">'+src+'<div>'+data.content+'<span>'+new Date(parseInt(data.sendtime)).toLocaleString()+'</span></div></li>');
        $(".window-sms-list-scroll").append(out);
        var div = $(".window-sms-list-scroll")[0];
        div.scrollTop = div.scrollHeight;
    }else if($(".window-sms-list").length>0 && $(".window-sms-list").data("address")!=data.sender){
        $(".window-sms-group-list li[data-number='"+data.sender+"']").addClass("new").click(function(){
            $(this).removeClass("new");
        });
        air.require("notify").warningNotify(air.Lang.text_new_sms,data.sender+":"+data.content+"<br />"+new Date(parseInt(data.sendtime)).toLocaleString());
    }else{
        addNum(1);
        air.require("notify").warningNotify(air.Lang.text_new_sms,data.sender+":"+data.content+"<br />"+new Date(parseInt(data.sendtime)).toLocaleString());
    }
    //alert(data.sender+"\n"+data.content+"\n"+new Date(parseInt(data.sendtime)).toLocaleDateString());
};

//---------------------------电话状态
    var callingWindow=null;
    var currentStatus=0,status=["normal","calling","ringing"];
    var phoneReceiver=function(data){
        if(data.status==1 && currentStatus==0){
            //去电呼叫中...
            var src=air.Options.imagePath+'default_contact.png';
            if(parseInt(data.photoid)>0)
                src='http://'+air.Options.ip+':'+air.Options.port+'/?mode=image&phoneid='+data.photoid;
            if(data.name=="")data.name=data.number;
            if(callingWindow==null)
                calling("outgoing",data.name,src,data.number);
            timeCounting();
        }else if(data.status==2 && currentStatus==0){
            //来电待接中...
            var src=air.Options.imagePath+'default_contact.png';
            if(parseInt(data.photoid)>0)
                src='http://'+air.Options.ip+':'+air.Options.port+'/?mode=image&phoneid='+data.photoid;
            if(data.name=="")data.name=data.number;
            if(callingWindow==null)
                calling("incoming",data.name,src,data.number);
        }else if(data.status==0 && currentStatus==1){
            //通话中断
            callingDown(air.Lang.call_has_been_rejected);
        }else if(data.status==0 && currentStatus==2){
            //响铃挂断
            callingDown(air.Lang.incoming_call_has_been_rejected);
        }else if(data.status==1 && currentStatus==2){
            //响铃接听
            timeCounting();destoryShake();
            callingWindow.find(".phone-answer").slideUp();
        }
        currentStatus=data.status;
    };
    //取消通话窗口
    var callingDown = function(txt){
        if(callingWindow!=null){
            destoryShake();
            destoryFadeHead();
            callingWindow.find(".phone-name").text(txt);
            var ti = (txt==""||txt==undefined)?0:2000;
            setTimeout(function(){callingWindow.find(".window_close").click();callingWindow=null;},ti);
            cancelCounting();
        }
    };
    //通话窗口头像颤动
    var shaking=null,shakingS=null,h=4,i=6;
    var startShake =function(){
        shaking = setInterval(function(){
            var e = Math.floor(Math.random() * (h + 1)) - h / 2,
            a = Math.floor(Math.random() * (i + 1)) - i / 2,
            e = e === 0 && h !== 0 ? Math.random() < 0.5 ? 1 : -1 : e,
            a = a === 0 && i !== 0 ? Math.random() < 0.5 ? 1 : -1 : a;
            callingWindow.find(".phone-panel img").css({
                left: e + "px",
                top: a + "px"
            });
        }, 30);
        shakingS = setTimeout(function(){stopShake();},2000);
    };
    var stopShake =function(){
        if(shaking!=null){
            clearInterval(shaking);shaking=null;
            shakingS = setTimeout(function(){startShake();},2000);
        }
    };
    var destoryShake =function(){
        if(shaking!=null){
            clearInterval(shaking);shaking=null;
        }
        if(shakingS!=null){
            clearTimeout(shakingS);shakingS=null;
        }
    };
    //通话窗口头像显隐
    var fading = null;
    var fadingN=100,fadeT=-1,rotate=0;
    var fadeHead=function(){
        fading = setInterval(function(){
            rotate+=0.5;
            callingWindow.find(".phone-panel img").css({
                "opacity": fadingN/100,
                "transform":"rotate("+rotate+"deg)"
            });
            fadingN+=fadeT;
            if(fadingN==19){fadingN=20;fadeT=1;}
            if(fadingN==101){fadingN=100;fadeT=-1;}
        }, 20);
    };
    var destoryFadeHead=function(){
        if(fading!=null){
            clearInterval(fading);fading=null;
            fadingN=100;fadeT=-1;
        }
        callingWindow.find("img").css({opacity: 1,"transform":"rotate(0deg)"});
    };
    //打开通话窗口主事件
    var calling = function(status,name,head,number){
        callingWindow = air.require("UI").openWindow({
            title:status=="incoming"?air.Lang.incoming_call:air.Lang.outgoing_call,
            iconSrc:air.Options.iconPath+"phone_80.png",
            width:300,
            height:300,
            zIndex:99999,
            fixZindex:true,
            onClose:function(){
                callingDown();
            },
            id:"calling_oncalling",
            draggable:true,
            tab:false,
            handles:false
        });
        callingWindow.setContent(air.require("UI").substitute(air.require("Templete").callingTemplate,{
            HEAD:head,
            NUMBER:number,
            NAME:name,
            INCOMING:status,
            ANWSER:air.Lang.answer_phone,
            REJECT:air.Lang.reject_phone,
            REJECT_WITH_MESSAGE:air.Lang.reject_phone_with_message,
        }));
        if(status=="incoming"){
            startShake();
        }else if(status=="outgoing"){
            fadeHead();
        }
        callingWindow.find(".phone-answer").click(function(){
            //接听
            timeCounting();destoryShake();
            callingWindow.find(".phone-answer").slideUp();
            // TODO---
        });
        callingWindow.find(".phone-reject").click(function(){
            //挂断
            callingDown(air.Lang.incoming_call_has_been_rejected);
            // TODO---
        });
        callingWindow.find(".phone-reject-message").click(function(){
            //用短信挂断
            // TODO---
        });
    };
    //通话窗口计时器
    var nowT=null,counter=null;
    var timeCounting = function(){
        nowT=new Date();
        var viewer = callingWindow.find(".phone-counter").slideDown();
        counter = setInterval(function(){
            var now = new Date();
            var gap = now-nowT;
            viewer.text(air.require("player").secondFormat(gap/1000));
        },100);
    };
    var cancelCounting = function(){
        if(counter!=null){
            clearInterval(counter);counter=null
        }
    };
//---------------------------拨打电话模块
    var DialPanel = null;
    var removeDialPanel = function(){
        if(DialPanel!=null)
            DialPanel.remove();
    };
    var showDialPanel = function(num){
        num = num?num:"";
        DialPanel = air.require("UI").openWindow({
            title:air.Lang.dial_panel,
            iconSrc:air.Options.iconPath+"phone_80.png",
            width:220,
            height:300,
            zIndex:99999,
            fixZindex:true,
            onClose:function(){
                removeDialPanel();
            },
            id:"dial_panel",
            draggable:true,
            tab:false,
            handles:false
        });
        DialPanel.setContent(air.require("UI").substitute(air.require("Templete").dialPanelTemplate,{
            CALL:air.Lang.call,
            MESSAGE:air.Lang.message
        }));
        DialPanel.find(".dial-panel-input").keyup(function(){
            var text = DialPanel.find(".dial-panel-input").val();
            DialPanel.find(".dial-panel-input").val(text);
        }).val(num);
        DialPanel.find(".dial-panel-num-buttons div").click(function(){
            var text = DialPanel.find(".dial-panel-input").val()+$(this).text();
            DialPanel.find(".dial-panel-input").val(text);
        });
        DialPanel.find(".dial-panel-call").click(function(){
            var num = DialPanel.find(".dial-panel-input").val();
            // TODO---拨打电话
            air.require("dataTran").getJson({mode:"device","action":"call","num":num},function(data){
                if(data.status=="ok"){
                    console.log("callTo:"+num);
                }
            });
        });
        DialPanel.find(".dial-panel-delete").click(function(){
            var text = DialPanel.find(".dial-panel-input").val();
            DialPanel.find(".dial-panel-input").val(text.substring(0,text.length-1));
        });
        DialPanel.find(".dial-panel-message").click(function(){
            // 发送短信
            console.log("smsTo:"+DialPanel.find(".dial-panel-input").val());
            // TODO---
        });
    };
//---------------------------------
    return {
        smsReceiver:smsReceiver,
        phoneReceiver:phoneReceiver,
        showDialPanel:showDialPanel,
        callNum:showDialPanel,
    };
};