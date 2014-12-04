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
                            contactSearch(sg[1]);
                            break;
                        case "app":
                        case "APP":
                        case "App":
                            console.log(sg[1]);
                            break;
                        case "豌豆荚":
                        case "在线":
                            market(sg[1]);
                            break;
                    }
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
    var contactSearch = function(n){
        var r = $("<ul></ul>");
        r.delegate(".call","click",function(){
            //这里拨打电话发送短信事件/考虑号码分拆
            return false;
        });
        var res = contactSearchAry(n);
        $.each(res,function(i,v){
            $('<li><b>'+v.name+'</b>'+v.num+'<button class="call">拨打</button><button class="sms">发送短信</button></li>').appendTo(r);
        });
        $(".topbar-ext").html(r);
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
                        nums[i] = nums[i].replace(n,'<i class="mark">'+n+'</i>');
                        res.push({num:nums[i],name:name});
                    }
            }
        });
        return res;
    };
    return {
        init:init
    };
};