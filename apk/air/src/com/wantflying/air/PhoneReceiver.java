package com.wantflying.air;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.provider.ContactsContract;
import android.provider.ContactsContract.PhoneLookup;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;

import com.wantflying.server.NanoServer;
import com.wantflying.server.NanoWebSocketServer;

public class PhoneReceiver extends BroadcastReceiver {
    public static final int CALL_TYPE_IDEL = 0;
    public static final int CALL_TYPE_CALLING = 1;
    public static final int CALL_TYPE_RING = 2;
    private int currentState = CALL_TYPE_IDEL ;
    private String phoneNumber = "" ;
                                            
    private MyPhoneListener listener;
    @Override
    public void onReceive(Context context, Intent intent) {
    	if(intent.getAction().equals(Intent.ACTION_NEW_OUTGOING_CALL)){
             phoneNumber = intent.getStringExtra(Intent.EXTRA_PHONE_NUMBER);
    	}
        TelephonyManager tpManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
        listener = new MyPhoneListener();//´´½¨¼àÌýÆ÷
        tpManager.listen( listener, PhoneStateListener.LISTEN_CALL_STATE);//ÉèÖÃ¼àÌýÆ÷
                                             
    }
    private class MyPhoneListener extends PhoneStateListener {
        @Override
        public void onCallStateChanged(int state, String incomingNumber) {
            switch( state ){
            case TelephonyManager.CALL_STATE_IDLE :
                currentState = CALL_TYPE_IDEL;
                sendStat(currentState,phoneNumber);
                break;
            case TelephonyManager.CALL_STATE_OFFHOOK :
                currentState = CALL_TYPE_CALLING;
                sendStat(currentState,phoneNumber);
                break;
            case TelephonyManager.CALL_STATE_RINGING :
                currentState = CALL_TYPE_RING;
                sendStat(currentState,incomingNumber);
                break;
            }
        }
    }
    private void sendStat(int currentState,String number){
        if(currentState==0){
        	NanoWebSocketServer.userList.sendToAll("{\"type\":\"phoneStatus\",\"data\":{\"status\":\""+currentState+"\"}}");
        }else{
        	if(number!=""){
		        String photoid = "-1";
		        String name = number;
		        System.out.println("---------"+number+"==================");
		        try{
		            Uri personUri = Uri.withAppendedPath(ContactsContract.PhoneLookup.CONTENT_FILTER_URI, number);  
		            Cursor cur1 = NanoServer.mcontext.getContentResolver().query(personUri,new String[] {ContactsContract.Data.PHOTO_ID, PhoneLookup.DISPLAY_NAME },null, null, null );  
		            if( cur1.moveToFirst() ) {   
				          photoid = cur1.getString(0);
				          name = cur1.getString(1);
		            }  
		            cur1.close();
	            }catch(NullPointerException e){
	            }
	        	NanoWebSocketServer.userList.sendToAll("{\"type\":\"phoneStatus\",\"data\":{\"name\":\""+name+"\",\"photoid\":\""+photoid+"\",\"number\":\""+number+"\",\"status\":\""+currentState+"\"}}");
        	}
        }
    }
}