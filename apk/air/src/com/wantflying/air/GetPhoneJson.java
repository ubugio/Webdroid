package com.wantflying.air;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;

import com.wantflying.server.NanoServer;

public class GetPhoneJson {
	public Context mcontext;
	public GetPhoneJson(Context pcontext){
		mcontext = pcontext;
		registerSmsReceiver(mcontext);
		registerPhoneReceiver(mcontext);
	}
	private void registerSmsReceiver(Context mcontext){
		SmsReceiver smsRcvr = new SmsReceiver();
	    IntentFilter batteryLevelFilter = new IntentFilter("android.provider.Telephony.SMS_RECEIVED");
	    mcontext.registerReceiver(smsRcvr, batteryLevelFilter);
	}
	private void registerPhoneReceiver(Context mcontext){
		PhoneReceiver phoneRcvr = new PhoneReceiver();
	    IntentFilter batteryLevelFilter = new IntentFilter(Intent.ACTION_CALL);
	    mcontext.registerReceiver(phoneRcvr,batteryLevelFilter);
	}
	public String callNum(String num){
		if(num.trim().length()!=0){ 
        	Intent phoneIntent = new Intent("android.intent.action.CALL",Uri.parse("tel:" + num));
        	phoneIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        	mcontext.startActivity(phoneIntent);
        }
		return "{\"status\":\"ok\"}";
	}
    // 表现很完美
    public static void answserCall(){
    	NanoServer.cmd.simulateKey(5);
    }
    public static void endCall(){
    	NanoServer.cmd.simulateKey(6);
    }

}