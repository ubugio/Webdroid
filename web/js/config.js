TEMP['config'] = function(air){
    var _config = {
        theme:"default",
        heartBeatInterval:10000,
        heartBeatFaultTimesMax:5,
        icon_width : 90,
        icon_height : 105,
        icons_Order : ["device", "help", "contacts", "sms", "apps", "files", "upload", "notifies", "phones", "musics", "images", "videos"],
        NotifyAutoFadeOutTime:10000
    };
    var getConfig = function(name){
        if(_config==null){
            air.require("dataTran").getJsonFromUrl(air.Options.remoteUrl+"api/getConfig.php",data,suc,fail,comp);
        }
    };
    var saveConfig = function(){
        
    };
    return {
        get:getConfig,
        save:saveConfig
    };
};