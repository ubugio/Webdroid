TEMP['player'] = function(air){

    //-------------------------------------------------------------------music
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
    window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
 
    var au=null,
        defaultVol=80,
        secondFormat=function(inp){
            var sec = parseInt(inp);
            var mins = parseInt(sec / 60);
            sec = sec - mins * 60;
            mins=mins<10?"0"+mins:mins;
            sec=sec<10?"0"+sec:sec;
            var string=mins+":"+sec;
            return string;
        };
        var miniPanel=null;
    var playMusic = function(title,url){
        var tar = air.require("UI").openWindow({
            title:air.Lang.music_window_title,
            iconSrc:air.Options.iconPath+"music_80.png",
            width:300,
            height:300,
            zIndex:99999,
            fixZindex:true,
            
            id:"music_player",
            onClose:function(){
                au && au.stop();
                au=null;
                miniPanel.remove();
                miniPanel=null;
            },
            onMin:function(){
                miniPanel.fadeIn();
            },
            draggable:true,
            tab:false,
            handles:false
        });
        
        tar.setContent(air.require("UI").substitute(air.require("Templete").playerTemplate,{
            TITLE:title
        }));
        miniPanel = $('<canvas class="music music_mini" style="display:none;left: '+(air.Options.ScreenSize[0]-110)+'px;" width="100" height="30"></canvas>');
        $("body").append(miniPanel);
        miniPanel.jqDrag();
        miniPanel.click(function(){
            miniPanel.fadeOut();
            tar.slideDown();
        });
        var loading = air.require("util").setLoading(tar);
        $("span.pause").hide();
        $(".player-volnow").width(defaultVol+"%");
        $(".player-volume i").text(defaultVol);
        var progress = $(".player-progress .player-played");
        window.au =au = Beats.createAudio({
            id:"music_player",
            volume:defaultVol,
            autoLoad:true,
            loop:true,
            type:"AduioElement",
            autoPlay:true,
            url:url,
            modules:["analyser"],

            whilePlaying:function(e){
                $(".player-time .player-now").text(secondFormat(au.getCurrentTime()));
                progress.width(((au.getCurrentTime()*100)/au.getTotalTime())+"%");
            },
            onReady:function(){
                $(".player-time .player-total").text(secondFormat(au.getTotalTime()));
                draw(tar);
                loading.remove();
            },
        }).on("play",function(){
            $("span.play").hide();
            $("span.pause").show();
        }).on("pause",function(){
            $("span.play").show();
            $("span.pause").hide();
        }).on("end",function(){
            endDraw();
        });
        $("span.play").click(function(){
            au.play();
        });
        $("span.pause").click(function(){
            au.pause();
        });
        $(".player-fullvol").on("click",function(e){
            var x=$(this).offset();
            var w=$(this).width();
            var ep = Math.round((e.pageX - x.left)/w * 100);
            $(".player-volnow").width(ep+"%");
            $(".player-volume i").text(ep);
            au.volume(ep);
        });
        $(".player-progress").on("click",function(e){
            var x=$(this).offset();
            var w=$(this).width();
            var ep =(e.pageX - x.left)/w;
            au.playAt(ep,"percent");
            progress.width( (ep)*100+"%");
        });
    };
    var music_animate=null;
    var endDraw = function (){
        if(music_animate)
            cancelAnimationFrame(music_animate);
    }
    
    var effect1=function(tar){
        music_animate=null;
        var _t=this,
        canvas = tar.find("canvas")[0],
        cwidth = canvas.width,
        cheight = canvas.height - 2,
        
        meterWidth = 6, //width of the meters in the spectrum
        gap = 1, //gap between meters
        capHeight = 2,
        capStyle = '#fff',
        meterNum = Math.round(cwidth/(meterWidth+gap));//count of the meters
        capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
            
        var ctx = canvas.getContext('2d');
        var drawMeter = function() {
            var array = au.audio.analyser.getFrequencyOfGap(meterNum);
            
            ctx.clearRect(0, 0, cwidth, cheight);
            for (var i = 0; i < meterNum; i++) {
                var value = (array[i]/300)*200;
                if (capYPositionArray.length < Math.round(meterNum)) {
                    capYPositionArray.push(value);
                };
                ctx.fillStyle = capStyle;
                if (value < capYPositionArray[i]) {
                    capYPositionArray[i] = capYPositionArray[i]-0.5;
                    ctx.fillRect(i * (meterWidth+gap), cheight - (capYPositionArray[i])-1, meterWidth, capHeight);
                } else {
                    ctx.fillRect(i * (meterWidth+gap), cheight - value-1, meterWidth, capHeight);
                    capYPositionArray[i] = value;
                };
                ctx.fillStyle = '#fff';
                ctx.fillRect(i * (meterWidth+gap) , cheight - value + capHeight, meterWidth, cheight); //the meter
            }
        }
        return drawMeter;
    };
    var effect2=function(tar){
        music_animate=null;
        var _t=this,
        canvas = miniPanel[0],
        cwidth = canvas.width,
        cheight = canvas.height - 2,
        
        meterWidth = 2, //width of the meters in the spectrum
        gap = 1,
        capStyle = '#fff',
        meterNum = Math.round(cwidth/(meterWidth+gap));//count of the meters
        capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
            
        var ctx = canvas.getContext('2d');
        var drawMeter = function() {
            var array = au.audio.analyser.getFrequencyOfGap(meterNum);
            ctx.clearRect(0, 0, cwidth, cheight);
            for (var i = 0; i < meterNum; i++) {
                var value = (array[i]/300)*30;
                ctx.fillStyle = '#fff';
                ctx.fillRect(i * (meterWidth+gap) , cheight - value, meterWidth, cheight); //the meter
            }
        }
        return drawMeter;
    };
    var draw=function(tar){
        var e1=effect1(tar);
        var e2=effect2(tar);
        function loop(){
            if(miniPanel.is(":visible")){
                e2();
            }else{
                e1();
            }
            music_animate = requestAnimationFrame(loop);
        }
        music_animate = requestAnimationFrame(loop);
    };
    var playMusicfromId=function(title,id){
        playMusic(title,'http://'+air.Options.ip+':'+air.Options.port+'/?mode=stream&action=music&id='+id);
    };
    var playMusicfromPath=function(title,path){
        playMusic(title,'http://'+air.Options.ip+':'+air.Options.port+'/?mode=stream&action=music&path='+path);
    };
    //-------------------------------------------------------------------images
    var playImage = function(url,_w,_h){
        var pre = $('<div class="image-preview"><span class="close">&times;</span><span class="imgCon"><img src="'+url+'" /></span><div class="image_panel"><span class="scale">0%</span><span class="zoomOut">+</span><span class="zoomIn">-</span><span class="rotateR">-></span><span class="rotateL"><-</span></div></div>');
        $("body").append(pre);
        //pre.height(air.Options.ScreenSize[1]);
        var img = pre.find("img");
        var w =  _w || img.width();
        var h = _h || img.height();
        var p1 = (air.Options.ScreenSize[0]*0.9);
        var p2 = (air.Options.ScreenSize[1]*0.9);
        var scale=0;
        if((p1/w)*h<p2){
            scale=p1/w;
            img.width(p1+"px");
            img.css({"top":(air.Options.ScreenSize[1]-scale*h)/2,"left":air.Options.ScreenSize[0]*0.05});
        }else{
            scale=p2/h;
            img.height(p2+"px");
            img.css({"top":air.Options.ScreenSize[1]*0.05,"left":(air.Options.ScreenSize[0]-scale*w)/2});
        }
        pre.find(".scale").text(parseInt(scale*100)+"%");
        img.css({"opacity":1}).jqDrag(null,{
            defaultOpacity:1
        });
        pre.find(".close").click(function(e){
            pre.fadeOut(function(){
                pre.remove();
            });
            e.stopPropagation();
        });
        var zoom=1;
        var rotate=0;
        var css = function(){
            pre.find(".scale").text(parseInt(scale*zoom*100)+"%");
            img.css("transform","rotate("+rotate+"deg) scale("+zoom+", "+zoom+")");
        };
        pre.find(".zoomOut").click(function(){
            zoom+=0.1;css();
        });
        pre.find(".zoomIn").click(function(){
            zoom-=0.1;
            if(zoom<0)zoom=0.1;
            css();
        });
        pre.find(".rotateR").click(function(){
            rotate+=90;css();
        });
        pre.find(".rotateL").click(function(){
            rotate-=90;css();
        });
    };
    var playImagefromId=function(id,w,h){
        playImage('http://'+air.Options.ip+':'+air.Options.port+'/?mode=stream&action=image&id='+id,w,h);
    };
    var playImagefromPath=function(path){
        playImage('http://'+air.Options.ip+':'+air.Options.port+'/?mode=stream&action=image&path='+path);
    };
    //-------------------------------------------------------------------videos
    var playVideo = function(url){
        var pre = $('<div class="image-preview video-preview"><span class="close">&times;</span><span class="imgCon"><video controls="" autoplay="" name="media"><source src="'+url+'"></video></span></div></div>');
        $("body").append(pre);
        //pre.height(air.Options.ScreenSize[1]);
        var img = pre.find("video");
        var w = img.width();
        var h = img.height();
        var p1 = (air.Options.ScreenSize[0]*0.9);
        var p2 = (air.Options.ScreenSize[1]*0.9);
        if((p1/w)*h<p2){
            scale=p1/w;
            img.width(p1+"px");
            img.css({"top":(air.Options.ScreenSize[1]-scale*h)/2,"left":air.Options.ScreenSize[0]*0.05});
        }else{
            scale=p2/h;
            img.height(p2+"px");
            img.css({"top":air.Options.ScreenSize[1]*0.05,"left":(air.Options.ScreenSize[0]-scale*w)/2});
        }
        img.css({"opacity":1});
        pre.find(".close").click(function(e){
            pre.fadeOut(function(){
                pre.remove();
            });
            e.stopPropagation();
        });
    };
    var playVideofromId=function(id){
        playVideo('http://'+air.Options.ip+':'+air.Options.port+'/?mode=stream&action=video&id='+id);
    };
    var playVideofromPath=function(path){
        playVideo('http://'+air.Options.ip+':'+air.Options.port+'/?mode=stream&action=video&path='+path);
    };
    //----------------------------
    return {
        secondFormat:secondFormat,
        playMusicfromId:playMusicfromId,
        playMusicfromPath:playMusicfromPath,
        playImagefromId:playImagefromId,
        playImagefromPath:playImagefromPath,
        playVideofromId:playVideofromId,
        playVideofromPath:playVideofromPath,
    };
};