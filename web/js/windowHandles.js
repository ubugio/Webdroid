TEMP['windowHandles'] = function(air){
    var mformat = function(value){
        if(null==value||value=='')
        return "-";
        var unitArr = ["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"];
        var index=0;

        var srcsize = parseFloat(value); 
        var size =srcsize/Math.pow(1024,(index=Math.floor(Math.log(srcsize)/Math.log(1024)))); 
        return (Math.round(size*100)/100)+unitArr[index];
    };
    var msformat = function(value){
        var ms = parseInt(value%1000/10);
        ms=ms<10?"0"+ms:ms;
        value=parseInt(value/1000);
        var s = value%60;
        var m = (value-s)/60;
        m=m<10?"0"+m:m;
        s=s<10?"0"+s:s;
        return m+":"+s+"."+ms;
    };
    var sformat = function(value){
        value=parseInt(value);
        var s = value%60;
        var m = (value-s)/60;
        m=m<10?"0"+m:m;
        s=s<10?"0"+s:s;
        return m+":"+s;
    };
    var tformat = function(value,type,k){
        if(null==value||value=='')
            return "-";
        value=parseInt(value);
        var out="";
        if(type=="OUTGOING"){//INCOMING MISSED
            if(value==0){
                return "未接通";
            }else{
                out="呼出 ";
            }
        }else if(type=="INCOMING"){
            if(value==0){
                return "主动挂断";
            }else{
                out="呼入 ";
            }
        }else if(type=="MISSED"){
            return "响铃"+((value-value%5)/5)+"声";
        }else if(type=="NEW"){
            return "新建联系人";
        }
        out += sformat(value);
        return out;
    };
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

    var setLoading = function(tar){
        var l = $('<div class="loading"></div>');
        tar.append(l);
        return l;
    };

    var handles={
        setLoading:setLoading,
        "help":function(tar){
            var loading = setLoading(tar);
            air.require("Templete").getTemplate("window-help",function(temp){
                air.require("initAir").setStyle(air.Options.themePath+"window-help.css","window-help");
                tar.setContent(temp);
                loading.remove();
            });
        },
        "device":function(tar){
            var loading = setLoading(tar);
            tar.setContent("加载中...");
            air.require("dataTran").getJson(
                {mode:"device","action":"overview"},
                function(json){
                    var o={
                        text_contact:air.Lang.text_contact,
                        text_sms:air.Lang.text_sms,
                        text_app:air.Lang.text_app,
                        text_music:air.Lang.text_music,
                        text_video:air.Lang.text_video,
                        text_photo:air.Lang.text_photo,
                        text_other:air.Lang.text_other,
                        text_rom_ava:air.Lang.text_rom_ava,
                        text_sd_ava:air.Lang.text_sd_ava,
                        text_ava:air.Lang.text_ava,
                        text_taken:air.Lang.text_taken,
                        text_tot:air.Lang.text_tot,
                        text_screen:air.Lang.text_screen,
                        text_location:air.Lang.text_location,
                        text_language:air.Lang.text_language,
                        text_IMEI:air.Lang.text_IMEI,
                        text_ProvidersName:air.Lang.text_ProvidersName,
                        text_NativePhoneNumber:air.Lang.text_NativePhoneNumber,
                        text_clipboard:air.Lang.text_clipboard,
                        text_send:air.Lang.text_send,
                        deviceIMG:air.Options.imagePath+"devices/mi2-l.jpg",
                        titleModel:json.info.model,
                        titleOS:json.info.osversion,
                        info_language:json.info.language,
                        info_location:json.info.location,
                        info_screen_size:json.info.screen_size,
                        info_IMEI:json.info.IMEI,
                        info_ProvidersName:json.info.ProvidersName,
                        info_NativePhoneNumber:json.info.NativePhoneNumber,
                        info_clipboard:json.info.clipboard,
                        num_contact:json.num.contacts,
                        num_sms:json.num.sms,
                        num_app:json.num.app,
                        num_music:json.num.music,
                        num_video:json.num.video,
                        num_photo:json.num.photo,
                        size_rom_ava:mformat(json.size.sys_avail),
                        size_rom_tot:mformat(json.size.sys_size),
                        size_sd_ava:mformat(json.size.sd_avail),
                        size_sd_tot:mformat(json.size.sd_size),
                        size_music:mformat(json.size.music),
                        size_video:mformat(json.size.video),
                        size_photo:mformat(json.size.photo),
                        size_other:mformat(json.size.sd_size-json.size.sd_avail-json.size.music-json.size.video-json.size.photo),
                        size_rom_taken:mformat(json.size.sys_size-json.size.sys_avail),
                        size_sd_taken:mformat(json.size.sd_size-json.size.sd_avail),
                        sd_music_percent:(json.size.music/json.size.sd_size)*100,
                        sd_video_percent:(json.size.video/json.size.sd_size)*100,
                        sd_photo_percent:(json.size.photo/json.size.sd_size)*100,
                        sd_other_percent:((json.size.sd_size-json.size.sd_avail-json.size.music-json.size.video-json.size.photo)/json.size.sd_size)*100,
                        rom_percent:((json.size.sys_size-json.size.sys_avail)/json.size.sys_size)*100
                    };
                    air.require("Templete").getTemplate("window-device",function(temp){
                        air.require("initAir").setStyle(air.Options.themePath+"window-device.css","window-device");
                        tar.setContent(air.require("UI").substitute(temp,o));
                        tar.find(".window-clipboard button").click(function(){
                            var text = tar.find(".window-clipboard textarea").val();
                            air.require("dataTran").getJson(
                                {mode:"device","action":"clipboard","text":text},
                                function(data){
                                    console.log(air.Lang.text_send_success);
                                    console.log(air.Lang.text_clipboard_send_success);
                                    if(data.status=="ok"){
                                        air.require("notify").warningNotify(air.Lang.text_send_success,air.Lang.text_clipboard_send_success);
                                    }
                                },
                                function(){
                                    air.require("notify").warningNotify(air.Lang.text_send_fail,air.Lang.text_clipboard_send_fail);
                                }
                            );
                        });
                    });
                },function(e,t){
                    console.log(e);
                    tar.setContent("加载失败..."+t);
                },function(){
                        loading.remove();
                    }
            );
        },
        "contacts":function(tar){
            var loading = setLoading(tar);
            air.require("dataTran").getJson(
                {mode:"device","action":"contacts"},
                function(data){
                json=data.status;
                    var out="<ul>";
                    for(k in json){
                        out+='<li data-id="'+json[k].id+'" data-contact="'+json[k].desc+'">';
                            //out+='<img src="'+json[k].head+'">'+json[k].name;
                            var src='<span>'+json[k].name[0]+'</span>';
                            if(json[k].head>0)
                                src='<img src="http://'+air.Options.ip+':'+air.Options.port+'/?mode=image&phoneid='+json[k].head+'"/>';
                            out+=src+'<div>'+json[k].name+"</div>";
                        out+='</li>';
                    }
                    out+="</ul>";
                    json=data.groups;
                    var out2="";
                    for(k in json){
                        out2+='<li data-ids="'+json[k].phones+'">'+json[k].name+'</li>';
                    }
                    var o={
                        contacts_groups:'<ul><li class="select">'+air.Lang.text_all+"</li>"+out2+"</ul>",
                        contacts_lists:out
                    };
                    
                    air.require("Templete").getTemplate("window-contacts",function(temp){
                        air.require("initAir").setStyle(air.Options.themePath+"window-contacts.css","window-contacts");
                        tar.setContent(air.require("UI").substitute(temp,o));
                        tar.find("ul:eq(1) li").click(function(){
                            tar.find("ul:eq(1) li").removeClass("select");
                            $(this).addClass("select");
                            if($(this).find("img").length>0)
                                $(".window-contacts-detail .window-contact-page-img img").attr("src",$(this).find("img").attr("src"));
                            else
                                $(".window-contacts-detail .window-contact-page-img img").attr("src",air.Options.imagePath+'default_contact.png');
                            $(".window-contacts-detail .window-contact-detail-name").text($(this).find("div").text());
                            var phone = "";
                            var phones = $(this).data("contact").split(";");
                            for(var i=0,l=phones.length-1;i<l;i++){
                                phone += air.require("UI").substitute(air.require("Templete").contacts,{
                                    phone:phones[i]
                                })
                            }
                            $(".window-contact-detailItem.phones").html(phone);
                        });
                        tar.find("ul:eq(0) li").click(function(){
                            tar.find("ul:eq(0) li").removeClass("select");
                            $(this).addClass("select");
                            var ids = $(this).data("ids");
                            if(ids==undefined){
                                tar.find("ul:eq(1) li").show();
                            }else if(ids==""){
                                tar.find("ul:eq(1) li").hide();
                            }else{
                                ids = ids.split("-");
                                tar.find("ul:eq(1) li").each(function(){
                                    var id = $(this).data("id");
                                    var flg=0;
                                    for(var i=0,l=ids.length-1;i<l;i++){
                                        if(ids[i]==id){
                                            flg=1;
                                            break;
                                        }
                                    }
                                    if(flg==1)
                                        $(this).show();
                                    else
                                        $(this).hide();
                                });
                            }
                        });
                        tar.delegate(".window-contact-detail-call","click",function(){
                            air.require("SmsPhone").callNum($(this).parent().parent().find(".phone").text().replace(/\s/g,""));
                        });
                    });
                },function(e,t){
                    console.log(e);
                    tar.setContent("联系人加载失败..."+t);
                },function(){
                        loading.remove();
                    }
            );
        },
        "apps":function(tar){
            var loading = setLoading(tar);
            air.require("dataTran").getJson(
                {mode:"device","action":"apps"},
                function(data){
                    var json=data.apps;
                    var packages=data.users.split("#&");
                    var u_l=packages.length-1;
                    var a_l=json.length;
                    
                    var out="";
                    for(k in json){
                        out+='<li data-package="'+json[k].packageName+'">';
                            var src='<img src="http://'+air.Options.ip+':'+air.Options.port+'/?mode=image&package='+json[k].packageName+'"/>';
                            out+=src+'<div><span class="name">'+json[k].name+'</span><span class="version">'+json[k].versionName+'</span><span class="installT">'+json[k].firstInstallTime+'</span><span class="size">'+mformat(json[k].size)+"</span></div>";
                        out+='</li>';
                    }
                    var o={
                        apps_groups:'<ul><li data-index="0" class="select">'+air.Lang.text_all+' ('+a_l+")</li><li data-index='1'>"+air.Lang.text_user+' ('+u_l+")</li><li data-index='2'>"+air.Lang.text_system+' ('+(a_l-u_l)+")</li></ul>",
                        apps_lists:out,
                        text_size:air.Lang.text_size,
                        text_install_time:air.Lang.text_install_time,
                        text_version:air.Lang.text_version,
                        text_name:air.Lang.text_name,
                        text_icon:air.Lang.text_icon
                    };
                    air.require("Templete").getTemplate("window-apps",function(temp){
                        air.require("initAir").setStyle(air.Options.themePath+"window-apps.css","window-apps");
                        tar.setContent(air.require("UI").substitute(temp,o));
                        tar.find("ul:eq(0) li").click(function(){
                            tar.find("ul:eq(0) li").removeClass("select");
                            $(this).addClass("select");
                            var index=$(this).data("index");
                            if(index=="0"){
                                tar.find("ul:eq(2) li").show();
                                return false;
                            }
                            if(u_l==-1){
                                tar.find("ul:eq(2) li").hide();
                            }else{
                                tar.find("ul:eq(2) li").each(function(){
                                    var id = $(this).data("package");
                                    var flg=2;
                                    for(var i=0,l=u_l;i<l;i++){
                                        if(packages[i]==id){
                                            flg=1;
                                            break;
                                        }
                                    }
                                    if(flg==index)
                                        $(this).show();
                                    else
                                        $(this).hide();
                                });
                            }
                        });
                        tar.find("ul:eq(2) li").click(function(){
                            tar.find("ul:eq(2) li").removeClass("select");
                            $(this).addClass("select");
                        });
                    });
                },function(e,t){
                    console.log(e);
                    tar.setContent("加载失败..."+t);
                },function(){
                        loading.remove();
                    }
            );
        },
        "files":function(tar){
            var loading = null;
            var insert = function(path){
                loading = setLoading(tar);
                air.require("dataTran").getJson(
                    {mode:"device","action":"files","path":path},
                    function(data){
                        if(data.status!=undefined){
                            alert(data.message);
                            return false;
                        }
                        var json = data.list;
                        var out="";
                        for(k in json){
                            out+='<li class="'+json[k].type+'" data-type="'+json[k].type_ext+'" data-link="'+json[k].link+'">';
                                var src='<img src="'+air.Options.imagePath+'fm_icon_'+json[k].type_ext+'.png'+'"/>';
                                if(json[k].type_ext=="image")
                                    src='<img src="http://'+air.Options.ip+':'+air.Options.port+'/?mode=stream&action=imagepreview&width=49&path='+json[k].link+'" />';
                                if(json[k].type_ext=="video")
                                    src='<img src="http://'+air.Options.ip+':'+air.Options.port+'/?mode=stream&action=videopreview&width=49&path='+json[k].link+'" />';
                                if(json[k].type_ext=="apk")
                                    src='<img src="http://'+air.Options.ip+':'+air.Options.port+'/?mode=image&packagepath='+json[k].link+'" />';
                                out+=src+'<div><span class="name">'+json[k].name+'</span><span class="lastModified">'+json[k].lastModified+'</span><span class="size">'+mformat(json[k].size)+"</span><span class='size'>"+air.Lang["file_"+json[k].type_ext]+"</span></div>";
                            out+='</li>';
                        }
                        tar.find(".window-files-list ul:eq(1)").html(out);
                        var paths = data.path.split("/"),out2="",path2="";
                        for(var i=0,l=paths.length;i<l;i++){
                            if(paths[i]=="")continue;
                            var ls = i==0?"":"/";
                            path2+=ls+paths[i];
                            var clazz = i<(l-1)?'class="right"':"";
                            out2+='<span '+clazz+' data-link="'+path2+'">'+paths[i]+"</span>";
                        }
                        tar.find(".window-files-path").html(out2);
                    },function(e,t){
                        console.log(e);
                        tar.setContent("加载失败..."+t);
                    },function(){
                        loading.remove();
                    }
                );
            };
            
            var o={
                files_groups:'<ul class="pathTree"></ul>',
                text_type:air.Lang.text_type,
                text_size:air.Lang.text_size,
                text_name:air.Lang.text_name,
                text_icon:air.Lang.text_icon,
                text_download:air.Lang.text_download,
                text_lastModified:air.Lang.text_lastModified,
                files_lists:""
            };
            air.require("Templete").getTemplate("window-files",function(temp){
                air.require("initAir").setStyle(air.Options.themePath+"window-files.css","window-files");
                tar.setContent(air.require("UI").substitute(temp,o));
                var l=null;
                air.require("pathTree").pathTree({
                    tar:tar.find(".window-files-group"),
                    click:function(event, treeId, treeNode, clickFlag) {
                        if(treeNode.isParent)
                            insert(treeNode.id);
                    },
                    beforeLoad:function(){
                        l=setLoading(tar.find(".window-files-group"));
                    },
                    ready:function(){
                        l.remove();
                    }
                });
                tar.delegate(".window-files-list ul:eq(1) li","click",function(){
                    tar.find(".window-files-list ul:eq(1) li").removeClass("select");
                    $(this).addClass("select");
                    if($(this).hasClass("file")){
                        $("#download_a").addClass("enable");
                        $("#download_a").attr("href","http://"+air.Options.ip+':'+air.Options.port+'/?mode=download&action=file&path='+encodeURIComponent($(this).data("link")));
                    }else{
                        $("#download_a").removeClass("enable");
                        $("#download_a").attr("href","#");
                    }
                });
                tar.delegate(".window-files-list ul:eq(1) li","dblclick",function(){
                    if($(this).hasClass("dir")){
                        insert($(this).data("link"));
                        $("#download_a").removeClass("enable");
                        $("#download_a").attr("href","#");
                    }else{
                        if($(this).data("type")=="mp3"){
                            air.require("player").playMusicfromPath($(this).find(".name").text(),encodeURIComponent($(this).data("link")));
                        }else if($(this).data("type")=="image"){
                            air.require("player").playImagefromPath(encodeURIComponent($(this).data("link")));
                        }else if($(this).data("type")=="video"){
                            air.require("player").playVideofromId(encodeURIComponent($(this).data("link")));
                        }
                    }

                });
                tar.delegate(".window-files-path span","click",function(){
                    insert($(this).data("link"));
                    $("#download_a").removeClass("enable");
                    $("#download_a").attr("href","#");
                });
            });
            insert("sdcard");
        },
        "upload":function(tar){
            var loading = setLoading(tar);
            var defaultPath = "sdcard/air";
            var o={
                text_clear_item:air.Lang.text_clear_item,
                text_choose_dir:air.Lang.text_choose_dir,
                text_choose_file:air.Lang.text_choose_file,
                text_name:air.Lang.text_name,
                text_progress:air.Lang.text_progress,
                text_size:air.Lang.text_size,
                text_type:air.Lang.text_type,
                text_begin:air.Lang.text_begin,
                PATH:air.Options.uploadPath,
                text_upload_path:air.Lang.text_upload_path,
                text_change_path:air.Lang.text_change_path,
            };
            air.require("Templete").getTemplate("window-upload",function(temp){
                air.require("initAir").setStyle(air.Options.themePath+"window-upload.css","window-upload");
                tar.setContent(air.require("UI").substitute(temp,o));
                tar.find(".window-upload-change").click(function(){
                    var l = null;
                    tar.find(".window-upload-ztree").empty().show();
                    air.require("pathTree").pathTree({
                        tar:tar.find(".window-upload-ztree"),
                        click:function(event, treeId, treeNode, clickFlag) {
                            if(treeNode.isParent){
                                air.Options.uploadPath = treeNode.id;
                                tar.find(".window-upload-path span").html(air.Options.uploadPath);
                                tar.find(".window-upload-ztree").hide();
                            }
                        },
                        beforeLoad:function(){
                            l=setLoading(tar.find(".window-upload-ztree"));
                        },
                        ready:function(){
                            l.remove();
                        }
                    });
                });
                loading.remove();
                var uploadFileArr = [];
                var isuploading = false;
                if(window.File && window.FileList && window.FileReader && window.Blob) {
                    tar.find('#Files').change(function(e){
                        uploadFileArr = [];
                        isuploading = false;
                        e = e || window.event;
                        var files = e.target.files;  //FileList Objects    
                        var output = [];
                        for(var i = 0, f; f = files[i]; i++) {
                            uploadFileArr.push(f);
                            defaultPath=f.name;
                            output.push('<li><span class="name">'+f.name+'</span><span class="progress"><progress value="0" max="100"></span><span class="size">'+mformat(f.size)+'</span><span class="size">'+f.type+'</span></li>');
                        }
                        console.log(output);
                        $(".window-upload-list-scroll").html(output.join(""));
                    });
                    tar.find('#begin').click(function(){
                        var uploader = air.require("uploader");
                        $.each(uploadFileArr,function(i,v){
                            uploader.uploadFile(uploadFileArr[i],function(e){
                                tar.find('progress:eq('+i+')').attr({value:e.loaded,max:e.total});
                            },function(){
                                tar.find('.progress').html("上传成功");
                            },function(){
                                tar.find('.progress').html("上传出错");
                            });
                        });
                    });
                } else {
                    alert('您的浏览器不支持File Api');
                }
            });
        },
        "phones":function(tar){
            var loading = setLoading(tar);
            air.require("dataTran").getJson(
                {mode:"device","action":"phones"},
                function(data){
                    var json=data.phones;
                    var a_l=json.length;
                    var len={
                        OUTGOING:0,
                        INCOMING:0,
                        MISSED:0
                    };
                    var out="";
                    for(var k=a_l-1;k>=0;k--){
                        len[json[k].type]++;
                        out+='<li data-type="'+json[k].type+'">';
                            var src='<img src="'+air.Options.imagePath+'default_contact.png"/>';
                            if(parseInt(json[k].photoid)>0)
                                src='<img src="http://'+air.Options.ip+':'+air.Options.port+'/?mode=image&phoneid='+json[k].photoid+'"/>';
                            json[k].name=json[k].name?json[k].name:json[k].number;
                            var duration = tformat(json[k].duration,json[k].type);
                            var typePlus=duration=="未接通"?" fail":"";
                            out+='<span class="call-status '+json[k].type+typePlus+'"></span>'+src+'<div><span class="name">'+json[k].name+'</span><span class="version">'+json[k].number+'</span><span class="installT">'+json[k].time+'</span><span class="size">'+duration+'</span><span class="operate"><span class="message">发送消息</span><span class="call">呼叫</span></span></div>';
                        out+='</li>';
                    }
                    var o={
                        phones_groups:'<ul><li data-index="ALL" class="select">'+air.Lang.text_all+' ('+a_l+")</li><li data-index='INCOMING'>"+air.Lang.incomingCall+' ('+len.INCOMING+")</li><li data-index='OUTGOING'>"+air.Lang.outgoingCall+' ('+len.OUTGOING+")</li><li data-index='MISSED'>"+air.Lang.missedCall+' ('+len.MISSED+")</li></ul>",
                        phones_lists:out,
                        text_status:air.Lang.text_status,
                        text_name:air.Lang.text_name,
                        text_icon:air.Lang.text_icon,
                        text_number:air.Lang.text_number,
                        text_time:air.Lang.text_time,
                        text_operate:air.Lang.text_operate,
                        text_duration:air.Lang.text_duration
                    };
                    air.require("Templete").getTemplate("window-phones",function(temp){
                        air.require("initAir").setStyle(air.Options.themePath+"window-phones.css","window-phones");
                        tar.setContent(air.require("UI").substitute(temp,o));
                        tar.find("ul:eq(2) li").click(function(){
                            tar.find("ul:eq(2) li").removeClass("select");
                            $(this).addClass("select");
                        });
                        tar.find("ul:eq(0) li").click(function(){
                            tar.find("ul:eq(0) li").removeClass("select");
                            $(this).addClass("select");
                            var ind = $(this).data("index");
                            if(ind=="ALL"){
                                tar.find("ul:eq(2) li").show();
                            }else{
                                tar.find("ul:eq(2) li").hide();
                                tar.find("ul:eq(2) li[data-type="+ind+"]").show();
                            }
                        });
                        tar.delegate(".call","click",function(){
                            air.require("SmsPhone").callNum($(this).parent().parent().find(".version").text().replace(/\s/g,""));
                        });
                    });
                },function(e,t){
                    console.log(e);
                    tar.setContent("加载失败..."+t);
                },function(){
                        loading.remove();
                    }
            );
        },
        "musics":function(tar){
            var loading = null;
            var defaultlimit=20;
            var offfsetNow=0;
            var downloading=false;
            var insert = function(limit,offset){
                if(downloading)return false;
                downloading=true;
                loading = setLoading(tar);
                air.require("dataTran").getJson(
                    {mode:"device","action":"musics","limit":limit,"offset":offset},
                    function(data){
                        offfsetNow+=defaultlimit;
                        var json = data.musics;
                        var out="";
                        for(k in json){
                            json[k].artist=json[k].artist=="<unknown>"?"未知歌手":json[k].artist;
                            out+='<li data-id="'+json[k].id+'"><div><span class="name">'+json[k].title+'</span><span class="duration">'+msformat(json[k].duration)+'</span><span class="artist">'+json[k].artist+'</span><span class="album">'+json[k].album+'</span><span class="size">'+mformat(json[k].size)+'</span><span class="lastModified">'+json[k].name+'</span></div></li>';
                        }
                        tar.find(".window-musics-list-scroll li:last").before(out);
                    },function(e,t){
                        console.log(e);
                        tar.setContent("加载失败..."+t);
                    },function(){
                        loading.remove();
                        downloading=false;
                    }
                );
            };
            var o={
                text_name:air.Lang.text_name,
                text_duration:air.Lang.text_duration,
                text_player:air.Lang.text_player,
                text_album:air.Lang.text_album,
                text_size:air.Lang.text_size,
                text_lastModified:air.Lang.text_lastModified,
                text_more:air.Lang.text_more,
                text_play:air.Lang.text_play,
                text_download:air.Lang.text_download
            };
            air.require("Templete").getTemplate("window-musics",function(temp){
                air.require("initAir").setStyle(air.Options.themePath+"window-musics.css","window-musics");
                tar.setContent(air.require("UI").substitute(temp,o));
                tar.delegate("ul:eq(1) li","click",function(){
                    tar.find("ul:eq(1) li").removeClass("select");
                    $(this).addClass("select");
                    var id= $(this).data("id");
                    var title = $(this).find(".name").text();
                    $("#music_play").attr("data-id",id).attr("data-title",title);
                    $("#music_download").attr("href",'http://'+air.Options.ip+':'+air.Options.port+'/?mode=download&action=music&id='+id);
                });
                tar.find(".window-musics-list-scroll li:last").click(function(){
                    insert(defaultlimit,offfsetNow);
                });
                tar.find("#music_play").click(function(){
                    air.require("player").playMusicfromId($("#music_play").attr("data-title"),$("#music_play").attr("data-id"));
                    return false;
                });
            });
            insert(defaultlimit,offfsetNow);
        },
        "images":function(tar){
            var loading = setLoading(tar);
            var defaultlimit=20;
            var offfsetNow=0;
            var bucketnameNow="";
            var downloading=false;
            var insert = function(bucketname){
                if(downloading)return false;
                downloading=true;
                loading = setLoading(tar);
                console.log(bucketnameNow+"-"+bucketname);
                if(bucketnameNow!=bucketname){
                    offfsetNow=0;
                    tar.find(".window-images-list-scroll li").not(":last").remove();
                bucketnameNow=bucketname;
                }
                air.require("dataTran").getJson(
                    {mode:"device","action":"images","bucketname":bucketnameNow,"limit":defaultlimit,"offset":offfsetNow},
                    function(data){
                        offfsetNow+=defaultlimit;
                        var json = data.images;
                        console.log(json);
                        var out="";
                        for(k in json){
                            out+='<li title="'+json[k].name+'" data-tokentime="'+new Date(parseInt(json[k].tdate)).toLocaleString()+'" data-modifytime="'+new Date(parseInt(json[k].date)*1000).toLocaleString()+'" data-id="'+json[k].id+'"><img onerror="this.src=\'ggg\'" src="http://'+air.Options.ip+':'+air.Options.port+'/?mode=stream&action=imagepreview&width=110&id='+json[k].id+'" /><div><span class="big">'+json[k].width+' x '+json[k].height+'</span><br /><span class="size">'+mformat(json[k].size)+'</span></div></li>';
                        }
                        tar.find(".window-images-list-scroll li:last").before(out);
                    },function(e,t){
                        console.log(e);
                        tar.setContent("加载失败..."+t);
                    },function(){
                        loading.remove();
                        downloading=false;
                    }
                );
            };
            air.require("dataTran").getJson(
                {mode:"device","action":"image_groups"},
                function(data){
                    var json = data.images;
                    var images_groups="";
                    for(k in json){
                        images_groups+='<li data-name="'+json[k].bucket+'"><img src="http://'+air.Options.ip+':'+air.Options.port+'/?mode=stream&action=imagepreview&width=80&id='+json[k].first+'" /><div><span class="name">'+json[k].bucket+'</span><span class="lastModified">'+json[k].num+'</span></div></li>';
                    }
                    var o={
                        text_more:air.Lang.text_more,
                        images_groups:images_groups,
                        text_filename:air.Lang.text_filename,
                        text_tokentime:air.Lang.text_tokentime,
                        text_lastModified:air.Lang.text_lastModified,
                        text_big:air.Lang.text_big,
                        text_size:air.Lang.text_size
                    };
                    air.require("Templete").getTemplate("window-images",function(temp){
                        air.require("initAir").setStyle(air.Options.themePath+"window-images.css","window-images");
                        tar.setContent(air.require("UI").substitute(temp,o));
                        tar.delegate("ul:eq(1) li","click",function(){
                            tar.find("ul:eq(1) li").removeClass("select");
                            $(this).addClass("select");
                            $(".window-images-info").find("span:eq(0)").text($(this).attr("title"));
                            $(".window-images-info").find("span:eq(1)").text($(this).find(".size").text());
                            $(".window-images-info").find("span:eq(2)").text($(this).find(".big").text());
                            $(".window-images-info").find("span:eq(3)").text($(this).data("tokentime"));
                            $(".window-images-info").find("span:eq(4)").text($(this).data("modifytime"));
                        });
                        tar.find(".window-images-list-scroll li:last").click(function(){
                            insert(bucketnameNow);
                        });
                        tar.delegate("ul:eq(0) li","click",function(){
                            tar.find("ul:eq(0) li").removeClass("select");
                            $(this).addClass("select");
                            insert($(this).data("name"));
                        });
                        tar.delegate("ul:eq(1) li","dblclick",function(){
                            var _s = $(this).find(".big").text().split("x");
                            air.require("player").playImagefromId($(this).data("id"),parseInt(_s[0]),parseInt(_s[1]));
                        });
                    });
                    loading.remove();
                    insert("Camera");
                },function(e,t){
                    loading.remove();
                    console.log(e);
                    tar.setContent("加载失败..."+t);
                },function(){
                    downloading=false;
                }
            );
        },
        "videos":function(tar){
            var loading = setLoading(tar);
            var defaultlimit=20;
            var offfsetNow=0;
            var bucketnameNow="";
            var downloading=false;
            var insert = function(bucketname){
                if(downloading)return false;
                downloading=true;
                loading = setLoading(tar);
                console.log(bucketnameNow+"-"+bucketname);
                if(bucketnameNow!=bucketname){
                    offfsetNow=0;
                    tar.find(".window-videos-list-scroll li").not(":last").remove();
                bucketnameNow=bucketname;
                }
                air.require("dataTran").getJson(
                    {mode:"device","action":"videos","bucketname":bucketnameNow,"limit":defaultlimit,"offset":offfsetNow},
                    function(data){
                        offfsetNow+=defaultlimit;
                        var json = data.videos;
                        console.log(json);
                        var out="";
                        for(k in json){
                            out+='<li title="'+json[k].name+'" data-tokentime="'+new Date(parseInt(json[k].tdate)).toLocaleString()+'" data-modifytime="'+new Date(parseInt(json[k].date)*1000).toLocaleString()+'" data-id="'+json[k].id+'"><img src="http://'+air.Options.ip+':'+air.Options.port+'/?mode=stream&action=videopreview&width=110&id='+json[k].id+'" /><div><span class="big">'+json[k].width+' x '+json[k].height+'</span><br /><span class="size">'+mformat(json[k].size)+'</span></div></li>';
                        }
                        tar.find(".window-videos-list-scroll li:last").before(out);
                    },function(e,t){
                        console.log(e);
                        tar.setContent("加载失败..."+t);
                    },function(){
                        loading.remove();
                        downloading=false;
                    }
                );
            };
            air.require("dataTran").getJson(
                {mode:"device","action":"video_groups"},
                function(data){
                    var json = data.videos;
                    var videos_groups="";
                    for(k in json){
                        videos_groups+='<li data-name="'+json[k].bucket+'"><img src="http://'+air.Options.ip+':'+air.Options.port+'/?mode=stream&action=videopreview&width=80&id='+json[k].first+'" /><div><span class="name">'+json[k].bucket+'</span><span class="lastModified">'+json[k].num+'</span></div></li>';
                    }
                    var o={
                        text_more:air.Lang.text_more,
                        videos_groups:videos_groups,
                        text_filename:air.Lang.text_filename,
                        text_tokentime:air.Lang.text_tokentime,
                        text_lastModified:air.Lang.text_lastModified,
                        text_big:air.Lang.text_big,
                        text_size:air.Lang.text_size
                    };
                    air.require("Templete").getTemplate("window-videos",function(temp){
                        air.require("initAir").setStyle(air.Options.themePath+"window-videos.css","window-videos");
                        tar.setContent(air.require("UI").substitute(temp,o));
                    loading.remove();
                        tar.delegate("ul:eq(1) li","click",function(){
                            tar.find("ul:eq(1) li").removeClass("select");
                            $(this).addClass("select");
                            $(".window-videos-info").find("span:eq(0)").text($(this).attr("title"));
                            $(".window-videos-info").find("span:eq(1)").text($(this).find(".size").text());
                            $(".window-videos-info").find("span:eq(2)").text($(this).find(".big").text());
                            $(".window-videos-info").find("span:eq(3)").text($(this).data("tokentime"));
                            $(".window-videos-info").find("span:eq(4)").text($(this).data("modifytime"));
                        });
                        tar.find(".window-videos-list-scroll li:last").click(function(){
                            insert(bucketnameNow);
                        });
                        tar.delegate("ul:eq(0) li","click",function(){
                            tar.find("ul:eq(0) li").removeClass("select");
                            $(this).addClass("select");
                            insert($(this).data("name"));
                        });
                        tar.find("ul:eq(0) li:first").click();
                        tar.delegate("ul:eq(1) li","dblclick",function(){
                            air.require("player").playVideofromId($(this).data("id"));
                        });
                    });
                },function(e,t){
                    loading.remove();
                    console.log(e);
                    tar.setContent("加载失败..."+t);
                },function(){
                    downloading=false;
                }
            );
        },
        ///////////////////////////////////TODO 根据ad 返回number的id 然后 
        //自动点击对应条目滚动到最低端 或者 直接插入到对应位置(当前窗口)
        "sms":function(tar){
            var loading = setLoading(tar);
            var defaultlimit=20;
            var offfsetNow=0;
            var threadidNow="";
            var downloading=false;
            var insert = function(threadid){
                if(downloading)return false;
                downloading=true;
                loading = setLoading(tar);
                if(threadidNow!=threadid){
                    offfsetNow=0;
                    tar.find(".window-sms-list-scroll li").not(":first").remove();
                    threadidNow=threadid;
                }
                air.require("dataTran").getJson(
                    {mode:"device","action":"sms","threadid":threadidNow,"limit":defaultlimit,"offset":offfsetNow},
                    function(data){
                        offfsetNow+=defaultlimit;
                        var json = data.sms;
                        if(json){
                            var out="";
                            var head = tar.find("ul:eq(0) li.select").find("img").attr("src");
                            for(var k=json.length-1;k>=0;k--){
                                var src="",status="";
                                if(json[k].type=="1")
                                    src='<img src="'+head+'"/>';
                                else
                                    status = '<span class="sms-mes-status">'+air.Lang.sms_status_received+'</span>';
                                out+='<li class="sms-mes-'+json[k].type+'">'+src+'<div>'+json[k].strbody+'<span>'+new Date(parseInt(json[k].strDate)).toLocaleString()+'</span></div>'+status+'</li>';
                            }
                            out = $(out);
                            tar.find(".window-sms-list-scroll li:first").after(out);
                            tar.find(".window-sms-list-scroll").scrollTop(out.last().offset().top);
                        }
                    },function(e,t){
                        console.log(e);
                        tar.setContent("加载失败..."+t);
                    },function(){
                        loading.remove();
                        downloading=false;
                    }
                );
            };
            var send = function(number,text){
                loading = setLoading(tar.find(".window-sms-send"));
                var id = new Date();
                air.require("dataTran").getJson(
                    {mode:"device","action":"sendsms","number":number,"text":text,"id":"sms-"+id.getTime()},
                    function(data){
                        if(data.status=="ok"){
                            air.require("notify").toast(air.Lang.text_sms+":"+air.Lang.text_sms_success);
                            tar.find(".window-sms-send textarea").val("");
                            var out = $('<li id="sms-'+id.getTime()+'" class="sms-mes-2"><div>'+text+'<span>'+id.toLocaleString()+'</span></div><span class="sms-mes-status"></span></li>');
                            tar.find(".window-sms-list-scroll").append(out);
                            var div = tar.find(".window-sms-list-scroll")[0];
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
            air.require("dataTran").getJson(
                {mode:"device","action":"sms_groups"},
                function(data){
                    var json = data.sms;
                    var sms_groups="";
                    for(k in json){
                        var src='<img src="'+air.Options.imagePath+'default_contact.png" />';
                        if(parseInt(json[k].photoid)>0)
                            src='<img src="http://'+air.Options.ip+':'+air.Options.port+'/?mode=image&phoneid='+json[k].photoid+'"/>';
                            if(json[k].name=="")json[k].name=json[k].strAddress;
                        sms_groups+='<li data-number="'+json[k].strAddress+'" data-name="'+json[k].name+'" data-threadid="'+json[k].thread_id+'">'+src+'<div><span class="name">'+json[k].name+"("+json[k].count+')</span><span class="body">'+json[k].strbody+'</span></div></li>';
                    }
                    var o={
                        text_more:air.Lang.text_more,
                        sms_groups:sms_groups,
                        text_send:air.Lang.text_send
                    };
                    air.require("Templete").getTemplate("window-sms",function(temp){
                        air.require("initAir").setStyle(air.Options.themePath+"window-sms.css","window-sms");
                        tar.setContent(air.require("UI").substitute(temp,o));
                        loading.remove();
                        tar.delegate("ul:eq(1) li","click",function(){
                            tar.find("ul:eq(1) li").removeClass("select");
                            $(this).addClass("select");
                        });
                        tar.find(".window-sms-list-scroll li:first").click(function(){
                            insert(threadidNow);
                        });
                        tar.delegate("ul:eq(0) li","click",function(){
                            tar.find("ul:eq(0) li").removeClass("select");
                            $(this).addClass("select");
                            insert($(this).data("threadid"));
                            tar.find(".window-sms-list").data("address",$(this).data("number"));
                            tar.find(".window-sms-contact-head img").attr("src",$(this).find("img").attr("src"));
                            tar.find(".window-sms-contact-name").text($(this).data("name"));
                            tar.find(".window-sms-contact-number").text($(this).data("number"));
                        });
                        tar.find(".window-sms-send textarea").keyup(function(){
                            tar.find(".window-sms-send span").text(CountSmsCharacters($(this).val()));
                        });
                        tar.find(".window-sms-send button").click(function(){
                            var text = tar.find(".window-sms-send textarea").val();
                            if(text=="")return false;
                            var number = tar.find(".window-sms-contact-number").text();
                            send(number,text);
                        });
                        tar.find("ul:eq(0) li:first").click();
                    });
                },function(e,t){
                    loading.remove();
                    console.log(e);
                    tar.setContent("加载失败..."+t);
                },function(){
                    downloading=false;
                }
            );
        },
        "notifies":function(tar){
            var loading = setLoading(tar);
            var out = "";
            $.each(air.require("notify").notifiesList,function(i,v){
                out+=air.require("UI").substitute(air.require("Templete").notifyLocalTemplate,{
                    ID:"list",
                    IMG:'<img src="'+v.icon+'"/>',
                    TITLE:v.title,
                    TEXT:v.text
                });
            });
            air.require("initAir").setStyle(air.Options.themePath+"window-notifies.css","window-sms");
            tar.setContent(air.require("UI").substitute(air.require("Templete").notifyWindowTemplate,{
                text_clear:air.Lang.text_clear,
                List:out
            }));
            tar.find(".notify-clear").click(function(){
                air.require("notify").notifiesList=[];
                tar.find(".notify-items .notify").slideUp(function(){
                    $(this).remove();
                    air.require("notify").toast(air.Lang.text_clear_complete);
                });
            });
            loading.remove();
        }
    };
    return handles;
};