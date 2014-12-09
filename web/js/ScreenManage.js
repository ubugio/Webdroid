TEMP['ScreenManage'] = function (air) {
    var ScreenShotUrl = 'http://' + air.Options.ip + ':' + air.Options.port + '/?mode=screen&action=shot';
    // 屏幕显示窗口，首先是截图一张，而后点击录屏则定时截图
    var ScreenContainer = null,loading=null;
    var fps = 0;
    var options={
        w:270,
        h:480,
        q:"oo"
    };
    var openScreen = function(){
        if(ScreenContainer!=null)return false;
        ScreenContainer = air.require("UI").openWindow({
            title:air.Lang.screenShot,
            iconSrc:air.Options.iconPath+"screenshot_80.png",
            width:options.w*2,
            height:options.h+56,
            zIndex:99999,
            fixZindex:true,
            onClose:function(){
                removeScreenContainer();
            },
            id:"screenshot",
            draggable:true,
            tab:false,
            handles:false
        });
        air.require("initAir").setStyle(air.Options.themePath+"window-screen.css","window-screen");
        air.require("Templete").getTemplate("window-screen",function(temp){
            ScreenContainer.setContent(temp);
            ScreenContainer.find(".screen-shot-imageContain img").css({"width":options.w,"height":options.h});
            $("#screen-shot-canvas").attr({"width":options.w,"height":options.h});
            loading = air.require("util").setLoading(ScreenContainer.find(".screen-shot-imageContain"));
            getScreenShot(options.w,options.h,options.q);
            ScreenContainer.find(".screen-shot-button-interval").click(function(){
                if(!Recording){
                    $(this).addClass("active");
                    screenRecordSatrt();
                }else{
                    $(this).removeClass("active");
                    screenRecordStop();
                }
            });
            ScreenContainer.find(".screen-shot-button-fullScreen").click(function(){
                alert("not ready");
            });
            ScreenContainer.find(".screen-shot-button-refresh").click(function(){
                loading = air.require("util").setLoading(ScreenContainer.find(".screen-shot-imageContain"));
                getScreenShot(options.w,options.h,options.q,function(){
                    loading.remove();
                });
            });
            ScreenContainer.find(".screen-shot-button-quality select").change(function(){
                options.q=$(this).val();
            });
            bindButtons(ScreenContainer);
        });
    };
    var removeScreenContainer = function(){
        ScreenContainer.remove();ScreenContainer=null;screenRecordStop();
    };
    var getScreenShot = function(w,h,q,func){
        var imgUrl = ScreenShotUrl+'&width='+w+'&height='+h+'&quality='+q+"&times="+new Date().getTime();
        var img = new Image();
        img.src = imgUrl;
        var st=new Date().getTime();
        img.onload = function () {
            ScreenContainer.find(".screen-shot-imageContain img").attr("src",imgUrl);
            if(loading!=null)loading.remove();
            fps=Math.round(100000/(new Date().getTime()-st))/100;
            func && func();
        };
    };
    var Recording = false;
    var screenRecordSatrt = function(){
        Recording = true;screenLoop();
    };
    var screenLoop=function(){
        if(Recording){
            ScreenContainer.find(".screen-shot-fps").text(fps+"fps");
            getScreenShot(options.w,options.h,options.q,function(){
                screenLoop();
            });
        }
    };
    var screenRecordStop = function(){
        Recording = false;
        ScreenContainer.find(".screen-shot-fps").text("");
    };
//-------------------------------------------------------
//http://192.168.1.100:7910/?mode=runcmd&action=button&button=3
var ip = 'http://'+air.Options.ip+':'+air.Options.port+'/';
var bindButtons = function(tar){
    tar.find(".screen-shot-button-home").click(function(){
        air.require("runCommond").button("HOME");
    });
    tar.find(".screen-shot-button-return").click(function(){
        air.require("runCommond").button("BACK");
    });
    tar.find(".screen-shot-button-menu").click(function(){
        air.require("runCommond").button("MENU");
    });
    var swip = false;
    var canvas = $("#screen-shot-canvas")[0];
    var ctx = canvas.getContext('2d');
    var cW = $(canvas).width();
    var cH = $(canvas).height();
    tar.find(".screen-shot-imageContain").mousedown(function(e){
        var t = new Date();
        var x=$(this).offset();
        var w=$(this).width();
        var h=$(this).height();
        var sx = e.pageX,sy = e.pageY;
        var wp =parseInt(100*(sx - x.left)/w),hp =parseInt(100*(sy - x.top)/h);
        ctx.beginPath();
        ctx.arc((sx - x.left), (sy - x.top), 6, 0, Math.PI*2, true); 
        ctx.fillStyle = "#CC0000"; 
        ctx.fill();
        ctx.closePath();
        $(document).mousemove(function(e1){
            swip = true ;
            ctx.clearRect(0,0,cW,cH);
            ctx.beginPath();
            ctx.arc((sx - x.left), (sy - x.top), 6, 0, Math.PI*2, true); 
            ctx.fillStyle = "#CC0000"; 
            ctx.fill();
            ctx.moveTo((sx - x.left), (sy - x.top));
            ctx.lineTo((e1.pageX - x.left), (e1.pageY - x.top));
            ctx.lineWidth = 1.0;
            ctx.strokeStyle = "#CC0000";
            ctx.stroke();
            ctx.closePath();
        }).mouseup(function(en){
            if(swip){
                console.log("swip");
                swip = false ;
                var wp2 =parseInt(100*(en.pageX - x.left)/w);
                var hp2 =parseInt(100*(en.pageY - x.top)/h);
                var tg = new Date()-t;
                air.require("runCommond").slide([wp,hp],[wp2,hp2],tg);
            }else{
                console.log("click");
                air.require("runCommond").touch(wp,hp);
            }
            ctx.clearRect(0,0,cW,cH);
            $(document).unbind("mousemove mouseup");
            return false;
        });
    });
};
//-------------------------------------------------------
    
    return {
        openScreen:openScreen,
        getScreenShot:getScreenShot,
        removeScreenContainer:removeScreenContainer,
        screenRecordSatrt:screenRecordSatrt,
        screenRecordStop:screenRecordStop
    };
};