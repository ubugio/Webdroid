TEMP['topbar'] = function(air){
    var init = function(){
        var headimg = air.Options.uploadFilePath+"head.png";
        $(".topbar-user-head").html('<img src="'+headimg+'" />');
        // 点击电话图标弹出拨号盘
        $(".topbar-tool-newphone").click(function(){
            air.require("SmsPhone").showDialPanel();
        });
        // 点击短信图标弹出短信界面
        $(".topbar-tool-newsms").click(function(){
            air.require("SmsPhone").newSms();
        });
        //点击链接图标插入输入框
        $(".topbar-tool-openurl").click(function(){
            //var in = $();
            $(".topbar-ext").append('<input style="float: right;" type="text" value="http://"/>');
            $(".topbar-ext input").focus().keypress(function(e){
                if(e.keyCode==13){
                    air.require("runCommond").openUrl($(".topbar-ext input").val());
                    $(".topbar-ext input").remove();
                }
            }).blur(function(){
                $(".topbar-ext input").remove();
            });
        });
        marketInit();
        $(".topbar-quickSearch input").keyup(function(){
            var sg = $(this).val().replace(/\s/g,'');
            sg = sg.split("@");
            if(sg.length==2){
                if(sg[1] == "")
                    $(".topbar-ext").html('');
                else
                    switch(sg[0]){
                        case "联系人":
                        case "通讯录":
                            contactSearch(sg[1],$(".topbar-ext"));
                            break;
                        case "app":
                        case "APP":
                        case "App":
                            appSearch(sg[1]);
                            break;
                        case "豌豆荚":
                        case "在线":
                            market(sg[1]);
                            break;
                        default:
                            $(".topbar-ext").html('');
                            break;
                    }
            }else{
                $(".topbar-ext").html('');
            }
        });
    };
    var marketInit = function(){
        window.handleSugData = function(d){
            var r = $("<ul></ul>");
            r.delegate("a","click",function(){
                air.require("runCommond").openUrl("http://www.wandoujia.com/search?key="+$(this).data("href"),function(){
                    r.remove();
                    $(".topbar-quickSearch input").val("");
                });
                return false;
            });
            if(d.wc>0)
                $.each(d.wl,function(i,v){
                    var t = $('<li><a data-href="'+v+'" target="_blank" href="javascript:void(0);">'+v+"</a></li>");
                    t.appendTo(r);
                });
            $(".topbar-ext").html(r);
        };
    };
    var market = function(sg){
        $.getScript("http://suggest2.wandoujia.com/search_sug?key="+sg+"&cb=handleSugData&_="+new Date().getTime());
    };
    var contactSearch = function(n,tar){
        var r = $("<ul></ul>");
        r.delegate(".call","click",function(){
            air.require("SmsPhone").callNum($(this).parent().parent().find(".num").text().replace(/\s/g,""));
        });
        r.delegate(".sms","click",function(){
            air.require("SmsPhone").smsTo($(this).parent().parent().find(".num").text().replace(/\s/g,""));
        });
        var res = contactSearchAry(n);
        $.each(res,function(i,v){
            $('<li><b>'+v.name+'</b><span class="num">'+v.num+'</span><span class="fr"><button class="call">拨打</button><button class="sms">发送短信</button></span></li>').appendTo(r);
        });
        tar.html(r);
    };
    var contactSearchAry = function(n){
        var res = [];
        $.each(air.Options.baseData.contacts.status,function(ind,v){
            var flag = !1,name = v.name;
            var nums = v.desc.split(";"),l = nums.length;
            if(name.indexOf(n)>-1){
                name = name.replace(n,'<i class="mark">'+n+'</i>');
                flag = !0;
            }
            for(var i = 0;i < l-1;i++){
                if(flag)
                    res.push({num:nums[i],name:name});
                else
                    if(nums[i].indexOf(n)>-1){
                        res.push({num:nums[i].replace(n,'<i class="mark">'+n+'</i>'),name:name});
                    }
            }
        });
        return res;
    };
    var appSearch = function(n){
        var r = $("<ul></ul>");
        r.delegate(".run","click",function(){
            // 这里是可以启动程序的事件，暂无
        });
        var res = appSearchAry(n);
        $.each(res,function(i,v){
            $('<li><img width="20" src="http://'+air.Options.ip+':'+air.Options.port+'/?mode=image&package='+v.packageName+'"><b>'+v.name+'</b><span class="num">'+v.flag+'</span><span class="fr"><button class="run">启动</button></span></li>').appendTo(r);
        });
        $(".topbar-ext").html(r);
    };
    var appSearchAry = function(n){
        var res = [];
        $.each(air.Options.baseData.apps.apps,function(ind,v){
            if(v.name.indexOf(n)>-1){
                res.push({packageName:v.packageName,name:v.name.replace(n,'<i class="mark">'+n+'</i>'),isSys:air.Options.baseData.apps.users.indexOf(v.packageName)>-1?"":"system"});
            }
        });
        return res;
    };
    return {
        contactSearchAry:contactSearchAry,
        init:init
    };
};