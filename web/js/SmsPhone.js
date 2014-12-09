TEMP['SmsPhone'] = function(air){
// TODO: 电话接听，挂断和短信挂断服务器交互
var CountSmsCharacters = function(Words) {
    var sTotal = 0;
    var eTotal = 0;
    for (i = 0; i < Words.length; i++) {
        var c = Words.charAt(i);
        if (c.match(/[^\x00-\xff]/)) {
            sTotal++;
        } else {
            eTotal++;
        }
    }
    var should=sTotal==0?"140":"70";
    return (sTotal+eTotal)+"/"+should;
}
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
        var src='<img src="'+$(".window-sms-list img").attr("src")+'"/>';
        var out=$('<li class="sms-mes-1">'+src+'<div>'+data.content+'<span>'+new Date(parseInt(data.sendtime)).toLocaleString()+'</span></div></li>');
        $(".window-sms-list-scroll").append(out);
        var div = $(".window-sms-list-scroll")[0];
        div.scrollTop = div.scrollHeight;
    }else if($(".window-sms-list").length>0 && $(".window-sms-list").data("address")!=data.sender){
        $(".window-sms-group-list li[data-number='"+data.sender+"']").addClass("new").click(function(){
            $(this).removeClass("new");
        });
        air.require("notify").warningNotify(air.Lang.text_new_sms,data.sender+":"+data.content+"\n"+new Date(parseInt(data.sendtime)).toLocaleString(),function(){
            smsTo(data.sender);
        });
    }else{
        addNum(1);
        air.require("notify").warningNotify(air.Lang.text_new_sms,data.sender+":"+data.content+"\n"+new Date(parseInt(data.sendtime)).toLocaleString(),function(){
            smsTo(data.sender);
        });
    }
    //alert(data.sender+"\n"+data.content+"\n"+new Date(parseInt(data.sendtime)).toLocaleDateString());
};
//---------------------------短信窗口控制
    var loading = null;
    var defaultlimit=20;
    var offfsetNow=0;
    var threadidNow="";
    var downloading=false;
    var SmsWindow = null;
    
    var smsTo = function(num){
        if(SmsWindow==null)
            openSmsWindow(function(){smsToHandle(num);});
        else
            smsToHandle(num);
    };
    var newSms = function(){
        if(SmsWindow==null)
            openSmsWindow(function(){
                newSmsHandle();
            });
        else
            newSmsHandle();
    };
    var newSmsHandle = function(){
        SmsWindow.find(".window-sms-new").click();
    };
    var smsToHandle = function(num){
       var flag = !1;
       SmsWindow.find("ul:eq(0) li").each(function(){
           if(($(this).data("number")+"").indexOf(num)!=-1){
               $(this).click();
               flag = !0;
           }
       });
        if(!flag){
            SmsWindow.find(".window-sms-new").click();
            SmsWindow.find(".window-sms-contact-new-input").val(num);
        }
    };
    
    var openSmsWindow = function(func){
        SmsWindow = air.require("UI").openWindow({
            title:air.Lang.icon_name_sms,
            iconSrc:air.Options.iconPath+"messages_80.png",
            id:"sms_panel",
            onClose:function(){
                SmsWindow=null;
            },
            handles:false
        });
        // 初始化，获取分组并绑定事件
        loading = air.require("util").setLoading(SmsWindow);
        air.require("dataTran").getJson(
            {mode:"device","action":"sms_groups"},
            function(data){
                var json = data.sms;
                var sms_groups="";
                for(k in json){
                    var src='<img src="'+air.Options.imagePath+'default_contact.png" />';
                    if(parseInt(json[k].photoid)>0)
                        src='<img data-src="http://'+air.Options.ip+':'+air.Options.port+'/?mode=image&phoneid='+json[k].photoid+'" src=""/>';
                        if(json[k].name=="")json[k].name=json[k].strAddress;
                    sms_groups+='<li data-number="'+json[k].strAddress+'" data-name="'+json[k].name+'" data-threadid="'+json[k].thread_id+'">'+src+'<div><span class="name">'+json[k].name+"("+json[k].count+')</span><span class="body">'+json[k].strbody+'</span></div></li>';
                }
                var o={
                    text_sendto:air.Lang.text_sendto,
                    text_new:air.Lang.text_new,
                    text_more:air.Lang.text_more,
                    sms_groups:sms_groups,
                    text_send:air.Lang.text_send
                };
                air.require("Templete").getTemplate("window-sms",function(temp){
                    air.require("initAir").setStyle(air.Options.themePath+"window-sms.css","window-sms");
                    SmsWindow.setContent(air.require("UI").substitute(temp,o));
                    var test = setInterval(function(){//等待style到位
                        if($(".window-sms-group ul li img").width()=="50"){
                            clearInterval(test);
                            air.require("myLazyLoad").lazyLoad(SmsWindow.find(".window-sms-group"),"img","src","src");
                        }
                    },1);
                    loading.remove();
                    SmsWindow.delegate("ul:eq(1) li","click",function(){
                        SmsWindow.find("ul:eq(1) li").removeClass("select");
                        $(this).addClass("select");
                    });
                    SmsWindow.find(".window-sms-list-scroll li:first").click(function(){
                        insert(threadidNow);
                    });
                    // 绑定分组点击时间
                    SmsWindow.delegate("ul:eq(0) li","click",function(){
                        if($(this).hasClass("select"))return false;
                        SmsWindow.find("ul:eq(0) li").removeClass("select");
                        $(this).addClass("select");
                        var temp = $(this).data("threadid");
                        if(threadidNow!=temp){
                            threadidNow = temp;
                            offfsetNow=0;
                            SmsWindow.find(".window-sms-list-scroll li").not(":first").remove();
                        }
                        if(temp!="-1"){
                            insert();
                            SmsWindow.find(".window-sms-list").data("address",$(this).data("number"));
                            SmsWindow.find(".window-sms-contact-name").text($(this).data("name"));
                            SmsWindow.find(".window-sms-contact-number").text($(this).data("number"));
                        }
                    });
                    //绑定短信文本框的计数功能
                    SmsWindow.find(".window-sms-send textarea").keyup(function(){
                        SmsWindow.find(".window-sms-send span").text(CountSmsCharacters($(this).val()));
                    });
                    // 绑定发送功能
                    SmsWindow.find(".window-sms-send button").click(function(){
                        var text = SmsWindow.find(".window-sms-send textarea").val();
                        if(text=="")return false;
                        var number = SmsWindow.find(".window-sms-contact-number").text();
                        if(SmsWindow.find(".window-sms-contact-new").is(":visible")){
                            number = SmsWindow.find(".window-sms-contact-new-input").val();
                            console.log(SmsWindow.find(".window-sms-contact-new").is(":visible"));
                        }
                        send(number,text);
                    });
                    //新建短信
                    SmsWindow.find(".window-sms-new").click(function(){
                        if(SmsWindow.find("ul:eq(0) li:first").data("threadid")=="-1"){
                            SmsWindow.find("ul:eq(0) li:first").click();
                            return false;
                        }
                        var s = $('<li data-number="" data-name="" data-threadid="-1"><img src="'+air.Options.imagePath+'default_contact.png" /><div><span class="name">新建</span><span class="body"></span></div></li>');
                        SmsWindow.find("ul:eq(0)").prepend(s);
                        s.click(function(){
                            SmsWindow.find(".window-sms-list-scroll li:first").hide();
                            SmsWindow.find(".window-sms-list-scroll li").not(":first").remove();
                            SmsWindow.find(".window-sms-contact-dialog").hide();
                            SmsWindow.find(".window-sms-contact-new").css("display","block");
                        }).click();
                        $(".window-sms-contact-new-input").val("").focus();
                    });
                    //新建短信
                    if(func){
                        func();
                    }else{
                        //自动点击第一个会话
                        SmsWindow.find("ul:eq(0) li:first").click();
                    }
                });
            },function(e,t){
                loading.remove();
                console.log(e);
                SmsWindow.setContent("加载失败..."+t);
            },function(){
                downloading=false;
            }
        );
    };
    
    // 获取信息列表插入
    var insert = function(){
        if(downloading)return false;
        downloading=true;
        loading = air.require("util").setLoading(SmsWindow);
        SmsWindow.find(".window-sms-list-scroll li:first").show();
        SmsWindow.find(".window-sms-contact-dialog").show();
        SmsWindow.find(".window-sms-contact-new").hide();
        air.require("dataTran").getJson(
            {mode:"device","action":"sms","threadid":threadidNow,"limit":defaultlimit,"offset":offfsetNow},
            function(data){
                offfsetNow+=defaultlimit;
                var json = data.sms;
                if(json){
                    var out="";
                    var head = SmsWindow.find("ul:eq(0) li.select").find("img").attr("src");
                    for(var k=json.length-1;k>=0;k--){
                        var src="",status="";
                        if(json[k].type=="1")
                            src='<img src="'+head+'"/>';
                        else
                            status = '<span class="sms-mes-status">'+air.Lang.sms_status_received+'</span>';
                        out+='<li class="sms-mes-'+json[k].type+'">'+src+'<div>'+json[k].strbody+'<span>'+new Date(parseInt(json[k].strDate)).toLocaleString()+'</span></div>'+status+'</li>';
                    }
                    out = $(out);
                    SmsWindow.find(".window-sms-list-scroll li:first").after(out);
                    SmsWindow.find(".window-sms-list-scroll").scrollTop(out.last().offset().top);
                }
            },function(e,t){
                console.log(e);
                SmsWindow.setContent("加载失败..."+t);
            },function(){
                loading.remove();
                downloading=false;
            }
        );
    };
    // 发送短信息
    var send = function(number,text){
        loading = air.require("util").setLoading(SmsWindow.find(".window-sms-send"));
        var id = new Date();
        air.require("dataTran").getJson(
            {mode:"device","action":"sendsms","number":number,"text":text,"id":"sms-"+id.getTime()},
            function(data){
                if(data.status=="ok"){
                    air.require("notify").toast(air.Lang.text_sms+":"+air.Lang.text_sms_success);
                    SmsWindow.find(".window-sms-send textarea").val("");
                    var out = $('<li id="sms-'+id.getTime()+'" class="sms-mes-2"><div>'+text+'<span>'+id.toLocaleString()+'</span></div><span class="sms-mes-status"></span></li>');
                    SmsWindow.find(".window-sms-list-scroll").append(out);
                    var div = SmsWindow.find(".window-sms-list-scroll")[0];
                    div.scrollTop = div.scrollHeight;
                }
            },
            function(){
                    air.require("notify").alertNotify(air.Lang.text_sms,air.Lang.text_sms_fail);
            },
            function(){
                loading.remove();
            }
        );
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
            timeCounting();destoryShake();
            callingWindow.find(".phone-answer").slideUp();
            // TODO---接听
            $.get('http://'+air.Options.ip+':'+air.Options.port+'/?mode=device&action=answerPhone');
        });
        callingWindow.find(".phone-reject").click(function(){
            callingDown(air.Lang.incoming_call_has_been_rejected);
            // TODO---挂断
            $.get('http://'+air.Options.ip+':'+air.Options.port+'/?mode=device&action=endCall');
        });
        callingWindow.find(".phone-reject-message").click(function(){
            //用短信挂断
            var num = callingWindow.find(".phone-number").text();
            smsTo(num);
            callingDown(air.Lang.incoming_call_has_been_rejected);
            $.get('http://'+air.Options.ip+':'+air.Options.port+'/?mode=device&action=endCall');
            // TODO---用短信挂断
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
            var r = $("<ul></ul>");
            var res = air.require("topbar").contactSearchAry(text);
            $.each(res,function(i,v){
                $('<li><b>'+v.name+'</b><span class="num">'+v.num+'</span><span class="fr"><button class="call">拨打</button><button class="sms">发送短信</button></span></li>').appendTo(r);
            });
            tar.html(r);
        }).val(num);
        DialPanel.find(".dial-panel-num-buttons div").click(function(){
            var text = DialPanel.find(".dial-panel-input").val()+$(this).text();
            DialPanel.find(".dial-panel-input").val(text);
        });
        DialPanel.find(".dial-panel-call").click(function(){
            var num = DialPanel.find(".dial-panel-input").val();
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
            smsTo(DialPanel.find(".dial-panel-input").val());
        });
    };
//---------------------------------
    return {
        smsReceiver:smsReceiver,
        openSmsWindow:openSmsWindow,
        phoneReceiver:phoneReceiver,
        showDialPanel:showDialPanel,
        callNum:showDialPanel,
        smsTo:smsTo,
        newSms:newSms
    };
};