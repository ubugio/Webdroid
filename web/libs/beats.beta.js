/******
 * music // part of Beats 
 * // 音乐模块 播放器模块 8-28
 */
 
;(function(e,undefined){
    var info={$name:"Beats",$version:"0.2",$author:"Zing",$description:"HTML5 audio API (heig level)"},
    Z = e[info.$name],
    extend=function (i,l,m){
        var b=-1,f=Array.prototype.slice.call(arguments,0),
        i={};l=[];
        for(m=true;f[++b];)
            if(typeof(f[b])==="boolean")
                m=f[b];
            else if(typeof(f[b])==="object" || typeof(f[b])==="function")
                l.push(f[b]);
        if(l.length>=2)
            i=l.splice(0,1)[0];
        for(b=0;b<l.length;b++){
            f=l[b];
            for(var k in f)
                if(!i.hasOwnProperty(k)||m)
                    i[k]=f[k]
        }
        return i
    },
    __audioAPIs=function(tar){
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        try {
            tar.audioContext = new AudioContext();
        } catch (e) {
            console.log('!Your browser does not support AudioContext');
            console.log(e);
        }
    };
    
    if(Z===undefined){
        Z = {
            name:"",
            info:info,
            VERSION:info.$version,
            about:" description:"+info.$description+"\n version: " + info.$version + "\n ^.^",
            audios:{},
            onReady:function(){},
            error:function(){}
        };
        Z.extend=extend;
        Z.__audioAPIs=__audioAPIs;
        Z.options={
            impulsePath:"impulse/"
        };
        Z.setup=function(_options){
            extend(Z.options,_options,true);
        };
        Z.defaultAudioOptions={
            stream:false,
            type:null,
            useBeats:true,

            autoLoad:true,
            autoPlay:false,

            modules:["filter","effect","volume","analyser","panner"],

            volume:100,
            mute:false,
            from:null,
            to:null,
            loop:false,
            loops:1,
            pan:0,
            fadeIn:0,
            fadeOut:0,

            onLoaded:function(){},
            onDecoded:function(){},
            onReady:function(){},
            onPlay:function(){},
            onPause:function(){},
            onEnd:function(){},
            onStop:function(){},

            whileLoading:function(){},
            whilePlaying:function(){}
        };

        Z.AUDIO=function(_options){
            this.initOptions=Z.defaultAudioOptions;
            extend(this.initOptions,_options,true);
            this.audio={
                audioContext:null,
                sourceNode :null,
                filter:null,
                effect:null,
                volume:null,
                delay:null,
                analyser:null,
                panner:null

            };
            __audioAPIs(this.audio);
            if(this.initOptions.autoLoad) this.load();
        };
        
        e[info.$name] = Z;
        
        
    }else{
        throw new Error("\""+info.$name+"\" namespace has been defined !!!");
    }
    
})(window||this);


// core 模块 主程序函数 最顶层函数
;(function(e,B,undefined){

    var main=function(){
        var id=0;

        var createAudio=function(options){
            options=B.extend({
                id:id++,
                url:""
            },options,true);
            if(this.audios[options.id]){
                this.audios[options.id].destroy();
                delete this.audios[options.id];
            }
            var ret = new this.AUDIO(options);
            this.audios[options.id]=ret;
            return ret;
        };
        var getAudioById=function(id){
            var ret = B.audios[id];
            return ret?ret:null;
        };
        var play=function(id){
            var tar = this.getAudioById(id);
            if(tar)
                tar.play();
            else
                return false;
            return this;
        };
        return {
            createAudio:createAudio,
            getAudioById:getAudioById,
            play:play
        };

    };
    var ter=main();
    B.extend(B,ter);
    
})(window||this,Beats);


