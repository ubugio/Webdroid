TEMP['ScreenManage'] = function(air){
    var ScreenShotUrl = 'http://'+air.Options.ip+':'+air.Options.port+'/?mode=screen&action=shot';
    // 屏幕显示窗口，首先是截图一张，而后点击录屏则定时截图
    var ScreenContainer=null,loading=null;
    var fps = 0;
    var options={
        w:270,
        h:480,
        q:"poor"
    };
    var openScreen = function(){
        if(ScreenContainer!=null)return false;
        ScreenContainer = air.require("UI").openWindow({
            title:air.Lang.screenShot,
            iconSrc:air.Options.iconPath+"screenshot_80.png",
            width:options.w,
            height:options.h+80,
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
        ScreenContainer.setContent(air.require("Templete").screenShotTemplate);
        ScreenContainer.find(".screen-shot-imageContain img").css({"width":options.w,"height":options.h});
        loading = air.require("windowHandles").setLoading(ScreenContainer);
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
            loading = air.require("windowHandles").setLoading(ScreenContainer);
            getScreenShot(options.w,options.h,options.q,function(){
                loading.remove();
            });
        });
        ScreenContainer.find(".screen-shot-button-quality select").change(function(){
            options.q=$(this).val();
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
            fps=1000/(new Date().getTime()-st);
            func && func();
        };
    };
    var Recording = false;
    var screenRecordSatrt = function(){
        Recording = true;screenLoop();
    };
    var screenLoop=function(){
        if(Recording){
            ScreenContainer.find(".screen-shot-imageContain .screen-shot-fps").text(fps+"fps");
            getScreenShot(options.w,options.h,options.q,function(){
                screenLoop();
            });
        }
    };
    var screenRecordStop = function(){
        Recording = false;
        ScreenContainer.find(".screen-shot-imageContain .screen-shot-fps").text("");
    };
    
    
    return {
        openScreen:openScreen,
        getScreenShot:getScreenShot,
        removeScreenContainer:removeScreenContainer,
        screenRecordSatrt:screenRecordSatrt,
        screenRecordStop:screenRecordStop
    };
};