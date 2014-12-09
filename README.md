# WebDroid
---

## I-ntroduce

WebDroid is a solution for manage/use android phone with browser. After installed the app in the phone, You can collect phone info, manage contacts,sms,call log,files,images,videos,sounds,apps . Also send&receive sms and call&answer calls and upload files , update clipboard.

WebDroid(Air) 是一个用浏览器管理(使用)手机的一个解决方案项目。在安装完手机端app后可以直接在浏览器端查看手机信息，管理包括联系人、短信、通话记录、文件、图片、视频、声音还有应用程序。同样也可以收发信息，接打电话，上传文件还有剪贴板管理。

## S-tatus

This project is marked as `dev`,lots of ideas has not been applied in the codes,and some functions is not completed ,bug are everywhere . But I will continue coding  as long as I'm using it.

项目目前是开发状态，很多想法没有实现，很多代码还没有完成，还有很多bug，但是只要我爱有这个需求，我就会一直编码。

## O-ther

This roject is not prefect yet, but it's a great idea,I'm glad to hear your voice to moving on .

项目可能目前还不是很完美，但是想法真的很不错，如果你有些想法，联系我。

---
## *C-hange Log

`14/12/4`:

1. I'm a really lazy people who is not good at change log updates , but I have a record list with my development .
1. The record list is down after this.
1. 真的是有点懒的更新这里的更新列表，但是还好开发日志会写点；
1. 开发日志已经放到了下面；

`14/10/22`:

1. move project to the github after basic functions were completed.
1. Update the first stable release and dev release.

## *D-evelopment record

