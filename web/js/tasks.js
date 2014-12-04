// TODO: top -n 1命令的tab

TEMP['tasks'] = function (air) {
    var baseUrl = 'http://' + air.Options.ip + ':' + air.Options.port ;
    var tasksBaseUrl = baseUrl + '/?mode=process&action=';
    var servicesUrl = tasksBaseUrl+"services";
    var tasksUrl = tasksBaseUrl+"tasks";
    var precessUrl = tasksBaseUrl+"precess";
    
    var tasksContainer = null,loading=null;
    
    var openTasksContainer = function(){
        if(tasksContainer!=null)return false;
        tasksContainer = air.require("UI").openWindow({
            title:air.Lang.icon_name_tasks,
            iconSrc:air.Options.iconPath+"tasks_80.png",
            onClose:function(){
                removeTasksContainer();
            },
            id:"tasks",
            draggable:true,
            handles:false
        });
        air.require("initAir").setStyle(air.Options.themePath+"window-tasks.css","window-tasks");
        air.require("Templete").getTemplate("window-tasks",function(temp){
            tasksContainer.setContent(temp);
            bindButtons(tasksContainer);
            tasksContainer.find(".tasks-tabs ul li:first").click();
        });
    };
    var removeTasksContainer = function(){
        tasksContainer.remove();tasksContainer=null;
    };
    var refresh = function(){
        tasksContainer.find(".tasks-tab-active").click();
    };
    var bindButtons= function(tar){
        tasksContainer.find(".tasks-refresh a").click(function(){refresh();});
        tasksContainer.find(".tasks-refresh-intrval-check").change(function(){
            if($(this).is(':checked')){
                var time = parseInt(tasksContainer.find(".tasks-refresh-intrval-time").val());
                if(time&&time>5){
                    setTimeout(function(){
                        if(tasksContainer){
                            refresh();
                            air.require("notify").toast("刷新成功");
                            tasksContainer.find(".tasks-refresh-intrval-check").change();
                        }
                    },time*1000);
                }else{
                    air.require("notify").toast("必须是>5");
                }
            }
        });
        tasksContainer.find(".tasks-contains").delegate(".tasks-process-kill","click",function(){
            var pn = $(this).parent().parent().find("td:eq(2)").text();
            air.require("dataTran").getJson({mode:"process",action:"processkill",process:pn},function(data){
                if(data.status=="ok"){
                    air.require("notify").toast('"'+pn+'" killed');
                    refresh();
                }
            });
        });
        tasksContainer.find(".tasks-tabs ul li").click(function(){
            var mode = $(this).data("tar");
            if(!$(this).hasClass("tasks-tab-active")){
                tasksContainer.find(".tasks-tabs ul li.tasks-tab-active").removeClass("tasks-tab-active");
                $(this).addClass("tasks-tab-active");
                tasksContainer.find(".tasks-contain-active").removeClass("tasks-contain-active");
                tasksContainer.find(".tasks-contain-"+mode).addClass("tasks-contain-active");
            }
            loading = air.require("util").setLoading(tasksContainer);
            air.require("dataTran").getJson({mode:"process",action:mode},function(data){
                var HTML = "";
                switch(mode){
                    case "services":
                        HTML = ServicesAdapter(data.list);
                        break;
                    case "tasks":
                        HTML = TasksAdapter(data.list);
                        break;
                    case "process":
                        HTML = ProcessAdapter(data.list,data.leftMem);
                        break;
                }
                tasksContainer.find(".tasks-contain-"+mode).html(HTML);
                air.require("myLazyLoad").lazyLoad(tasksContainer.find(".tasks-contain-"+mode),"img","src","src");
            },function(){
                tasksContainer.find(".tasks-contain-"+mode).html("WRONG");
            },function(){
                loading.remove();
            });
        });
    };
    // 正在运行的服务·的任务的适配器
    var ServicesAdapter = function(list){
        var str = '<table><thead><tr><th>图标</th><th>名称</th><th>进程</th><th>前台</th><th>pid</th><th>首次运行</th><th>上次运行</th></tr></thead><tbody>';
        $.each(list,function(i,v){
            str+='<tr><td class="tasks-contain-img"><img data-src="'+baseUrl+'/?mode=image&package='+v.process+'" src=""/></td><td>'+v.name+'</td><td>'+v.process+'</td><td>'+v.foreground+'</td><td>'+v.pid+'</td><td>'+v.activeSince+'</td><td>'+v.lastActivityTime+'</td></tr>';
        });
        tasksContainer.find(".tasks-status-bar").html("总数 : "+list.length);
        return str+'</tbody></table>';
    };
    
    // 正在运行·的任务的适配器
    var TasksAdapter = function(list){
        var str = '<table><thead><tr><th>图标</th><th>名称</th><th>进程</th><th>id</th><th>活动数</th><th>正在运行</th></tr></thead><tbody>';
        $.each(list,function(i,v){
            str+='<tr><td class="tasks-contain-img"><img data-src="'+baseUrl+'/?mode=image&package='+v.packageName+'" src=""/></td><td>'+v.name+'</td><td>'+v.packageName+'</td><td>'+v.id+'</td><td>'+v.numActivities+'</td><td>'+v.numRunning+'</td></tr>';
        });
        tasksContainer.find(".tasks-status-bar").html("总数 : "+list.length);
        return str+'</tbody></table>';
    };
    // 正在运行进程·的任务的适配器
    var ProcessAdapter = function(list,m){
        console.log(list);
        //importance: 100,memory: 4.14,name: "air",pid: 27738,processName: "com.wantflying.air",uid: 10154
        var str = '<table><thead><tr><th>图标</th><th>名称</th><th>进程</th><th>进程id</th><th>用户id</th><th>占用内存</th><th>优先级</th><th>操作</th></tr></thead><tbody>';
        $.each(list,function(i,v){
            str+='<tr><td class="tasks-contain-img"><img data-src="'+baseUrl+'/?mode=image&package='+v.processName+'" src=""/></td><td>'+v.name+'</td><td>'+v.processName+'</td><td>'+v.pid+'</td><td>'+v.uid+'</td><td>'+v.memory+'MB</td><td>'+v.importance+'</td><td><span class="tasks-process-kill">kill</span></td></tr>';
        });
        var kill = $('<span class="tasks-process-kill">KILL</span>');
        kill.click(function(){
            air.require("dataTran").getJson({mode:"process",action:"processkill"},function(data){
                if(data.status=="ok"){
                    refresh(); 
                    air.require("notify").toast("all killed");
                }
            });
        });
        tasksContainer.find(".tasks-status-bar").html("总数 : "+list.length+"　　总剩余内存 : "+air.require("util").mformat(m)+"　　").append(kill);
        return str+'</tbody></table>';
    };
    
    
    
    
    
//-------------------------------------------------------
    
    return {
        openTasksContainer:openTasksContainer,
        removeTasksContainer:removeTasksContainer
    };
};