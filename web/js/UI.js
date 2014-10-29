TEMP['UI'] = function(air){
    var theme = air.Options.theme;
    var themePath = "./theme/"+theme+"/";
    var iconPath = themePath+"icons/";
    var iconContainer = air.Options.iconContainer;
    var windowContainer = air.Options.windowContainer;
    var tabContainer = air.Options.tabContainer;
    var w = air.Options.icon_width;
    var h = air.Options.icon_height;
    var templete = air.require("Templete");
    var iconTemplate = templete.iconTemplate;
    var windowTemplate = templete.windowTemplate;
    var tabTemplate = templete.tabTemplate;
    var iconIndex = -1;
    var icons = {};
    var icons_Order=[];
    var windowIndex = -1;
    var windowZindex = 100;
    var windows = {};
    var tabIndex = -1;
    var tabs = {};
    var v_n=0;
    var iconContainer_ajust=0;
    var resetIcons = function(icons_Order){
        v_n=Math.floor(($(".desktop").height())/h);
        iconContainer_ajust=($(".desktop").height()-v_n*h)/2;
        iconContainer.css("top",iconContainer_ajust+"px");
        $.each(icons_Order,function(i,v){
            var t_i = i%v_n;
            var l_i = (i-t_i)/v_n;
            $(".icon#icon-"+icons_Order[i]).css({"top":(t_i*h)+"px","left":(l_i*w+20)+"px"});
        });
    };
    $(window).resize(function(){
        resetIcons(air.Options.icons_Order);
    }).resize();
    
    //模版替换函数
    var PrivateSubstitute = function (str,o,regexp){
        return str.replace(regexp || /\\?\{([^{}]+)\}/g, function (match, name) {
            return (o[name] === undefined) ? '' : o[name];
        });
    };
    //注入icon函数
    var PublicNewIcon = function(config){
        var _t=this;
        var option = {
            name:"",
            src:"",
            id:++iconIndex,
            click:function(){
                _t.openWindow({
                    title:option.name,
                    iconSrc:option.src,
                    id:config.id||option.id
                });
            },
            doubleClick:null,
            draggable:true
        };
        $.extend(option,config);
        //解析模版
        icons[option.id] = $(PrivateSubstitute(iconTemplate,{
            ID:option.id,
            TITLE:option.name,
            imgSRC:option.src,
            INDEX:iconIndex
        }));
        //绑定点击事件
        if(option.click) icons[option.id].dblclick(option.click);
        icons[option.id].click(function(e){
            $(".icon").removeClass("select");
            $(this).addClass("select");
            e.stopPropagation();
        });
        //注入节点并返回
        iconContainer.append(icons[option.id]);
        // 设置icon位置
        resetIcons(air.Options.icons_Order);
        return icons[option.id];
    };
    //打开window函数
    var PublicOpenWindow=function(config){
        var _t=this;
        var option = {
            title:"",
            iconSrc:"",
            width:800,
            height:520,
            zIndex:windowZindex++,
            fixZindex:false,
            id:++windowIndex,
            onClose:null,
            onMin:null,
            draggable:true,
            tab:true,
            handles:true
        };
        $.extend(option,config);
        if(windows[option.id]){
            //windows[option.id].active();
            Air.LOG("UI:OpenWindow",air.Lang.window_aleardy_existed);
            return false;
        }
        //解析模版
        windows[option.id] = $(PrivateSubstitute(windowTemplate,{
            ID:option.id,
            appTitle:option.title,
            appIcon:option.iconSrc,
            WIDTH:option.width,
            HEIGHT:option.height,
            CONTENT_HEIGHT:option.height-30,
            INDEX:iconIndex,
            zIndex:option.zIndex,
            appContent:""
        }));
        //绑定点击事件
        windowBind(windows[option.id],option.id,option.onClose,option.onMin,option.fixZindex);
        // 设置window位置
        /*
        var num_h = $(".desktop").height()%h;
        num_h = ($(".desktop").height()-num_h)/h;
        var t_index = iconIndex%num_h;
        icons[option.id].css("top",t_index*h);
        var l_index = (iconIndex-t_index)/num_h;
        icons[option.id].css("left",l_index*w+20);*/
        //设置窗口内容以及事件
        if(option.handles)
            air.require("windowHandles")[option.id](windows[option.id]);
        //注入节点并返回
        if(option.tab)
        _t.newTab({
            id:option.id,
            title:option.title,
            iconSrc:option.iconSrc,
        });
        windows[option.id].jqDrag(windows[option.id].find(".window_title.titleText"));
        windowContainer.append(windows[option.id]);
        return windows[option.id];
    };
    var PublicNewTab=function(config){
        var _t=this;++tabIndex;
        var option = {
            title:"",
            iconSrc:"",
            id:"",
        };
        $.extend(option,config);
        var window = windows[option.id];
        tabs[option.id] = $(PrivateSubstitute(tabTemplate,{
            ID:option.id,
            TITLE:option.title,
            imgSRC:option.iconSrc,
            INDEX:tabIndex
        }));
        tabBind(tabs[option.id],option.id);
        tabContainer.append(tabs[option.id]);
        return tabs[option.id];
    }
    //绑定窗体事件
    var window_z_index=50;
    var windowBind = function(tar,id,onClose,onMin,fixZindex){
        tar.setContent=function(str){
            tar.find(".content_area").html(str);
        };
        tar.mousedown(function(){
            if(!fixZindex)tar.css("z-index",window_z_index++);
        });
        tar.find(".window_close").click(function(){
            tar.fadeOut(function(){
                if(tabs[id])
                    tabs[id].remove();
                tar.remove();
                delete windows[id];
                if(tabs[id])
                    delete tabs[id];
                onClose && onClose();
            });
        });
        tar.find(".window_min").click(function(){
            tar.slideUp(function(){
                if(tabs[id])tabs[id].addClass("hidden");
                onMin && onMin();
            });
        });
    };
    //绑定任务栏事件
    var tabBind = function(tar,id){
        tar.click(function(){
            if($(this).hasClass("hidden")){
                windows[id].slideDown();
                $(this).removeClass("hidden");
            }else{
                windows[id].slideUp();
                $(this).addClass("hidden");
            }
        });
    };
    
    
    
    return {
        iconContainer_ajust:iconContainer_ajust,
        resetIcons:resetIcons,
        icons_Order:icons_Order,
        vIconNum:v_n,
        windows:windows,
        icons:icons,
        tabs:tabs,
        newIcon:PublicNewIcon,
        openWindow:PublicOpenWindow,
        newTab:PublicNewTab,
        substitute:PrivateSubstitute
    };
};