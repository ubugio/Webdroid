<html>
    <head>
		<meta charset='UTF-8'>
        <title>Air</title>
        <style>
        body{
            margin:0;
            font-family: 'Open Sans',tahoma, serif;
        }
        header{
            height: 40px;
            line-height: 40px;
            font-size: 23px;
            background: #B5E3F7;
        }
        .head {
            width: 900px;
            margin: 0 auto;
        }
        ul.nav {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .logo {
            float: left;
            width: 100px;
            text-align: center;
            font-size: 30px;
        }
        li.nav_item {
            float: left;
            width: 107px;
            text-align: center;
            font-size: 16px;
            cursor: pointer;
            transition: all .5s;
        }
        li.nav_item:hover {
            background: #3C9EC2;
            color: #fff;
        }
		.business-card {
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
margin: 20% auto;
height: 250px;
width: 500px;
background: #f12e50;
border-radius: 30px;
box-shadow: 5px 9px 30px #565656;
}
.business-card:before, .business-card:after {
  content: '';
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
}
.business-card:before {
  background: #ee0c4b;
  border-top-right-radius: 30px;
  -webkit-clip-path: polygon(20% 0, 100% 0, 100% 30%, 40% 70%);
          clip-path: polygon(20% 0, 100% 0, 100% 30%, 40% 70%);
}
.business-card:after {
  background: #c80e3d;
  border-bottom-right-radius: 30px;
  -webkit-clip-path: polygon(40% 70%, 100% 30%, 100% 100%, 48.5% 100%);
          clip-path: polygon(40% 70%, 100% 30%, 100% 100%, 48.5% 100%);
}

div {
  z-index: 2;
}

.bc__logo {
  position: absolute;
  top: 10%;
  right: 10%;
}
.bc__logo h2 {
  display: inline-block;
  padding-left: .65em;
  color: white;
  font-size: 2em;
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 50px;margin-top: 0;
  vertical-align: top;
}

.bc__tagline {
  position: absolute;
  bottom: 10%;
  right: 5%;
  color: white;
  line-height: 1.4;
  text-align: right;
}
.bc__qr{
margin: 80px 40px;
}
img {
    position: relative;
    z-index: 9999;
    transition: all .5s;
}
.bc__qr img:hover {
    transform: scale(2);
}
.bc__tagline em {
  font-weight: 600;
  font-style: italic;
}

body {
  background: #111;
  font: 400 .875em 'Helvetica Neue','微软雅黑', 'Roboto Sans', Helvetica, Arial, Sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
            background:#3FBBBB;
}

.credit {
position: absolute;
bottom: 15%;
width: 600px;
left: 50%;
text-indent: 2em;
margin-left: -300px;
color: white;
text-align: left;
}
.credit a {
  color: #ea4c89;
  text-decoration: none;
}
.more {
    text-align: center;
    height: 25px;
    position: absolute;
    bottom: 0;
    width: 100%;
    line-height: 25px;
    border-top: 1px solid #3C9BB2;
    color: #fff;
    cursor: pointer;
    transition: all .5s;
}

.more:hover {
    background: #2EA8A8;
}
.bc__qr button {
    display: block;
    margin: 10px 4px;
    background: none;
    border: 1px solid #FFF;
    color: #fff;
    border-radius: 2px;
    font-size: 16px;
    padding: 3px 13px;
}

.bc__qr button:hover {
    background: rgba(255, 255, 255, 0.49);
}
.alert {
    width: 450px;
    margin: 28px auto;
    background: #41E8E8;
	box-shadow: 0 0 10px #8E8E8E;
    height: 28px;
    line-height: 28px;
    border-left: 4px solid #C23333;
}

.alert span {
    display: inline-block;
    width: 18px;
}
        </style>
    </head>
    <body>
        <header>
            <div class="head">
                <div class="logo">Air</div>
                <div class="navi">
                    <ul class="nav">
                        <li class="nav_item">Web</li>
                        <li class="nav_item">Download</li>
                        <li class="nav_item">Code</li>
                    </ul>
                </div>
            </div>
        </header>
		<div class="alert"><span>●</span>请扫描下面的二维码下载安卓客户端后在手机应用内进行扫描</div>
        <div class='business-card'>
            <div class='bc__qr'>
				<img src="./images/qr_latest.png" width="100" />
				<button>立即下载</button>
			</div>
            <div class='bc__logo'>
		        <h2><img src="./images/logo.png" width="50">WebDroid(Air)</h2>
            </div>
            <div class='bc__tagline'>
                <p>扫描下载手机端软件<em>Air</em><br>打开客户端软件扫码即可管理手机</p>
            </div>
        </div>
    <p class='credit'>
WebDroid(Air) 是一个用浏览器管理(使用)手机的一个解决方案项目。在安装完手机端app后可以直接在浏览器端查看手机信息，管理包括联系人、短信、通话记录、文件、图片、视频、声音还有应用程序。同样也可以收发信息，接打电话，上传文件还有剪贴板管理。    
</p>
<div class="more">More...</div>
    </body>
</html>