// media 模块 处理音频加载和预处理模块
;(function(e,B,undefined){

    var main=function(){
        var __decode = function(tar,res,func,func2){
            if(!func2)var func2=function(){};
            tar.audio.audioContext.decodeAudioData(res,func,func2);
        };
        var status="",url,format,size;

        var __createBufferSourceNode=function(){
            status="analyzing";
            var analyser = this.audio.audioContext.createAnalyser();
            this.audio.analyser=analyser;
            this.audio.sourceNode = this.audio.audioContext.createBufferSource();
            
            if (!this.audio.sourceNode.start) {
                this.audio.sourceNode.start = this.audio.sourceNode.noteOn //in old browsers use noteOn method
                this.audio.sourceNode.stop = this.audio.sourceNode.noteOff //in old browsers use noteOn method
            };
            
            this.audio.sourceNode.connect(analyser);
            analyser.connect(this.audio.audioContext.destination);
            
        };
        var loadFromUrl=function() {
            var _t=this;
            status="setting";
            var xhr = new XMLHttpRequest();
            xhr.open('GET', _t.initOptions.url, true);
            xhr.responseType = 'arraybuffer'; 
            xhr.onprogress=function(e){_t.initOptions.whileLoading(e);};
            _t.__createBufferSourceNode();
            xhr.onload = function() {
                status="decoding";
                _t.initOptions.onLoaded();
                _t.audio.audioContext.decodeAudioData(xhr.response, function(arraybuffer) {
                    status="decoded";
                    _t.initOptions.onDecoded();
                    _t.audio.sourceNode.buffer = arraybuffer;
                    _t.initOptions.onReady();
                    if(_t.initOptions.autoPlay) _t.play();
                }, function(e) {
                    status="decode faile";
                });
            }
            status="loading";
            xhr.send();
            return _t;
        };
        var __connectNodes = function(){
            // 特殊处理，在每个自定义模块间用gain过渡，才能使用connect方法链接。把模块的名称首字母大写后实例化
            var _t=this;
            var modules = _t.initOptions.modules;
            var current = this.audio.sourceNode;
            var ctx = this.audio.audioContext;
            for (var i = 0,l=modules.length; i < l; i++) {
                var current2 = ctx.createGain();
                _t.audio[modules[i]] = new B[modules[i].replace(/\w/,function(m){return m.toUpperCase()})](ctx);
                _t.audio[modules[i]].connect(current,current2);
                current = current2;
            };
            current.connect(ctx.destination);
        };
        var __createMediaElementSourceNode=function(){
            status="analyzing";
            var _t=this;
            var audio=document.createElement("audio");
            audio.setAttribute("id", "Beats_"+_t.initOptions.id);
            //document.getElementsByTagName("body")[0].appendChild(audio);
            this.audio.sourceNode = _t.audio.audioContext.createMediaElementSource(audio);
            this.__connectNodes();
            return audio;
        };
        var onS={};
        var onPosition=function(pos,func){
            onS[pos]=func;
            return this;
        };
        var cancelPosition=function(pos){
            if(onS[pos])
                delete onS[pos];
            return this;
        };
        var cancelAllPosition=function(){
            onS={};
            return this;
        };
        var loadFromAduioElement=function(){
            var _t=this;
            var audio = _t.__createMediaElementSourceNode();

            audio.volume=_t.initOptions.volume/100;
            audio.autoplay=false;
            audio.muted=_t.initOptions.muted;
            audio.loop=_t.initOptions.loop;

            audio.addEventListener("durationchange",function(){_t.initOptions.whileLoading()});
            audio.addEventListener("loadeddata",function(){_t.initOptions.onLoaded()});
            audio.addEventListener("canplay",function(){_t.initOptions.onReady()});
            audio.addEventListener("onplaying",function(){_t.initOptions.whilePlaying()});
            audio.addEventListener("onended",function(){_t.stop()});

            audio.addEventListener("timeupdate",function(){
                _t.initOptions.whilePlaying()
                var t = Math.round(_t.getCurrentTime());
                if(onS[t]){
                    onS[t]();
                    delete onS[t];
                }
            });
            audio.src = _t.initOptions.url;

            if(_t.initOptions.autoPlay) 
                audio.addEventListener("canplay",function(){_t.play()});
            return _t;
        };
        var load=function(){
            var _t=this;
            if(_t.initOptions.type=="AduioElement")
                return _t.loadFromAduioElement();
            else
                return _t.loadFromUrl();
        };
        var destroy=function(){
            this.audio.sourceNode.mediaElement.src = "about:blank";
            this.audio.sourceNode.mediaElement.load();
            this.resetOption();
        };

        return {
            __createBufferSourceNode:__createBufferSourceNode,
            __createMediaElementSourceNode:__createMediaElementSourceNode,
            __connectNodes:__connectNodes,
            loadFromUrl:loadFromUrl,
            loadFromAduioElement:loadFromAduioElement,
            load:load,
            destroy:destroy,

            onPosition:onPosition,
        };

    };
    var ter=main();
    B.extend(B.AUDIO.prototype,ter);
    
})(window||this,Beats);
 


