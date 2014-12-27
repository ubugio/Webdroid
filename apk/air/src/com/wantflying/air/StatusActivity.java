package com.wantflying.air;

import java.util.ArrayList;

import android.animation.Animator;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.view.Menu;
import android.view.View;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.widget.ImageView;
import android.widget.TextView;

import com.wantflying.Ripple.RippleBackground;
import com.wantflying.server.NanoWebSocketServer;
import com.wantflying.server.UserList_WebSocket;

public class StatusActivity extends Activity {

    private static TextView cus;
    private static ArrayList<ImageView> imageViews;
    private static ArrayList<TextView> textViews;
    private static int devicesNum = 0;
    private static int on = 0;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_status);
		on = 1;
		UserList_WebSocket.statusFlag=1;
		Intent intent = this.getIntent();
		if(intent.hasExtra("app")){
		}
		cus = (TextView) findViewById(R.id.connected_users);
		devicesNum = NanoWebSocketServer.userList.userCount();
		cus.setText("已经有-"+devicesNum+"-个客户端建立在这个手机上");
		
		TextView urlText = (TextView) findViewById(R.id.link_status);
		urlText.setText("Server IP://" + OpenNanoServerActivity.ip + "/\n\nhttp port : " + OpenNanoServerActivity.port + "\nWebSocket port : " + OpenNanoServerActivity.socketport);
//======
        final RippleBackground rippleBackground=(RippleBackground)findViewById(R.id.content);
        imageViews=new ArrayList<ImageView>();
        textViews=new ArrayList<TextView>();
        imageViews.add((ImageView)findViewById(R.id.foundDevice1));
        imageViews.add((ImageView)findViewById(R.id.foundDevice2));
        imageViews.add((ImageView)findViewById(R.id.foundDevice3));
        imageViews.add((ImageView)findViewById(R.id.foundDevice4));
        imageViews.add((ImageView)findViewById(R.id.foundDevice5));
        textViews.add((TextView)findViewById(R.id.textView1));
        textViews.add((TextView)findViewById(R.id.textView2));
        textViews.add((TextView)findViewById(R.id.textView3));
        textViews.add((TextView)findViewById(R.id.textView4));
        textViews.add((TextView)findViewById(R.id.textView5));
        rippleBackground.startRippleAnimation();
        final Handler handler=new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                foundDevice(devicesNum);
            }
        },3000);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.status, menu);
		return true;
	}
	@Override
	public void onBackPressed() {
		UserList_WebSocket.statusFlag=0;
		on=0;
		super.onBackPressed();
	}

	@Override
	protected void onDestroy() {
		UserList_WebSocket.statusFlag=0;
		on=0;
		super.onDestroy();
	}
	//=====================================
    public static Handler handler=new Handler(){
        @Override
        public void handleMessage(Message msg) {
    		devicesNum = NanoWebSocketServer.userList.userCount();
    		cus.setText("已经有-"+devicesNum+"-个客户端建立在这个手机上");
        	if(msg.what==1){
    			if(on==1){
    				newDevice(devicesNum-1);
    			}
        	}
        	if(msg.what==0){
    			if(on==1)
    				deleteDevice(devicesNum);
        	}
            super.handleMessage(msg);
        }
    };

    private static void foundDevice(int devicesNum2){
    	devicesNum2=devicesNum2>5?5:devicesNum2;
    	for(int i=0;i<devicesNum2;i++){
    		newDevice(i);
    	}
    }
    private static void newDevice(int i){
		textViews.get(i).setText(UserList_WebSocket.list.get(i).ip);
        AnimatorSet animatorSet = new AnimatorSet();
        animatorSet.setDuration(400);
        animatorSet.setInterpolator(new AccelerateDecelerateInterpolator());
        ArrayList<Animator> animatorList=new ArrayList<Animator>();
        ObjectAnimator scaleXAnimator = ObjectAnimator.ofFloat(imageViews.get(i), "ScaleX", 0f, 1.2f, 1f);
        animatorList.add(scaleXAnimator);
        ObjectAnimator scaleYAnimator = ObjectAnimator.ofFloat(imageViews.get(i), "ScaleY", 0f, 1.2f, 1f);
        animatorList.add(scaleYAnimator);
        animatorSet.playTogether(animatorList);
        imageViews.get(i).setVisibility(View.VISIBLE);
        animatorSet.start();
    }
    public static void shakeClient2Server(String ip){
    	for(int i = 0;i < textViews.size(); i ++){
    		if(textViews.get(i).getText()==ip){
    	        AnimatorSet animatorSet = new AnimatorSet();
    	        animatorSet.setDuration(400);
    	        animatorSet.setInterpolator(new AccelerateDecelerateInterpolator());
    	        ArrayList<Animator> animatorList=new ArrayList<Animator>();
    	        ObjectAnimator scaleXAnimator = ObjectAnimator.ofFloat(imageViews.get(i), "ScaleX", 1f, 1.2f, 1f);
    	        animatorList.add(scaleXAnimator);
    	        ObjectAnimator scaleYAnimator = ObjectAnimator.ofFloat(imageViews.get(i), "ScaleY", 1f, 1.2f, 1f);
    	        animatorList.add(scaleYAnimator);
    	        animatorSet.playTogether(animatorList);
    	        animatorSet.start();
    		}
        }
    }
    
    private static void deleteDevice(final int i){
		textViews.get(i).setText("");
        AnimatorSet animatorSet = new AnimatorSet();
        animatorSet.setDuration(400);
        animatorSet.setInterpolator(new AccelerateDecelerateInterpolator());
        ArrayList<Animator> animatorList=new ArrayList<Animator>();
        ObjectAnimator scaleXAnimator = ObjectAnimator.ofFloat(imageViews.get(i), "ScaleX", 1f, 1.2f, 0f);
        animatorList.add(scaleXAnimator);
        ObjectAnimator scaleYAnimator = ObjectAnimator.ofFloat(imageViews.get(i), "ScaleY", 1f, 1.2f, 0f);
        animatorList.add(scaleYAnimator);
        animatorSet.playTogether(animatorList);
        Handler handler=new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                imageViews.get(i).setVisibility(View.INVISIBLE);
            }
        },400);
        animatorSet.start();
    }
}