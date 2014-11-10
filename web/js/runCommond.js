TEMP['runCommond'] = function(air){
    var cmdUrl = 'http://'+air.Options.ip+':'+air.Options.port+'/';
// -------------------------------------------------------
var TerminalWindow=null;
var options={
    w:470,
    h:340
};
var terminalHistory=[];
var historyPointer = 0;

var currentDir="/";
var currentMode="$";
var currentUser="air";
var rootUser="root";
var rootMode="#";
var currentDevice="android";

var openTerminal = function(){
    if(TerminalWindow!=null)return false;
    TerminalWindow = air.require("UI").openWindow({
        title:air.Lang.icon_name_terminal,
        iconSrc:air.Options.iconPath+"terminal_80.png",
        width:options.w,
        height:options.h+80,
        zIndex:99999,
        fixZindex:true,
        onClose:function(){
            removeTerminalWindow();
        },
        id:"terminal",
        draggable:true,
        handles:false
    });
    air.require("initAir").setStyle(air.Options.themePath+"window-terminal.css","window-terminal");
    TerminalWindow.setContent(air.require("Templete").terminalTemplate);
    TerminalWindow.delegate(".terminal","click",function(){
        $(this).find(".terminal-input").focus();
    });
    $(".terminal-input").width($(".terminal-bottom").width()-$(".terminal-prefix").width()-10);
    TerminalWindow.find(".terminal-input").keydown(function(e){
        if(e.keyCode==13){
            var v = $(this).val();
            if(v.replace(/\s/g,"")!=""){
                terminalHistory.push(v);
                historyPointer = terminalHistory.length;
                TerminalWindow.find(".terminal-list").append('<p>'+TerminalWindow.find(".terminal-prefix").text()+' '+v+'</p>');
                $(this).val("").focus();
                params = v.split(" ");
                if(params[0] == "su"){
                    currentMode="#";
                    TerminalWindow.find(".terminal-mode").text(currentMode);
                    $(".terminal-input").width($(".terminal-bottom").width()-$(".terminal-prefix").width()-5).focus();
                }else if(params[0] == "exit"){
                    if(currentMode=="#"){
                        currentMode = "$";
                        TerminalWindow.find(".terminal-mode").text(currentMode);
                    }else
                        removeTerminalWindow();
                    $(".terminal-input").width($(".terminal-bottom").width()-$(".terminal-prefix").width()-5).focus();
                }else{
                    TerminalWindow.find(".terminal-bottom").hide();
                    var user = "0";
                    if(currentMode=="#"){
                        user="su";
                    }
                    exec(v,currentDir,function(data){
                        TerminalWindow.find(".terminal-bottom").show();
                        if(data.status!="ok")
                            TerminalWindow.find(".terminal-list").append('<pre>'+data.status+'</pre>');
                        if(data.message && data.message!="")
                            TerminalWindow.find(".terminal-list").append('<pre>'+data.message+'</pre>');
                        if(data.directory && data.directory!="")
                            currentDir = data.directory;
                        TerminalWindow.find(".terminal-dir").text(currentDir);
                        $(".terminal-input").width($(".terminal-bottom").width()-$(".terminal-prefix").width()-5).focus();
                        TerminalWindow.find(".terminal").scrollTop(TerminalWindow.find(".terminal-bottom").offset().top);
                    },user);
                }
            }
        }else if(e.keyCode==38){//↑
            var p = historyPointer-1;
            if(historyPointer<=0){
                p=0;
            }else{
                historyPointer--;
            }
            $(this).val(terminalHistory[p]).focus();
        }else if(e.keyCode==40){//↓
            var p = "";
            if(historyPointer>=terminalHistory.length){
                historyPointer=terminalHistory.length
            }else{
                p = terminalHistory[historyPointer+1];
                historyPointer++;
            }
            $(this).val(p).focus();
        }
        console.log(terminalHistory.length+"-"+historyPointer);
    }).focus();
};
var removeTerminalWindow = function(){
    if(TerminalWindow!=null)
        TerminalWindow.find(".window_close").click();
    TerminalWindow=null;
};
    
//-------------------------------------------------------
    var exec = function(cmd,dir,func,user){
        $.get(cmdUrl+"?mode=shell&action=cmd&cmd="+cmd+"&dir="+dir+"&user="+user+"&output=1",function(data){
            func && func(data);
        },"json");
    };
//-------------------------------------------------------
    var openUrl = function(url,func){
        $.get(cmdUrl+"?mode=runcmd&action=OpenUrl&url="+url,function(data){
            func && func(data);
        },"json");
    };
    var text = function(txt,func){
        $.get(cmdUrl+"?mode=runcmd&action=simulateText&txt="+txt,function(data){
            func && func(data);
        },"json");
    };
    var button = function(btn,func){
        var keyInt = air.require("keyMap")['KEYCODE_'+btn.toUpperCase()];
        $.get(cmdUrl+"?mode=runcmd&action=button&button="+keyInt,function(data){
            func && func(data);
        },"json");
    };
    var touch = function(x_p,y_p,func){
        $.get(cmdUrl+"?mode=runcmd&action=Touch&x="+x_p+"&y="+y_p,function(data){
            func && func(data);
        },"json");
    };
    var slide = function(from,to,func){
        $.get(cmdUrl+"?mode=runcmd&action=Swap&x="+from[0]+"&y="+from[1]+"&x2="+to[0]+"&y2="+to[1],function(data){
            func && func(data);
        },"json");
    };
    var reboot = function(func){
        $.get(cmdUrl+"?mode=runcmd&action=reboot",function(data){
            func && func(data);
        },"json");
    };
    var shutdown = function(func){
        $.get(cmdUrl+"?mode=runcmd&action=shutdown",function(data){
            func && func(data);
        },"json");
    };
//-------------------------------------------------------

    
    return {
        openTerminal:openTerminal,
        exec:exec,
        openUrl:openUrl,
        text:text,
        button:button,
        touch:touch,
        slide:slide,
        reboot:reboot,
        shutdown:shutdown
    };
};