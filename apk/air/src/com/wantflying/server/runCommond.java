package com.wantflying.server;


public class runCommond {
	private ShellUtil mshell;
	public runCommond(ShellUtil shell){
		mshell = shell;
	}
	public final String exec(String cmd) {
		return mshell.runShell(cmd,false,true,"/");
	}
	// 模拟按键和点击事件
	public final String simulateKey(int keyCode) {
		return exec("input keyevent " + keyCode);
	}
	public final String simulateTouch(int x,int y) {
		return exec("input tap " + x +" " +y);
	}
	public final String simulateSwap(int x,int y,int x2,int y2) {
		return exec("input swipe " + x +" " + y +" "+ x2 +" " +y2);
	}
	public final String simulateText(String txt) {
		return exec("input text " + txt);
	}
	// 设备操作
	public final String reboot() {
		return exec("reboot");
	}
	public final String shutdown() {
		return exec("reboot -p");
	}
	public final String Close3g() {
		return exec("svc data disable");
	}
	public final String Open3g() {
		return exec("svc data enable");
	}
	public final String CloseWifi() {
		return exec("svc wifi  disable");
	}
	public final String OpenWifi() {
		return exec("svc wifi  enable");
	}
	public final String OpenUrl(String url) {
		return exec("am start -a android.intent.action.VIEW -d "+url);
	}
	 
	
	
}