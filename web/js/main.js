$(function(){
    // 主程序类
    var Air = function(config){
        window.TEMP = {};
        var _t=this;
        _t.Options={
            debug:!0,
            ip:"",
            port:"",
            socketPort:"",
            remoteUrl:"http://droid4web.sinaapp.com/",
        
            theme:"default",
            version:"1.0",
            uploadPath:"sdcard/air",
            
            baseData:{
                contacts:null,
                apps:null
            },
            
            heartBeatInterval:10000,
            heartBeatFaultTimesMax:5,
            icon_width : 90,
            icon_height : 105,
            ScreenSize:[0,0],
            icons_Order : [],//["device", "help", "contacts", "sms", "apps", "files", "upload", "notifies", "phones", "musics", "images", "videos"],
            tabContainer : $(".container-tabs"),
            iconContainer : $(".container-icons"),
            windowContainer : $(".container-windows"),
            notifyContainer : $(".layout-notifies"),
            popupContainer : $(".layout-popup"),
            windowActive:true,
            NotifyAutoFadeOutTime:10000
        };
        $.extend(_t.Options,config);
        _t.Options.uploadFilePath = "./common/upload/";
        _t.Options.themePath = "./theme/"+_t.Options.theme+"/";
        _t.Options.imagePath = _t.Options.themePath+"images/";
        _t.Options.iconPath = _t.Options.imagePath+"icons/";
        _t.Options.templatePath = _t.Options.themePath+"template/";
        _t.Options.language = (navigator.language || navigator.systemLanguage).toLocaleUpperCase();
        
        $(window).resize(function(){
            _t.Options.ScreenSize=[$(window).width(),$(window).height()];
            $(".desktop").height(_t.Options.ScreenSize[1]-75); 
        }).resize();
        $(window).focus(function(){_t.Options.windowActive=true;});
        $(window).blur(function(){_t.Options.windowActive=false;});
        $(".desktop").on("click",function(){
            $(".icon").removeClass("select");
        });
        document.onselectstart=function(){return false;};
        window.document.ondragstart=function(){window.event.returnValue = false;};
		//document.oncontextmenu=rf;
        _t.MOUDLES={};
        _t.Lang = _t.require("Lang-"+_t.Options.language);
        var init = _t.require("initAir").rander();
        
    };
    // 主程序动态方法
    Air.prototype={
        getMoudle:function(moudle){
            var _t=this;
            $.ajax({
                url:"./js/"+moudle+".js",
                type:"get",
                dataType:"script",
                async:false,
                success:function(script){
                    _t.MOUDLES[moudle]=TEMP[moudle](_t,Air);
                },
                error:function(e,t){
                    console.log(e);
                    Air.LOG("Air.getMoudle",moudle+"|"+t);
                }
            });
        },
        require:function(moudle){
            if(this.MOUDLES[moudle]){
                return this.MOUDLES[moudle];
            }else{
                this.getMoudle(moudle);
                return this.MOUDLES[moudle];
            }
        }
    };
    // 主程序静态方法
    Air.LOG=function(tag,msg){
        console.log(tag+"===>"+msg);
    };
    window.air = new Air();
});