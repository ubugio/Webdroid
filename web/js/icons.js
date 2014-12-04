TEMP['icons'] = function(air){
    var icons={
        "device":{
            name:air.Lang.icon_name_device,
            src:"summary_40",
            id:"device"
        },
        "help":{
            name:air.Lang.icon_name_help,
            src:"help_80",
            id:"help"
        },
        "contacts":{
            name:air.Lang.icon_name_contacts,
            src:"contacts_80",
            id:"contacts"
        },
        "sms":{
            name:air.Lang.icon_name_sms,
            src:"messages_80",
            id:"sms",
            click:function(){
                air.require("SmsPhone").openSmsWindow();
            }
        },
        "apps":{
            name:air.Lang.icon_name_apps,
            src:"app_80",
            id:"apps"
        },
        "files":{
            name:air.Lang.icon_name_files,
            src:"file_80",
            id:"files"
        },
        "upload":{
            name:air.Lang.icon_name_upload,
            src:"import_80",
            id:"upload"
        },
        "phones":{
            name:air.Lang.icon_name_phones,
            src:"phone_80",
            id:"phones"
        },
        "musics":{
            name:air.Lang.icon_name_musics,
            src:"music_80",
            id:"musics"
        },
        "images":{
            name:air.Lang.icon_name_images,
            src:"photo_80",
            id:"images"
        },
        "videos":{
            name:air.Lang.icon_name_videos,
            src:"video_80",
            id:"videos"
        },
        "notifies":{
            name:air.Lang.icon_name_notifies,
            src:"notify_80",
            id:"notifies"
        },
        "screenshot":{
            name:air.Lang.icon_name_screenshot,
            src:"screenshot_80",
            id:"screenshot",
            click:function(){
                air.require("ScreenManage").openScreen();
            }
        },
        "terminal":{
            name:air.Lang.icon_name_terminal,
            src:"terminal_80",
            id:"terminal",
            click:function(){
                air.require("runCommond").openTerminal();
            }
        },
        "keyboard":{
            name:air.Lang.icon_name_keyboard,
            src:"keyboard_80",
            id:"keyboard",
            click:function(){
                air.require("keyBoard").openKeyBoard();
            }
        },
        "tasks":{
            name:air.Lang.icon_name_tasks,
            src:"tasks_80",
            id:"tasks",
            click:function(){
                air.require("tasks").openTasksContainer();
            }
        }
    };
    
    return icons;
};