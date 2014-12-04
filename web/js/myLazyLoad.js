TEMP['myLazyLoad'] = function (air) {
    
    //tar,img,src,src
    var lazyLoad = function(tar,img,data_handle,tar_handle){
        tar.scroll(function(){
            tar.find(img).each(function(){
                if(isSeeable(tar,$(this))){
                    if($(this).attr(tar_handle)==""){
                        console.log("a");
                        $(this).attr(tar_handle,$(this).data(data_handle));
                    }
                }
            });
        }).scroll();
    };
    
    var isSeeable = function(tar1,tar2){
        var pos = tar1.offset();
        var w1 = tar1.width();
        var h1 = tar1.height();
        var pos2 = tar2.offset();
        var w2 = tar2.width();
        var h2 = tar2.height();
        return Math.abs((pos.left+w1/2)-(pos2.left+w2/2))<(w1+w2)/2 && Math.abs((pos.top+h1/2)-(pos2.top+h2/2))<(h1+h2)/2;
    };
    
    
    
    
    
//-------------------------------------------------------
    
    return {
        lazyLoad:lazyLoad
    };
};