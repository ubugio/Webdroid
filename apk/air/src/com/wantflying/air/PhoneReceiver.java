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
    /**
     * 手机没有通话，在一般的状态值
     */
    public static final int CALL_TYPE_IDEL = 0;
    /**
     * 手机通话状态值
     */
    public static final int CALL_TYPE_CALLING = 1;
    /**
     * 手机响铃状态值
     */
    public static final int CALL_TYPE_RING = 2;
                                                                                                                          
    /**
     * 当前手机通话状态值
     */
    private int currentState = CALL_TYPE_IDEL ;
    private String phoneNumber = "" ;
                                            
    private MyPhoneListener listener;
    @Override//当发生监听的事件，系统会调用这个方法
    public void onReceive(Context context, Intent intent) {
        //进行细节上的监控，我们需要操作TelephonyManager，为它设置监听器，他就给我们反馈
        //拿到系统的TelephonyManager
    	System.out.println("onReceive");
    	if(intent.getAction().equals(Intent.ACTION_NEW_OUTGOING_CALL)){
             phoneNumber = intent.getStringExtra(Intent.EXTRA_PHONE_NUMBER);
    	}
        TelephonyManager tpManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
        listener = new MyPhoneListener();//创建监听器
        tpManager.listen( listener, PhoneStateListener.LISTEN_CALL_STATE);//设置监听器
                                             
    }
    private class MyPhoneListener extends PhoneStateListener {
        @Override//当电话状态发生改变的时候，系统会调用这个方法
        public void onCallStateChanged(int state, String incomingNumber) {
            //首先取得当前的状态值
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
		        String name = "";
		        System.out.println("---------"+number+"==================");
	            Uri personUri = Uri.withAppendedPath(ContactsContract.PhoneLookup.CONTENT_FILTER_URI, number);  
	            Cursor cur1 = NanoServer.mcontext.getContentResolver().query(personUri,new String[] {ContactsContract.Data.PHOTO_ID, PhoneLookup.DISPLAY_NAME },null, null, null );  
	            if( cur1.moveToFirst() ) {   
			          photoid = cur1.getString(0);
			          name = cur1.getString(1);
	            }  
	            cur1.close();
	        	NanoWebSocketServer.userList.sendToAll("{\"type\":\"phoneStatus\",\"data\":{\"name\":\""+name+"\",\"photoid\":\""+photoid+"\",\"number\":\""+number+"\",\"status\":\""+currentState+"\"}}");
        	}
        }
    }
    //--------=======================------------------------==========================
/*
    protected Saudioclient     m_recorder ;
    public void startSound(InputStream in){
        m_recorder = new Saudioclient() ;
        m_recorder.init(in) ;
        m_recorder.start() ;
    }
    private void stopSound(){
        m_recorder.free() ;
        m_recorder = null ;
    }
public class Saudioclient extends Thread{
    protected AudioRecord m_in_rec ; 
    protected int         m_in_buf_size ;
    protected byte []     m_in_bytes ;
    protected boolean     m_keep_running ;
    protected InputStream dout;
    protected LinkedList<byte[]>  m_in_q ;
    
    public void run(){
        try{
            byte [] bytes_pkg ;
            m_in_rec.startRecording() ;
            while(m_keep_running){
                m_in_rec.read(m_in_bytes, 0, m_in_buf_size) ;
                bytes_pkg = m_in_bytes.clone() ;
                if(m_in_q.size() >= 2){
                    dout = new ByteArrayInputStream(m_in_q.removeFirst());
                }
                m_in_q.add(bytes_pkg) ;
            }
            m_in_rec.stop() ;
            m_in_rec = null ;
            m_in_bytes = null ;
            dout.close();
        }catch(Exception e){
            e.printStackTrace();
        }
    }
   
    public void init(InputStream in){
        m_in_buf_size =  AudioRecord.getMinBufferSize(8000,
                            AudioFormat.CHANNEL_CONFIGURATION_MONO,
                            AudioFormat.ENCODING_PCM_16BIT);
   
        m_in_rec = new AudioRecord(MediaRecorder.AudioSource.MIC,
                            8000,
                            AudioFormat.CHANNEL_CONFIGURATION_MONO,
                            AudioFormat.ENCODING_PCM_16BIT,
                            m_in_buf_size) ;
  
        m_in_bytes = new byte [m_in_buf_size] ;
  
        m_keep_running = true ;
        m_in_q=new LinkedList<byte[]>();
        dout = in;
  
    }
   
    public void free(){
        m_keep_running = false ;
        try {
            Thread.sleep(1000) ;
        } catch(Exception e) {
            System.out.println("sleep exceptions...") ;
        }
    }
}*/
    
}