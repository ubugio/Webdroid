package com.wantflying.air;

import com.wantflying.server.NanoWebSocketServer;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.widget.Toast;

public class SmsReceiver extends BroadcastReceiver {

	private static final String strRes = "android.provider.Telephony.SMS_RECEIVED";
	
	@Override
	public void onReceive(Context arg0, Intent arg1) {
		if(strRes.equals(arg1.getAction())){
			StringBuilder sb = new StringBuilder();
			Bundle bundle = arg1.getExtras();
			if(bundle!=null){
				Object[] pdus = (Object[])bundle.get("pdus");
				SmsMessage[] msg = new SmsMessage[pdus.length];
				for(int i = 0 ;i<pdus.length;i++){
					msg[i] = SmsMessage.createFromPdu((byte[])pdus[i]);
				}
				
				for(SmsMessage curMsg:msg){
					String sender = curMsg.getDisplayOriginatingAddress();
					sb.append("You got the message From:¡¾");
					sb.append(sender);
					sb.append("¡¿Content£º");
					sb.append(curMsg.getDisplayMessageBody());
		        	NanoWebSocketServer.userList.sendToAll("{\"type\":\"smsR\",\"data\":{\"sendtime\":\""+curMsg.getTimestampMillis()+"\",\"sender\":\""+sender+"\",\"content\":\""+curMsg.getDisplayMessageBody()+"\"}}");
				}
    			Toast.makeText(arg0, 
    					"Got The Message:" + sb.toString(),
    	                Toast.LENGTH_SHORT).show();		
			}
		}
	}

}
