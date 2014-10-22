TEMP['pathTree'] = function(air){
    var begin = {
        sdcard:"/sdcard",
        root:"/"
    };
    var setting = {
        data: {
            key: {
                title: "id"
            }				
        },
        async: {
            enable: true,
            dataFilter: filter
        }
    };

    function filter(treeId, parentNode, childNodes) {
        if (!childNodes) return null;
        for (var i=0, l=childNodes.length; i<l; i++) {
            childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
        }
        return childNodes;
    }

    //----------------------------
    var pathTree = function(option){
        var defaultOption={
            tar:null,
            ready:null,
            beforeLoad:null,
            beginWith:['sdcard'],
            click:null
        };
        
        option=$.extend(defaultOption,option);
        for(var i=0,l=option.beginWith.length;i<l;i++){
            var tree = $('<ul class="ztree pathTree"></ul>');
            option.tar.append(tree);
            var set = {};
            $.extend(true,set,setting.async,{
                enable: true,
                url:'http://'+air.Options.ip+':'+air.Options.port+'/',
                autoParam:["id=path", "name=n", "level=lv"],
                otherParam:{"mode":"device","action":"fileList","beginPath":option.beginWith[i],},
                dataFilter: filter
            });
            $.fn.zTree.init(tree, {callback:{onClick:option.click,beforeAsync:option.beforeLoad,onAsyncSuccess:option.ready},async:set});
        }
    };
    //----------------------------
    return {
        pathTree:pathTree
    };
};