<span>九月20-26</span>
<p>开始状态：虽然对前端开发挺专业，但是手机android和java的编程从没接触过，更不用说复杂的功能实现了。</p>
<p>萌生想法，艰难写出能获取信息的安卓端app demo，并成功显示在手机端</p>
<span>九月27-28日</span>
<p>查找资料，根据socket编写简单http服务器，信息从安卓端到浏览器的传递实现</p>
<span>九月29日</span>
<p>浏览器端架构架设和素材整理，状态栏信息轮询获取</p>
<span>九月30日</span>
<p>图标系统，窗口系统，设备信息和联系人模块</p>
<span>10月01日</span>
<p>拖动模块，文件管理，应用管理模块</p>
<span>10月02日</span>
<p>上传文件出问题，查找资料，更换http服务器为nanoHTTPD类</p>
<span>10月03日</span>
<p>重新整理服务器返回，文件上传模块</p>
<span>10月04日</span>
<p>通话记录模块，音频列表及播放模块</p>
<span>10月05-06日</span>
<p>图片，视频扫描播放模块，短信模块</p>
<span>10月07日</span>
<p>基于nanohttpd的websocket模块集成</p>
<span>10月08日</span>
<p>安卓自定义通知中心，服务模式</p>
<span>10月09日</span>
<p>集成通知中心信息到ws并架构桌面通知系统</p>
<span>10月10日</span>
<p>status推送和notify推送机制，本地通知桌面通知模块，消息中心app</p>
<span>10月11日</span>
<p>弹窗模块，初始端口设置，http，socket连接重连机制，剪贴板互传功能</p>
<span>10月12日</span>
<p>文件树模块，文件浏览和文件上传路径选择，短信发送功能</p>
<span>10月13日</span>
<p>短信发送对应状态监控，短信接收状态监测，通话状态监测</p>
<span>10月14日</span>
<p>手机刷成4.4系统，將手机端json输出程序整理</p>
<span>10月15日</span>
<p>浏览器端电话状态UI</p>
<span>10月16日</span>
<p>通知中心优化，电话状态UI补充(Play Games ~T^T~)</p>
<span>10月17日</span>
<p>图标位置优化，图标拖动排序，toast提示功能</p>
<span>10月18日</span>
<p>socket失联提示，短信接收完整功能，配置本地化保存</p>
<span>10月19日</span>
<p>玩游戏，T^T</p>
<span>10月20日</span>
<p>电话拨打功能</p>
<span>10月21日</span>
<p>尝试电话接听和挂断，失败</p>
<span>10月22日</span>
<p>项目整合，提交到GitHub，并分离开发版本</p>
<span>10月23日</span>
<p>联系人、通话记录呼叫当前电话功能,修复特殊窗体置顶点击问题</p>
<span>10月24日</span>
<p>XXXXX</p>
<span>10月25日</span>
<p>开通sae的“http://droid4web.sinaapp.com/”作为项目远程中继服务器;IP地址远程同步，避免每次都要核实IP然后再输入;dataTran优化;</p>
<span>10月28日</span>
<p>只能实现ROOT下截屏</p>
<span>10月29日</span>
<p>ROOT下截屏app，客户端截屏实现及几个功能</p>
<span>10月30日</span>
<p>初步尝试shell 命令操作，实现按键点击，整理几个小想法</p>
<span>10月31日</span>
<p>实现屏幕点击功能</p>
<span>11月1日</span>
<p>命令和键盘应用，键盘布局以及功能实现</p>
<span>11月2日</span>
<p>shell模式整理优化</p>
<span>11月3日</span>
<p>shell模式整理优化，命令app功能更强大</p>
<span>11月22日</span>
<p>由于其他项目耽搁，多次暂停开发，现在恢复。</p>
<p>修改：查找资料，將shell功能重构，重新整合各个涉及命令的模块。</p>
<p>修改：屏幕管理模块，添加滑动功能，將滑动和点击功能重构，更有效发送动作。</p>
<p>修改：屏幕管理模块UI整理，添加canvas可视化鼠标交互操作。</p>
<p>修改：窗口弹出动画重构。</p>
<p>优化：添加util模块，迁移常用工具方法。</p>
<p>*优化：添加lazyLoad模块，统一整合各个模块的图片按需加载。</p>
<p>增加：添加任务管理器app，查看任务，活动和进程，可以kill进程。</p>
<span>11月23日</span>
<p>顶部工具栏添加，新建电话和链接url实现。</p>
<p>新建信息实现。</p>
<span>11月24日</span>
<p>为实现新建联系人app端新添接口。</p>
<span>11月25日</span>
<p>优化登陆流程，考虑多人自动登录，初步接触二维码扫描。</p>
<p>服务器接口优化，为登陆模块服务端以及以后的网站上线准备。</p>
<p>了解到Sae的Channel服务，类似于WebSocket的解决方案。</p>
<p>梳理二维码扫描登录的过程，初步搜索ZXing二维码解决方案。</p>
<span>11月26日</span>
<p>成功实现手机端二维码模块的加入，可以成功扫描结果。</p>
<p>解决示例代码预览界面的变形和结果处理（todo 无用代码的剔除）。</p>
<p>调整整个登录过程，考虑多用户登录，账户数据库系统，临时账户系统；</p>
<p>登录获取，输入获取，扫码二维码获取ip的整合。</p>
<span>11月27日</span>
<p>再次考虑并调整界面顺序，加入多选择界面。</p>
<p>账户系统初步考虑，测试使用Sae的Channel系统，出现问题Ws不能使用。</p>
<p>Channel系统的WS放弃，使用ajax轮询先设计出来了扫码登录功能。</p>
<span>11月28日</span>
<p>將轮训的方式搬上系统测试，成功实现扫码登录。</p>
<span>11月29日</span>
<p>使用官方sae的channel降级到xhr-stream长连接，测试没问题。</p>
<p>將系统轮询替换成长连接，并重新制作了登录UI和流程。</p>
<p>登陆逻辑区分，分为密码key登录，扫码登录两个依赖网络不用直接输入ip地址的方式；</p>
<p>再加上一个直接输入ip和端口的手动连接方式；</p>
<p>修改app端代码适应这种登陆逻辑；</p>
<span>11月30日</span>
<p>新建短信，重新调整短信app的逻辑，放到了smsPhone；</p>
<p>添加了新建信息功能和模块调用接口，整合其它部分的调用方式；</p>
<span>12月02日</span>
<p>顶部栏搜索功能添加豌豆荚在线app；</p>
<p>测试將搜索结果直接显示，失败；</p>
<span>12月03日</span>
<p>修复小bug；</p>
<p>调整系统初始化流程將联系人和app数据在初始化时引入；</p>
<span>12月04日</span>
<p>顶部栏搜索功能添加豌豆荚在线app；</p>
<p>加入联系人和app数据；</p>
<span>12月05日</span>
<p>扫码准备重构，浏览器扫描直接跳转到固定客户端下载网站；</p>
<p>实时截图调整压缩，將png换为jpeg，发现影响连续截图频率的不是图片大小,wifi互联的情况下，700k的文件和70k的文件传输差的时间并不足以影响视觉；</p>
<span>12月06日</span>
<p>联系人搜索调整，添加app搜索功能；</p>
<p>添加了新建信息功能和模块调用接口，整合其它部分的调用方式；</p>
<span>12月07日</span>
<p>+++++++++++++++++++++++++++++；</p>
<p>+++++++++++++++++++++++++++++；</p>
<span>12月08日</span>
<p>浏览器的通知中心的点击事件可以直接跳转到通知的intent；</p>
<p>需要改进，intent不经过点击触发而没有被删除，还有同一个package的通知不能区分；</p>
<span>12月09日</span>
<p>顶部的input可以伸长；</p>
<p>短信通知中心收到点击打开短信app；</p>
<p>短信的通知中心没有注册的bug；</p>
<p>手机端客户端连接数实现，并可以及时删除；</p>
<p>接通电话，挂断电话完美实现（很巧妙的方法：通过模拟按键，5，6分别代表着接听键和挂断键，于是发送一个adbshell命令模拟下即可）；</p>
<p>將状态推送由之前的信号和电量拓展到网络状态和wifi信号的改变；</p>
<p>鉴于手机状态的推送已经很完善了，去除heartBeat的心跳而仅用websocket保持与手机的链接；</p>
<p>浏览器端接听挂断电话实现，剩下的就是传输音频（重难点）；</p>
<p>--很意外的发现sae的websocket可以实现了，太赞了，可以考虑数据转发和sea.js的去除；</p>
<p>出现问题，ws首次connect没有数据传过来，app定义方法，首次连接或者当客户端发送请求时直接返回状态信息；</p>

