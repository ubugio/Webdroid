TEMP['keyBoard'] = function(air){
var keyboardMap = {
  "type": "german",
  192: 0,49: 1,50: 2,51: 3,52: 4,53: 5,54: 6,55: 7,56: 8,57: 9,48: 10,
  45: 11,187: 12,8: 13,9: 14,81: 15,87: 16,69: 17,82: 18,84: 19,89: 20,
  85: 21,73: 22,79: 23,80: 24,219: 25,221: 26,220: 27,20: 28,65: 29,83: 30,
  68: 31,70: 32,71: 33,72: 34,74: 35,75: 36,76: 37,186: 38,222: 39,13: 41,
  16: 42,90: 43,88: 44,67: 45,86: 46,66: 47,78: 48,77: 49,188: 50,
  190: 51,191: 52,16: 53,17: 55,18: 57,91: 56,32: 58,17: 60,18: 59,37: 61,
  38: 62,40: 63,39: 64,
  60: 42,44: 50,223: 11,46: 53,63: 11//,43: 26
}

var keyboardKeys = {
  "type": "german",
  0: ["~","`"],1: ["!","1"],2: ["@","2"],3: ["#","3"],4: ["$","4"],
  5: ["%","5"],6: ["^","6"],7: ["&","7"],8: ["*","8"],9: ["(","9"],10: [")","0"],
  11: ["_","-"],12: ["+","="],13: ["&larr;"],14: ["&#x21e5;"],15: ["Q"],16: ["W"],
  17: ["E"],18: ["R"],19: ["T"],20: ["Y"],21: ["U"],22: ["I"],23: ["O"],24: ["P"],
  25: ["{","["],26: ["}","]"],27: ["|","\\"],28: ["&#x21ea;"],29: ["A"],30: ["S"],
  31: ["D"],32: ["F"],33: ["G"],34: ["H"],35: ["J"],36: ["K"],37: ["L"],
  38: [":",";"],39: ['"',"'"],41: ["&#x21a9;"],42: ["&#x21e7;"],43: ["Z"],
  44: ["X"],45: ["C"],46: ["V"],47: ["B"],48: ["N"],49: ["M"],50: ["<",","],
  51: [">","."],52: ["?","/"],53: ["&#x21e7;"],54: ["fn"],55: ["ctrl"],
  56: ["cmd"],57: ["alt"],59: ["alt"],60: ["ctrl"],61: ["&#9664;"],62: ["&#9650;"],
  63: ["&#9660;"],64: ["&#9658;"]
}
var inputMode = "text";
//=========================================================================
var canInput=true;
var prepareBoard = function(){
  $(".keyboard-wrapper ul li").each(function(i){
    if(keyboardKeys[i]){
      if(keyboardKeys[i].length > 1){
        var string = "";
        if(i==58 || i==59){
          for(var j=0;j<keyboardKeys[i].length;j++){
            string += keyboardKeys[i][j]+"&nbsp; &nbsp; &nbsp;";
          }
          $(".text", this).html(string).css("width","55px").css("margin-left","2px").css("margin-top","23px");
        }
        else{
          for(var j=0;j<keyboardKeys[i].length;j++){
            string += keyboardKeys[i][j]+"<br>";
          }
          $(".text", this).html(string); 
        }
      }else{
        $(".text", this).html(keyboardKeys[i][0]).css("margin-top","13px"); 
      }
      if(i >= 61){
        $(".text", this).css("margin-top","1px");
      }
    }
  });
};
var keyPressHandle= function(e){
    if(!$(".keyboard-screen input").is(":focus")){
        $(".keyboard-screen input").focus();
    }
    if(e.keyCode == 60 || e.keyCode == 44 || e.keyCode == 45 || e.keyCode == 223 || e.keyCode == 63 || e.keyCode == 43){
      keyDownAni(keyboardMap[e.keyCode],e);
    }
    if(!canInput){
      e.preventDefault();
    }
  };
var keyDownHandle = function(e){
    console.log(e.keyCode);
    if(e.keyCode == 8 || e.keyCode == 9){
      if(!canInput){
        e.preventDefault();
      }
    }
    setTimeout(function(){
      if(e.shiftKey && e.keyCode == 16){
      var loc = e.location;
      if(loc == 1){
        //left
        keyDownAni(42,e);
      }
      else if(loc == 2){
        //right
        keyDownAni(53,e);
      }
    }
    else if(e.ctrlKey && e.keyCode == 17){
      if(e.location == 1){
        //left
        keyDownAni(55,e);
      }
      else if(e.location == 2){
        //right
        keyDownAni(60,e);
      }
    }
    else if(e.altKey && e.keyCode == 18){
      if(e.location == 1){
        //left
        keyDownAni(57,e);
      }
      else if(e.location == 2){
        //left
        keyDownAni(59,e);
      }
    }
    //else if(e.keyCode == 187 || e.keyCode == 188 || e.keyCode == 189 || e.keycode == 191){
      
    //}
    else{
      keyDownAni(keyboardMap[e.keyCode],e);
    }
    },10);
  };
var bindEvents = function(){
  document.addEventListener("keypress",keyPressHandle);
  document.addEventListener("keydown",keyDownHandle);
};
var removeEvents = function(){
  document.removeEventListener("keypress",keyPressHandle);
  document.removeEventListener("keydown",keyDownHandle);
};

function keyDownAni(eq,e){
  sendKey(eq);
  var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  var uid = randLetter + Date.now();
  var sk = isCapslock(e);
  if(sk){
    $(".keyboard-wrapper ul li").eq(eq).children(".text").toggleClass("active");
  }else{
    $(".keyboard-wrapper ul li").eq(eq).children(".text").toggleClass("active");
  }
  $(".keyboard-wrapper ul li").eq(eq).addClass("activeKey");
  $(".keyboard-wrapper ul li").eq(eq).attr("id",uid);
  $("#"+uid+" .finger").animate({
    opacity: 1,
    width: "30px",
    height: "30px",
    top: "0px",
    left: "0px"
  },300, function(){ 
    $("#"+uid+" .finger").animate({
      opacity: 0,
      width: "40px",
      height: "40px",
      top: "-5px",
      left: "-5px"
    },300,function(){
      $("#"+uid+" .finger").eq(eq).removeClass("activeKey");
    });
  });
}

function isCapslock(e){
    e = (e) ? e : window.event;
    var charCode = false;
    if (e.which) {
        charCode = e.which;
    } else if (e.keyCode) {
        charCode = e.keyCode;
    }
    var shifton = false;
    if (e.shiftKey) {
        shifton = e.shiftKey;
    } else if (e.modifiers) {
        shifton = !!(e.modifiers & 4);
    }
    if (charCode >= 97 && charCode <= 122 && shifton) {
        return true;
    }
    if (charCode >= 65 && charCode <= 90 && !shifton) {
        return true;
    }
    return false;
}
var sendKey=function(t){
    if(inputMode=="text"){
        t = keyboardKeys[t][keyboardKeys[t].length-1];
        air.require("runCommond").text(t,function(data){
            console.log(data);
        });
    }else if(inputMode=="text"){
        air.require("runCommond").button(t,function(data){
            console.log(data);
        });
    }else{
        console.log("opps . !");
    }
    return false;
};
//-------------------------------------------------------
var KeyBoardWindow = null;
var openKeyBoard = function(){
    if(KeyBoardWindow!=null)return false;
    KeyBoardWindow = air.require("UI").openWindow({
        title:air.Lang.icon_name_keyboard,
        iconSrc:air.Options.iconPath+"keyboard_80.png",
        width:800,
        height:335,
        zIndex:99999,
        fixZindex:true,
        onClose:function(){
            removeKeyBoard();
        },
        id:"keyboard",
        draggable:true,
        handles:false
    });
    air.require("Templete").getTemplate("window-keyBoard",function(temp){
        air.require("initAir").setStyle(air.Options.themePath+"window-keyBoard.css","window-keyBoard");
        KeyBoardWindow.setContent(temp);
        prepareBoard();
        bindEvents();
    });
    
};
var removeKeyBoard = function(){
    KeyBoardWindow.remove();KeyBoardWindow=null;removeEvents();
};
//-------------------------------------------
    return {
        openKeyBoard:openKeyBoard,
    };
};