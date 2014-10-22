TEMP['popup'] = function(air){

    var template = air.require("Templete").popupTemplate;
    var popup=function(option){
        var defaultOptions={
            checkFunction:null,
            cancelFunction:null,
            title:"",
            content:""
        };
        option = $.extend(defaultOptions,option);
        var o={
            text_cancel:air.Lang.text_cancel,
            text_check:air.Lang.text_check,
            TITLE:option.title,
            CONTENT:option.content,
        };
        var tar = $(air.require("UI").substitute(template,o));
        if($(".popup").length>0){
            return false;
        }
        tar.jqDrag(tar.find(".popup-title"));
        air.Options.popupContainer.find(".layout-popup-body").html(tar);
        air.Options.popupContainer.css("display","table").addClass("on");
        tar.find(".popup-button-check").click(function(){
            option.checkFunction && option.checkFunction(tar);
            cancelPopup();
        });
        tar.find(".popup-button-cancel").click(function(){
            option.cancelFunction && option.cancelFunction(tar);
            cancelPopup();
        });
    };
    var cancelPopup=function(){
        air.Options.popupContainer.removeClass("on");
        setTimeout(function(){
            air.Options.popupContainer.css("display","none");
            air.Options.popupContainer.find(".popup").remove();
        },300);
    };
    //----------------------------
    return {
        popup:popup,
        cancelPopup:cancelPopup
    };
};