<br/>

<hr/>
<h1>TODO</h1>
<hr/>
<p>20. 设置界面</p>
<p>21. 最大化功能</p>
<p>* 23. 联系人的快模块搜索功能，需要用在短信联系人输入，拨号盘联系人输入，顶部搜索功能，其他涉及到联系人的地方</p>
<p>25. 短信接收的多短信接收问题</p>
<p>26. 窗口位置问题</p>
<p>28. 新建联系人</p>
<p>5. 软件的安装卸载</p>
<p class="lot">6. 文件，图片，视频，音乐的上传按钮，删除操作</p>
<p class="lot">7. 软件列表的下载功能</p>
<p>===============================</p>
<p>17. 手机端发送短信不会更新到电脑端</p>
<p class="hard">1. 摄像和<del>屏幕录制</del>功能！！！</p>
<p>13. 第三方服务器转发流量</p>
<p class="hard">12. 手机定位</p>
<p class="hard">11. 电话声音流传输</p>
<p>===============================</p>
<p><del>27. 多用户(考虑账号系统)</del></p>
<p><del>29. 去除heartBeat</del></p>
<p><del>24. 顶部搜索可以下拉选择：APP，联系人，短信，软件等</del></p>
<p class="lot"><del>4. 各个模块的搜索功能</del></p>
<p><del>22. app市场功能，通过豌豆荚的接口</del></p>
<p><del>16. 新建信息</del></p>
<p><del>19. 顶部工具栏（可以拖动变形到右侧）</del></p>
<p><del>15. 电话的接听和挂断</del></p>
<p><del>14. 图片的onError处理</del></p>
<p><del>2. 拨号盘功能</del></p>
<p><del>3. 电话状态检测</del></p>
<p><del>8. 桌面图标拖动逻辑</del></p>
<p><del>9. 短信接收更新</del></p>
<p><del>10. 短信文字计数</del></p>
<p><del>18. chimpchat.jar模拟按键点击拖动https://github.com/rzoller/android-webscreen</del></p>