TEMP['search'] = function(air){
    /*
     * input 输入框获取搜索关键词
     * parent 搜索范围
     * find 搜索目标体（搜索范围内可以被隐藏的整体）
     * text 搜索目标的文字位置，可以是某个span可以是数组
    */
    //var onSearch = function(input,parent,find,text,before,after,ifempty){
    var onSearch = function(option){
        var options = {
            inputBox:null,
            container:null,
            item:null,
            text:null,
            before:null,
            ifempty:null,
            after:null
        };
        $.extend(options,option);
        options.inputBox.keyup(function(){
            options.before && options.before();
            var s = options.inputBox.val(),l = s.length;
            options.container.find(options.item).each(function(){
                var flag = false,_t = $(this);
                if(typeof(options.text)=="string"){
                    flag = mark(_t.find(options.text),s);
                }else{
                    for(var k in options.text){
                        var t = mark(_t.find(options.text[k]),s);
                        flag = flag?flag:t;
                    }
                }
                if(flag)
                    $(this).show();
                else
                    $(this).hide();
            });
            if(options.container.find(options.item+":visible").length==0){
                options.ifempty && options.ifempty();
            }
            options.after && options.after();
        });
    };
    var mark = function(tar,s){
        var txt = tar.text();
        var index = txt.indexOf(s);
        if(index>-1){
            tar.html(txt.replace(s,'<i class="mark">'+s+'</i>'));
            return true;
        }else
            return false;
    };
    //================
    return {
        onSearch:onSearch
    };
};