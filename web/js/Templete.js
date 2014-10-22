TEMP['Templete'] = function(air){
    var templatePath = air.Options.templatePath;
    var templates={};
    
    var getTemplate=function(name,func){
            if(templates[name]){
                func(templates[name]);
                return;
            }
            var _t=this;
            $.ajax({
                url:templatePath+name+".html",
                type:"get",
                async:false,
                dataType:"text",
                cache:false,
                success:function(html){
                    templates[name]=html;
                    func(html);
                },
                error:function(e,t){
                    console.log(e);
                    Air.LOG("Air.getMoudle",t);
                }
            });
        };
        
        
    return {
        templates:templates,
        getTemplate:getTemplate,
        iconTemplate :  '<div class="icon" data-index="{INDEX}" id="icon-{ID}">'+
                            '<img class="icon-img" src="{imgSRC}" />'+
                            '<span class="icon-title">{TITLE}</span><div></div>'+
                        '</div>',
    windowTemplate : '<div class="window data-index="{INDEX}" hardwareSpeed ui-resizable ui-draggable" app="{ID}" max="false" mw="200" mh="300" style="position: absolute; width: {WIDTH}px; height: {HEIGHT}px; left: 40px; top: 7px; display: block; z-index: {zIndex};">'+
                        '<div class="window_outer">'+
                            '<div class="window_inner">'+
                                '<div class="window_bg_container is-hide"></div>'+
                                '<div class="window_content">'+
                                    '<div class="window_titleBar">'+
                                        '<div class="window_toolButtonBar is-hide">[ Edit ]</div>'+
                                        '<div class="window_titleButtonBar">'+
                                            '<a class="i window_action_button window_close"></a>'+
                                            '<a class="i window_action_button window_min"></a>'+
                                            '<a class="i window_action_button window_max"></a>'+
                                            '<a class="i window_action_button window_setting is-hide" style="display: none;"></a>'+
                                        '</div>'+
                                        '<div class="window_title titleText">'+
                                            '<img class="window_icon" valign="middle" src="{appIcon}">'+
                                            '<span class="window_title_text over-ellipsis">{appTitle}</span>'+
                                            '<span class="window_title_des"></span>'+
                                        '</div>'+
                                        '<div class="window_title_params is-hide">'+

                                        '</div>'+
                                    '</div>'+
                                    '<div class="window_bodyOuter">'+
                                        '<div class="window_bodyArea">'+
                                            '<div class="content_area" style="height:{CONTENT_HEIGHT}px;">{appContent}</div>'+
                                        '</div>'+
                                    '</div>'+              
                                '</div>'+
                                '<div class="window_resize_l ui-resizable-handle ui-resizable-w"></div>'+
                                '<div class="window_resize_r ui-resizable-handle ui-resizable-e"></div>'+
                                '<div class="window_resize_t ui-resizable-handle ui-resizable-n"></div>'+
                                '<div class="window_resize_b ui-resizable-handle ui-resizable-s"></div>'+
                                '<div class="window_resize_lt ui-resizable-handle ui-resizable-nw"></div>'+
                                '<div class="window_resize_lb ui-resizable-handle ui-resizable-sw"></div>'+
                                '<div class="window_resize_rt ui-resizable-handle ui-resizable-ne"></div>'+
                                '<div class="window_resize_rb ui-resizable-handle ui-resizable-se"></div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="window_switch_mask"></div>'+
                    '</div>',
        tabTemplate :   '<div class="tab" data-index="{INDEX}" id="tab-{ID}">'+
                            '<img class="tab-img" src="{imgSRC}" />'+
                            '<span class="tab-title">{TITLE}</span>'+
                        '</div>',
        contacts:'<div class="window-contact-detail-ItemCon">'
                        +'<div class="window-contact-detail-itemLabel i-float-left">手机</div>'
                        +'<div class="window-contact-detail-itemName i-float-left phone">{phone}</div>'
                        +'<div class="window-contact-detail-itemOp">'
                            +'<span class="i-cursor-hand window-contact-detail-chat">'
                                +'<i class="icon-chat" title="发送消息"></i>发送消息'
                            +'</span>'
                            +'<span class="i-cursor-hand window-contact-detail-call">'
                                +'<i class="ml6 icon-calllog" title="呼叫"></i>呼叫'
                            +'</span>'
                        +'</div>'
                    +'</div>',
        playerTemplate:'<canvas width="300" height="200" class="music"></canvas>'+
                        '<p class="window-music-player-title">{TITLE}</p>'+
                        '<div class="window-music-player-panel">'+
                            '<div class="player-status player-play"><span class="play"></span><span class="pause"></span></div>'+
                            '<div class="player-progress"><span class="player-duration"></span><span class="player-played"></span></div>'+
                            '<div class="player-time"><span class="player-now">--:--</span> / <span class="player-total">--:--</span></div>'+
                            '<div class="player-volume">Vol<span class="player-volnow"></span><span class="player-fullvol"></span><i></i></div>'+
                        '</div>',
        notifyLocalTemplate:'<div class="notify notify-{ID}">'+
                                '<div class="notify-icon">{IMG}</div>'+
                                '<div class="notify-body">'+
                                    '<div class="notify-title">{TITLE}</div>'+
                                    '<div class="notify-text">{TEXT}</div>'+
                                '</div>'+
                            '</div>',
        notifyWindowTemplate:'<div class="notify-clear">{text_clear}</div><div class="notify-items">{List}</div>',
        popupTemplate:'<div class="popup popup-{ID}">'+
                                '<div class="popup-title">{TITLE}</div>'+
                                '<div class="popup-body">{CONTENT}</div>'+
                                '<div class="popup-handle">'+
                                    '<div class="popup-button-check">{text_check}</div>'+
                                    '<div class="popup-button-cancel">{text_cancel}</div>'+
                                '</div>'+
                            '</div>',
        initSystemTemplate:'<div>'+
                                '<p>{text_initSystemDesc}</p>'+
                                '<div><span style="display: inline-block;width: 125px;text-align: right;">{text_initSystemIp}</span><input type="text" class="input-ip" value="{IP}" /><br />'+
                                '<span style="display: inline-block;width: 125px;text-align: right;">{text_initSystemPort}</span><input type="text" class="input-port" value="{PORT}" /><br />'+
                                '<span style="display: inline-block;width: 125px;text-align: right;">{text_initSystemSocketPort}</span><input type="text" class="input-socketPort" value="{SOCKET}" /><br /></div>'+
                            '</div>',
        callingTemplate:'<div class="phone-panel">'+
                            '<img src="{HEAD}" />'+
                            '<p style="display:none;" class="phone-counter"></p>'+
                            '<p class="phone-name">{NAME}</p>'+
                            '<p class="phone-number">{NUMBER}</p>'+
                            '<div class="phone-buttons">'+
                                '<div class="phone-answer {INCOMING}">{ANWSER}</div>'+
                                '<div class="phone-reject {INCOMING}">{REJECT}</div>'+
                                '<div class="phone-reject-message {INCOMING}">{REJECT_WITH_MESSAGE}</div>'+
                            '</div>'+
                        '</div>',
        dialPanelTemplate:'<div class="dial-panel">'+
                            '<div class="dial-panel-num-input">'+
                                '<input type="text" class="dial-panel-input">'+
                                '<div class="dial-panel-delete">←</div>'+
                            '</div>'+
                            '<div class="dial-panel-num-buttons">'+
                                '<div class="dial-panel-num-1">1</div>'+
                                '<div class="dial-panel-num-2">2</div>'+
                                '<div class="dial-panel-num-3">3</div>'+
                                '<div class="dial-panel-num-4">4</div>'+
                                '<div class="dial-panel-num-5">5</div>'+
                                '<div class="dial-panel-num-6">6</div>'+
                                '<div class="dial-panel-num-7">7</div>'+
                                '<div class="dial-panel-num-8">8</div>'+
                                '<div class="dial-panel-num-9">9</div>'+
                                '<div class="dial-panel-num-x">*</div>'+
                                '<div class="dial-panel-num-0">0</div>'+
                                '<div class="dial-panel-num-j">#</div>'+
                            '</div>'+
                            '<div class="dial-panel-operate">'+
                                '<div class="dial-panel-call">{CALL}</div>'+
                                '<div class="dial-panel-message">{MESSAGE}</div>'+
                            '</div>'+
                        '</div>',
    };
};