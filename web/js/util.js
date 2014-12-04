TEMP['util'] = function(air){
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

    var setLoading = function(tar){
        var l = $('<div class="loading"></div>');
        tar.append(l);
        return l;
    };

    return {
        setLoading:setLoading,
        msformat:msformat,
        sformat:sformat,
        mformat:mformat
    };
};