// player 模块 音频播放模块 音频的controler
;(function(e,B,undefined){
    var main = function(){
        // 属性
        var status="";
        
        // 变量声明
        var startTime=0;
        var pauseTime=0;
        var pausedTime=0;
        var pauseStatus=0;
        var playAtBegin=0;
        var resetOption=function(){
            startTime=0;
            pauseTime=0;
            pausedTime=0;
            pauseStatus=0;
            playAtBegin=0;
        };
        
        var secondFormat=function(inp){
            var sec = parseInt(inp);
            var mins = parseInt(sec / 60);
            var f_x = parseInt(inp*100)-sec*100;
            sec = sec - mins * 60;
            mins=mins<10?"0"+mins:mins;
            sec=sec<10?"0"+sec:sec;
            f_x=f_x<10?"0"+f_x:f_x;
            var string=mins+":"+sec+"."+f_x;
            return string;
        }
        
        var getCurrentTime=function(type){
            var ret=0;
            if(this.initOptions.type=="AduioElement"){
                if(this.initOptions.stream){
                    ret=this.getPlayTime();
                }else{
                    ret = (this.audio.sourceNode.mediaElement.currentTime) % this.getTotalTime();
                }
            }else{
                ret = (this.audio.audioContext.currentTime-pausedTime+playAtBegin) % this.getTotalTime();
            }
            if(pauseStatus)ret = pauseTime;
            if(type && type=="string")
                return secondFormat(ret);
            else
                return ret;
        };
        var getTotalTime=function(type){
            var ret=999999999;
            if(this.initOptions.type=="AduioElement"){
                if(this.initOptions.stream){
                    ret = (this.audio.sourceNode.mediaElement.buffered.end(0) - this.audio.sourceNode.mediaElement.buffered.start(0));
                }else{
                    ret = this.audio.sourceNode.mediaElement.duration;
                }
            }else{
                ret = this.audio.sourceNode.buffer.duration;
            }
            if(type && type=="string")
                return secondFormat(ret);
            else
                return ret;
        };
        var getPlayTime=function(type){
            //if(this.initOptions.type=="AduioElement"){
            //    var ret = this.audio.sourceNode.mediaElement.currentTime;
            //}else{
                var ret = this.audio.audioContext.currentTime-pausedTime;
            //}
            if(type && type=="string")
                return secondFormat(ret);
            else
                return ret;
        };
        var loop=function(v){
            if(this.initOptions.type=="AduioElement"){
                if(v!=undefined)
                    this.audio.sourceNode.mediaElement.loop=v;
                else
                    return this.audio.sourceNode.mediaElement.loop;
            }else{
                if(v!=undefined)
                    this.audio.sourceNode.buffer.loop=v;
                else
                    return this.audio.sourceNode.buffer.loop;
            }
                return this;
        };
        var getLoopTimes=function(){
            return parseInt(this.audio.audioContext.currentTime / this.getTotalTime());
        };
        var getSampleRate =function(){
            return this.audio.audioContext.sampleRate ;
        };
        var volume=function(v){
            if(this.initOptions.type=="AduioElement"){
                if(v!=undefined)
                    this.audio.sourceNode.mediaElement.volume=v/100;
                else
                    return this.audio.sourceNode.mediaElement.volume*100;
            }else{
                // TODO : 
            }
                return this;
        };
        var mute=function(v){
            if(this.initOptions.type=="AduioElement"){
                if(v!=undefined)
                    this.audio.sourceNode.mediaElement.muted=v;
                else
                    return this.audio.sourceNode.mediaElement.muted;
            }
                return this;
        };
        var muteSwitch=function(){
            var ret=false;
            if(this.initOptions.type=="AduioElement"){
                if(!this.audio.sourceNode.mediaElement.muted)
                    ret=true;
                this.audio.sourceNode.mediaElement.muted=ret;
            }
                return ret;
        };
     
        var on=function(type,func){
            var _t=this;
            var num = /^[0-9]+.?[0-9]*$/;
            if(num.test(type)){
                _t.onPosition(type,func);
            }else{
                type=type.toLowerCase();
                if(type == "play")_t.initOptions.onPlay=func;
                else if(type == "pause")_t.initOptions.onPause=func;
                else if(type == "stop")_t.initOptions.onStop=func;
                else if(type == "end")_t.initOptions.onEnd=func;
                else{
                    _t.audio.sourceNode.mediaElement.addEventListener(type,function(){func();});  
                }  
            } 
            return this;
        };
        
        var play=function(option){
            var _t=this;
            //if(this.initOptions.type=="AduioElement"){
            //    startTime = this.audio.sourceNode.mediaElement.currentTime;
            //}else{
                startTime = this.audio.audioContext.currentTime-pausedTime;
            //}
            pausedTime=startTime-pauseTime;
            if(this.initOptions.type=="AduioElement"){
                this.audio.sourceNode.mediaElement.play();
            }else{
                this.audio.sourceNode.start(0,pauseTime % this.getTotalTime());
                this.audio.sourceNode.onended = onEnd;
            }
            this.initOptions.onPlay();
            status="playing";
            pauseStatus=0;
            return this;
        };
        
        var playAt=function(num,type){
                        console.log(type);
            if(this.initOptions.type=="AduioElement"){
                        console.log(type);
                if(this.initOptions.stream){
                        console.log(type);
                    return false;
                }else{
                    if(type && type=="percent"){
                        playAtBegin=this.getTotalTime()*num;
                        console.log(playAtBegin);
                        this.audio.sourceNode.mediaElement.currentTime=playAtBegin;
                    }else{
                        console.log(type);
                        this.audio.sourceNode.mediaElement.currentTime=num;
                    }
                }
            }else{
                //TODO : playAt with AudioSourceNode
            }
            // todo todo return this.getCurrentTime();
        };
        var endAt=function(num,type){
            // TODO
        };
        var pause=function(){
            if(this.initOptions.type=="AduioElement"){
                pauseTime = this.audio.sourceNode.mediaElement.currentTime;
            }else{
                pauseTime += this.audio.audioContext.currentTime - startTime;
            }
            if(this.initOptions.type=="AduioElement"){
                this.audio.sourceNode.mediaElement.pause();
            }else{
                this.audio.sourceNode.stop(0);
                this.__creatAnalyser();
            }
            this.initOptions.onPause();
            status="pause";
            pauseStatus=1;
            return this;
        };
        var stop=function(){
            if(this.initOptions.type=="AduioElement"){
                this.audio.sourceNode.mediaElement.currentTime=0;
                this.audio.sourceNode.mediaElement.pause();
            }else{
                this.audio.sourceNode.disconnect();
                this.__createBufferSource();
                this.audio.sourceNode.stop(0);
            }
            pauseTime=0;
            startTime=0;
            this.initOptions.onStop();
            this.initOptions.onEnd();
            status="stop";
            pauseStatus=1;
            return this;
        };
        
        var setLoop=function(t){
            if(this.initOptions.type=="AduioElement"){
                return this.audio.sourceNode.buffer.loop=t;
            }else{
                return this.audio.sourceNode.mediaElement.loop=t;
            }
        };

        
        
        return {
            resetOption:resetOption,
            status:status,
            getCurrentTime:getCurrentTime,
            getTotalTime:getTotalTime,
            getPlayTime:getPlayTime,
            loop:loop,
            getLoopTimes:getLoopTimes,
            getSampleRate:getSampleRate,
            volume:volume,
            mute:mute,
            
            on:on,
            
            play:play,
            playAt:playAt,
            endAt:endAt,
            pause:pause,
            stop:stop,
            setLoop:setLoop,
            
        };
    };
    var ter=main();
    B.extend(B.AUDIO.prototype,ter);
    
})(window||this,Beats);
 
 

