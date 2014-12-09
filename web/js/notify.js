TEMP['notify'] = function(air){
    window.Notification = window.Notification || window.webkitNotifications;
    var notifiesLists=[];
//-------------------------------------notifyDesktop
    var Desktoptimeing={};
    var notifyND=0;
    var notifyDesktop = function(option){
        var defaultOptions={
            id:"default"+notifyND++,
            icon:"",
            title:"",
            text:"",
            onclick:null,
            autoFadeOut:air.Options.NotifyAutoFadeOutTime
        };
        option = $.extend(defaultOptions,option);
        if(window.Notification){
            if (!(window.Notification.permission == 'granted' || window.Notification.length>0)) {
                RequestPermission(function(){
                    notifyDesktop(option);
                });
            }else {
                try{
                    notifiesLists.push({
                        icon:option.icon,
                        title:option.title,
                        text:option.text
                    });
                    window._notification = new Notification(option.title,{body:option.text,icon:option.icon,tag:option.id});//,tag:title
                    _notification.onshow=function(){
                        console.log("try onshow");
                        if(Desktoptimeing[option.id]){
                            clearTimeout(Desktoptimeing[option.id]);
                        }
                        if(option.autoFadeOut)
                            Desktoptimeing[option.id] = setTimeout(function(){
                                console.log("try closing");
                                _notification.close();
                                Desktoptimeing[option.id]=null;
                            },option.autoFadeOut);
                    };
                    _notification.onclick=function(){
                        if(option.onclick){
                            option.onclick();
                        }
                        _notification.close();
                    };
                }catch(e){
                    console.log(e);
                }
            }
        }else{
            console.log("Notification 未启用");
        }
    };
    function RequestPermission(callback) {
        window.Notification.requestPermission(callback);
    }
    
//-------------------------------------notifyInwindow
    var notifies={};
    var notifyN=0;
    var Localtimeing={};
    var template = air.require("Templete").notifyLocalTemplate;
    var notifyLocal = function(option){
        var defaultOptions={
            id:"default"+notifyN++,
            icon:"",
            title:"",
            text:"",
            onclick:null,
            autoFadeOut:air.Options.NotifyAutoFadeOutTime
        };
        option = $.extend(defaultOptions,option);
        option.text = option.text.replace("\n","<br />");
        var o={
            ID:option.id,
            IMG:'<img src="'+option.icon+'" />',
            TITLE:option.title,
            TEXT:option.text
        };
        var tar = $(air.require("UI").substitute(template,o));
        if($(".notify-"+option.id).length>0){
            if(Localtimeing[option.id])clearTimeout(Localtimeing[option.id]);
            $(".notify-"+option.id).remove();
        }
        notifiesLists.push({
            icon:option.icon,
            title:option.title,
            text:option.text
        });
        air.Options.notifyContainer.prepend(tar);
        if(option.autoFadeOut)
            Localtimeing[option.id]=setTimeout(function(){tar.fadeOut(function(){$(this).remove();});},option.autoFadeOut);
        tar.click(function(){
            if(option.onclick){
                option.onclick();
            }
            if(Localtimeing[option.id])
                clearTimeout(Localtimeing[option.id]);
            tar.fadeOut(function(){$(this).remove();});
        });
    };
//------------------------
var simpleNotify=function(icon,title,text,click){
    var opt = {icon:icon,title:title,text:text,id:title.replace(" ",""),onclick:click};
    if(air.Options.windowActive){
        notifyLocal(opt);
    }else{
        notifyDesktop(opt);
    }
};
var notify=function(opt){
    if(air.Options.windowActive){
        notifyLocal(opt);
    }else{
        notifyDesktop(opt);
    }
};
//--------------------------
var alertNotify=function(title,text,click){
    simpleNotify(air.Options.imagePath+"icon-alert.png",title,text,click);
};
var warningNotify=function(title,text,click){
    simpleNotify(air.Options.imagePath+"icon-inf.png",title,text,click);
};
var removeNotify=function(id){
    if($(".notify-"+id).length>0){
        $(".notify-"+id).remove();
    }
};
//------------------------------
    var toastT=null;
    var toast=function(text,time){
        var time = time?time:1000;
        if(toastT!=null){clearTimeout(toastT);}
        $(".layout-toast-content").text(text);
        $(".layout-toast").fadeIn(function(){
            toastT = setTimeout(function(){
                $(".layout-toast").fadeOut();
            },time);
        });
    };
    return {
        toast:toast,
        notifiesList:notifiesLists,
        removeNotify:removeNotify,
        notify:notify,
        simpleNotify:simpleNotify,
        notifyDesktop:notifyDesktop,
        notifyLocal:notifyLocal,
        alertNotify:alertNotify,
        warningNotify:warningNotify
    };
};