package com.wantflying.air;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.ContentObserver;
import android.net.Uri;
import android.os.Handler;

public class GetPhoneJson {
	public PhoneReceiver phoneRcvr;
	public Context mcontext;
	public GetPhoneJson(Context pcontext){
		//registerSmsReceiver(mcontext);
		mcontext = pcontext;
		registerPhoneReceiver(mcontext);
	}
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

public class SmsObserver extends ContentObserver {        
        private Context context;
        private static final String[] SMS_PROJECTION = new String[] {"address","person","date","type","body",};

        public SmsObserver(Context context,Handler handler) {
                super(handler);                
                this.context = context;
                Log.i("Leo-SmsObserver", "My Oberver on create");
        }
        
        public void onChange (boolean selfChange) {
                Log.i("SmsObserver", "sms onChange###### ");                
        }

}