// Beats 模块 节奏模块 音频的节奏
;(function(e,B,undefined){

    B.Analyser = function (ctx) {
        this.analyser = ctx.createAnalyser();
    };
    B.Analyser.prototype = {
        connect : function(from,to){
            from.connect(this.analyser);
            this.analyser.connect(to);
            this.from=from;
            this.to=to;
            return to;
        },
        disconnect : function(){
            this.from.disconnect()
            this.analyser.disconnect()
        },
        outofconnect:function(){
            this.disconnect();
            this.from.connect(this.to);
        },
        reconnect:function(){
            this.from.disconnect();
            this.connect(this.from,this.to);
        },
    };

    var main = function(){
        var getWaveformUint8=function(size){
            var size=size?size:2048;
            this.analyser.fftSize=size;
            var helfsize=this.analyser.frequencyBinCount;
            var array = new Uint8Array(helfsize);
            this.analyser.getByteTimeDomainData(array);
            return array;
        };
        var getSpectrumUint8=function(size){
            var size=size?size:2048;
            this.analyser.fftSize=size;
            var helfsize=this.analyser.frequencyBinCount;
            var array = new Uint8Array(helfsize);
            this.analyser.getByteFrequencyData(array);
            return array;
        };
        var getWaveformFloat32=function(size){
            var size=size?size:2048;
            this.analyser.fftSize=size;
            var helfsize=this.analyser.frequencyBinCount;
            var array = new Float32Array(helfsize);
            this.analyser.getFloatTimeDomainData(array);
            return array;
        };
        var getSpectrumFloat32=function(size){
            var size=size?size:2048;
            this.analyser.fftSize=size;
            var helfsize=this.analyser.frequencyBinCount;
            var array = new Float32Array(helfsize);
            this.analyser.getFloatFrequencyData(array);
            return array;
        };
        
        var getFrequency=function( freq , endFreq ){
            var array = this.getSpectrumUint8();
            var l = arguments.length;
            if(l==1){
                return array[arguments[0]];
            }else if(l==2){
                if(arguments[1]>=array.length)return false;
                var v=0;
                for(var i=arguments[0];i<arguments[1];i++){
                    v+=array[i];
                }
                return v/(arguments[1]-arguments[0]);
            }else{
                var v=0,l=array.length;
                for(var i=0;i<l;i++){
                    v+=array[i];
                }
                return v/l;
            }
        };
        var getFrequencyOfAve=function( num ){
            var array = this.getSpectrumUint8();
            var ret=[];
            var l=Math.round(array.length/num);
            for(var ind=0;ind<num;ind++){
                var v=0;
                for(var i = ind*l; i < (ind+1)*l; i++) {
                    v += array[i];
                }
                ret.push(v/l);
            }
            return ret;
        };
        var getFrequencyOfGap=function( num ){
            var array = this.getSpectrumUint8();
            var step = Math.round(array.length / num);
            var ret=[];
            for (var i = 0; i < num; i++) {
                ret.push(array[i * step]);
            }
            return ret;
        };
        
        return {
            getWaveform:getWaveformUint8,
            getSpectrum:getSpectrumUint8,
            getWaveformUint8:getWaveformUint8,
            getSpectrumUint8:getSpectrumUint8,
            getWaveformFloat32:getWaveformFloat32,
            getSpectrumFloat32:getSpectrumFloat32,
            
            getFrequency:getFrequency,
            getFrequencyOfAve:getFrequencyOfAve,
            getFrequencyOfGap:getFrequencyOfGap,
        };
    };
    
    var ter=main();
    B.extend(B.Analyser.prototype,ter);
    
})(window||this,Beats);
 
