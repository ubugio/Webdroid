TEMP['uploader'] = function(air){
    var defaultpath="http://"+air.Options.ip+':'+air.Options.port+"/?mode=upload&action=file&path=";
    
    var uploadFile = function(url,f,progressHandlingFunction,successHandler,errorHandler,completeHandler){
        var formData = new FormData();
        formData.append('FileData', f);
        console.log(defaultpath);
        var path = url!="default"?url:(defaultpath + air.Options.uploadPath +"/" + encodeURIComponent(f.name));
        $.ajax({
            url: path,  //server script to process data
            type: 'POST',
            xhr: function() {
                myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){
                    myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // for handling the progress of the upload
                }
                return myXhr;
            },
            success: successHandler,
            error: errorHandler,
            complete:completeHandler,
            data: formData,
            cache: false,
            contentType: false,
            processData: false
        });
    };
    
    
    
    return {
        uploadFile:uploadFile
    };
};