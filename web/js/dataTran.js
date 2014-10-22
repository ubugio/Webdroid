TEMP['dataTran'] = function(air){
    var getJson = function(data,success,error,complete){
        var error = error||function(){};
        $.ajax({
            url:"http://" + air.Options.ip+":"+air.Options.port,
            type:"get",
            dataType:"json",
            data:data,
            success:success,
            error:error,
            complete:complete
        });
    };
    
    
    
    return {
        getJson:getJson
    };
};