TEMP['ScreenManage'] = function(air){
    var ScreenShotUrl = 'http://'+air.Options.ip+':'+air.Options.port+'/?mode=screen&action=shot';
    // 屏幕显示窗口，首先是截图一张，而后点击录屏则定时截图
    var ScreenContainer=null;
    var openScreen = function(){
        ScreenContainer = air.require("UI").openWindow({
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
    };
    
    
    return {
        getJson:getJsonFromUrlDefault,
        getJsonFromUrl:getJsonFromUrl,
    };
};