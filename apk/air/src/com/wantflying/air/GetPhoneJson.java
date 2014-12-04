package com.wantflying.air;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;

public class GetPhoneJson {
	public PhoneReceiver phoneRcvr;
	public Context mcontext;
	public GetPhoneJson(Context pcontext){
		//registerSmsReceiver(mcontext);
		mcontext = pcontext;
		registerPhoneReceiver(mcontext);
	}
	@SuppressWarnings("unused")
	private void registerSmsReceiver(Context mcontext){
		SmsReceiver smsRcvr = new SmsReceiver();
	    IntentFilter batteryLevelFilter = new IntentFilter(Intent.ACTION_CALL);
	    mcontext.registerReceiver(smsRcvr, batteryLevelFilter);
	}


	private void registerPhoneReceiver(Context mcontext){
		phoneRcvr = new PhoneReceiver();
	    IntentFilter batteryLevelFilter = new IntentFilter(Intent.ACTION_CALL);
	    mcontext.registerReceiver(phoneRcvr,batteryLevelFilter);
	}
	public String callNum(String num){
		if(num.trim().length()!=0){ 
         Intent phoneIntent = new Intent("android.intent.action.CALL",Uri.parse("tel:" + num));
         phoneIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
         //Æô¶¯ 
         mcontext.startActivity(phoneIntent);
        }
		return "{\"status\":\"ok\"}";
	}

}