// Beats 模块 节奏模块 音频的节奏
;(function(e,B,undefined){

    B.Filter = function (ctx) {
        var filters = [],
            freqs = [32, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
        this.default_EFFECT = {
                'reset' : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                'bruce' : [0, -2, 0, 2, 1, 0, 0, 0, 0, -2, -4],
                'opera' : [0, 0, 0, 0, 4, 5, 3, 6, 3, 0, 0],
                'metal' : [0, -6, 0, 0, 0, 0, 0, 4, 0, 4, 0],
                'dance' : [-2, 5, 9, 5, 0, 4, -4, -4, 8, -2, 4],
                'pop' :[ -1, 3, 7, 5, -2, 3, 7, -2, 4, 6, 5],
                'rock' : [-3, 7, 7, 9, -3, 2, -3, -1, 6, 9, 7],
                'voice' : [0, -6, -2, -4, -8, 2, 6, 8, 6, -2, -6],
                'country' : [0, -2, 0, 0, 2, 2, 0, 0, 0, 4, 4],
                'suggest' : [-1, 3, 4, 5, 0, -1, 3, 4, 5, 6, 7],
                'electronic': [0,-6,1,4,-2,-2,-4,0,0,6,6],
                'jazz' : [-1,-2,5,5,1,-6,3,1,4,6,2],
                'classic': [-3,10,8,3,1,0,0,1,3,8,10],
                'old' : [0,-4,0,2,1,0,0,0,0,-4,-6]
            };
        for (var i = 0; i < 10; i++) {
            var filter = ctx.createBiquadFilter();
            filter.type = filter.PEAKING || 'peaking'; //Filter.type: PEAKING
            filter.Q.value = 1.4;
            filter.gain.value = 0;
            filter.frequency.value = freqs[i];
            filters.push(filter);
        }
        for(i = 0,len = filters.length; i < len - 1; i++){
            filters[i].connect(filters[i + 1]);
        }
        this.filters = filters;
        this.input = this.filters[0];
        this.output = this.filters[i];
    };
    B.Filter.prototype = {
        connect : function(from,to){
            from.connect(this.input);
            this.output.connect(to);
            this.from=from;
            this.to=to;
            return to;
        },
        disconnect : function(){
            this.from.disconnect()
            this.output.disconnect()
        },
        outofconnect:function(){
            this.disconnect();
            this.from.connect(this.to);
        },
        reconnect:function(){
            this.from.disconnect();
            this.connect(this.from,this.to);
        },
        setEffect : function(ef){
            for (var i = 0 , len = ef.length; i < len; i++) {
                if(i ==  0){
                    this.output.gain.value = Math.pow(10, ef[i]/12); //mater gain 防止均衡调太大出现爆音
                    continue ;
                }
                var v = ef[i];
                this.filters[i - 1].gain.value = v;
            }
        }
    };
})(window||this,Beats);

// Beats 模块 节奏模块 音频的节奏
;(function(e,B,undefined){

    B.Volume = function (ctx) {
        this.gain = ctx.createGain();
        this.input=this.gain;
        this.output=this.gain;
    };
    B.Volume.prototype = {
        connect : function(from,to){
            from.connect(this.input);
            this.output.connect(to);
            this.from=from;
            this.to=to;
            return to;
        },
        disconnect : function(){
            this.from.disconnect()
            this.output.disconnect()
        },
        outofconnect:function(){
            this.disconnect();
            this.from.connect(this.to);
        },
        reconnect:function(){
            this.from.disconnect();
            this.connect(this.from,this.to);
        },
        setVolume:function(num){
            this.gain.gain.value=num;
        }
    };

})(window||this,Beats);
 
// Beats 模块 节奏模块 音频的节奏
;(function(e,B,undefined){

    B.Effect = function (ctx) {
        this.Effects={
            'reset':[''],
            'backslap1':['backslap1.wav'],
            'backwards-2':['backwards-2.wav'],
            'backwards-4':['backwards-4.wav'],
            'bright-hall':['bright-hall.wav'],
            'chorus-feedback':['chorus-feedback.wav'],
            'comb-saw1':['comb-saw1.wav'],
            'comb-saw2':['comb-saw2.wav'],
            'comb-saw3':['comb-saw3.wav'],
            'comb-saw4':['comb-saw4.wav'],
            'comb-square1':['comb-square1.wav'],
            'comb-square2':['comb-square2.wav'],
            'comb-square3':['comb-square3.wav'],
            'cosmic-ping-long':['cosmic-ping-long.wav'],
            'cosmic-ping-longdrive':['cosmic-ping-longdrive.wav'],
            'cosmic-ping':['cosmic-ping.wav'],
            'cosmic-ping2':['cosmic-ping2.wav'],
            'crackle':['crackle.wav'],
            'crosstalk':['crosstalk.wav'],
            'diffusor1':['diffusor1.wav'],
            'diffusor2':['diffusor2.wav'],
            'diffusor3':['diffusor3.wav'],
            'diffusor4':['diffusor4.wav'],
            'echo-chamber':['echo-chamber.wav'],
            'feedback-spring':['feedback-spring.wav'],
            'filter-hipass5000':['filter-hipass5000.wav'],
            'filter-lopass160':['filter-lopass160.wav'],
            'filter-midbandpass':['filter-midbandpass.wav'],
            'filter-rhythm1':['filter-rhythm1.wav'],
            'filter-rhythm2':['filter-rhythm2.wav'],
            'filter-rhythm3':['filter-rhythm3.wav'],
            'filter-rhythm4':['filter-rhythm4.wav'],
            'filter-telephone':['filter-telephone.wav'],
            'hihat-rhythm':['hihat-rhythm.wav'],
            'cinema-diningroom':['house/cinema-diningroom.wav'],
            'cinema-hallway':['house/cinema-hallway.wav'],
            'cinema-room':['house/cinema-room.wav'],
            'dining-far-kitchen-leveled':['house/dining-far-kitchen-leveled.wav'],
            'dining-far-kitchen':['house/dining-far-kitchen.wav'],
            'dining-living-true-stereo':['house/dining-living-true-stereo.wav'],
            'dining-living':['house/dining-living.wav'],
            'dining-mid-kitchen':['house/dining-mid-kitchen.wav'],
            'dining-room-true-stereo':['house/dining-room-true-stereo.wav'],
            'dining-room':['house/dining-room.wav'],
            'kitchen-true-stereo':['house/kitchen-true-stereo.wav'],
            'kitchen':['house/kitchen.wav'],
            'living-bathroom-leveled':['house/living-bathroom-leveled.wav'],
            'living-bathroom':['house/living-bathroom.wav'],
            'living-bedroom-leveled':['house/living-bedroom-leveled.wav'],
            'living-bedroom':['house/living-bedroom.wav'],
            'living-kitchen-leveled':['house/living-kitchen-leveled.wav'],
            'living-magnetic':['house/living-magnetic.wav'],
            'impulse-rhythm1':['impulse-rhythm1.wav'],
            'impulse-rhythm2':['impulse-rhythm2.wav'],
            'imp_sequence':['imp_sequence.wav'],
            'matrix-reverb1':['matrix-reverb1.wav'],
            'matrix-reverb2':['matrix-reverb2.wav'],
            'matrix-reverb3':['matrix-reverb3.wav'],
            'matrix-reverb4':['matrix-reverb4.wav'],
            'matrix-reverb5':['matrix-reverb5.wav'],
            'matrix-reverb6':['matrix-reverb6.wav'],
            'matrix6-backwards':['matrix6-backwards.wav'],
            'medium-room1':['medium-room1.wav'],
            'medium-room2':['medium-room2.wav'],
            'noise-spreader1':['noise-spreader1.wav'],
            'peculiar-backwards':['peculiar-backwards.wav'],
            'sifter':['sifter.wav'],
            'smooth-hall':['smooth-hall.wav'],
            'spatialized1':['spatialized1.wav'],
            'spatialized11':['spatialized11.wav'],
            'spatialized15':['spatialized15.wav'],
            'spatialized16':['spatialized16.wav'],
            'spatialized17':['spatialized17.wav'],
            'spatialized2':['spatialized2.wav'],
            'spatialized3':['spatialized3.wav'],
            'spatialized4':['spatialized4.wav'],
            'spatialized5':['spatialized5.wav'],
            'spatialized6':['spatialized6.wav'],
            'spatialized7':['spatialized7.wav'],
            'spatialized8':['spatialized8.wav'],
            'spatialized9':['spatialized9.wav'],
            'spreader10-85ms':['spreader10-85ms.wav'],
            'spreader25-125ms':['spreader25-125ms.wav'],
            'spreader25-55ms':['spreader25-55ms.wav'],
            'spreader25ms':['spreader25ms.wav'],
            'spreader35ms':['spreader35ms.wav'],
            'spreader50-65ms':['spreader50-65ms.wav'],
            'spreader55-75ms':['spreader55-75ms.wav'],
            'spreader55ms-2':['spreader55ms-2.wav'],
            'spreader55ms':['spreader55ms.wav'],
            'wildecho-old':['wildecho-old.wav'],
            'wildecho':['wildecho.wav'],
            'zing-long-stereo':['zing-long-stereo.wav'],
            'zoot':['zoot.wav']
        };
        this.convolver = ctx.createConvolver();
        this.gainMain = ctx.createGain();
        this.gainSend = ctx.createGain();
        this.convolver.connect(this.gainSend);
        this.ctx=ctx;

        this.gainMain.gain.value = 1.0;
        this.gainSend.gain.value = 2.0;

    };
    B.Effect.prototype = {
        connect : function(from,to){
            from.connect(this.gainMain);
            this.gainMain.connect(to);
            from.connect(this.convolver);
            this.gainSend.connect(to);

            this.from=from;
            this.to=to;
            return to;
        },
        disconnect : function(){
            this.from.disconnect();
            this.gainMain.disconnect();
            this.gainSend.disconnect();
        },
        outofconnect:function(){
            this.disconnect();
            this.from.connect(this.to);
        },
        reconnect:function(){
            this.from.disconnect();
            this.connect(this.from,this.to);
        },
        getWavfiles:function(url,func){
            var _t=this;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer'; 
            xhr.onload = function() {
                _t.ctx.decodeAudioData(xhr.response, function(arraybuffer) {
                    func(arraybuffer);
                }, function(e) {
                });
            }
            xhr.send();
        },
        status:"normal",
        setEffect:function(name,func){
            var _t=this;
            if(name=="reset"){
                if(this.status!="reset")
                    _t.convolver.disconnect();
                func && func();
            }else{
                if(this.status=="reset"){
                    this.convolver.connect(this.gainSend);
                    this.status="normal";
                }
                if(typeof(this.Effects[name][0])=='string'){
                    this.getWavfiles(B.options.impulsePath+this.Effects[name][0],function(arraybuffer){
                        _t.Effects[name][0]=arraybuffer;
                        _t.convolver.buffer=arraybuffer;
                        func && func();
                    });
                }else{
                    this.convolver.connect(this.gainSend);
                    this.convolver.buffer=this.Effects[name][0];
                    func && func();
                }
            }
        }
    };

})(window||this,Beats);
 
// Beats 模块 节奏模块 音频的节奏
;(function(e,B,undefined){

    B.Panner = function (ctx) {
        this.panner = ctx.createPanner();
        this.panner.coneOuterGain = 0.1;
        this.panner.coneOuterAngle = 180;
        this.panner.coneInnerAngle = 0;
        ctx.listener.setPosition(0, 0, 0);
    };
    B.Panner.prototype = {
        connect : function(from,to){
            from.connect(this.panner);
            this.panner.connect(to);
            this.from=from;
            this.to=to;
            return to;
        },
        disconnect : function(){
            this.from.disconnect()
            this.panner.disconnect()
        },
        outofconnect:function(){
            this.disconnect();
            this.from.connect(this.to);
        },
        reconnect:function(){
            this.from.disconnect();
            this.connect(this.from,this.to);
        },
    };

})(window||this,Beats);
 
 
(function(global){

})(this.mAudio);
 
    console.log("core part loaded");