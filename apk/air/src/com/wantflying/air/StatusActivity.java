package com.wantflying.air;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.animation.Animation;
import android.view.animation.Animation.AnimationListener;
import android.view.animation.AnimationUtils;
import android.view.animation.ScaleAnimation;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.wantflying.server.UserList_WebSocket;

public class StatusActivity extends Activity implements OnClickListener, AnimationListener {

	private RelativeLayout RelativeLayout;
	private int s = 1;
	private ScaleAnimation scaleAnim1;
	private ScaleAnimation scaleAnim2;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_status);
		Intent intent = this.getIntent();
		if(intent.hasExtra("app")){
			Bundle bundle = intent.getExtras();
			String app_t = bundle.getString("app");
			String browser_t = bundle.getString("browser");
			String type_t = bundle.getString("type");
			TextView app = (TextView) findViewById(R.id.app_status);
			TextView total = (TextView) findViewById(R.id.total_status);
			TextView browser = (TextView) findViewById(R.id.browser_status);
			total.setText(type_t);
			browser.setText(browser_t);
			app.setText(app_t);
		}
		TextView cus = (TextView) findViewById(R.id.connected_users);
		cus.setText("已经有-"+UserList_WebSocket.list.size()+"-个客户端建立在这个手机上");
		
		TextView urlText = (TextView) findViewById(R.id.link_status);
		urlText.setText("Server IP://" + OpenNanoServerActivity.ip + "/\n\nhttp port : " + OpenNanoServerActivity.port + "\nWebSocket port : " + OpenNanoServerActivity.socketport);

		findViewById(R.id.button1).setOnClickListener(this);
		RelativeLayout = (RelativeLayout) findViewById(R.id.RelativeLayout_Status);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.status, menu);
		return true;
	}
	//=====================================


	public void onClick(View v) {
		//startScaleAnimationJavaCode();
		startScaleAnimationXml();
		setlistener();
	}

	private void startScaleAnimationXml() {
//		android:fromXScale="1.0"			动画的开始大小
//			    android:toXScale="0.5"		动画的结束大小
//			    android:fromYScale="1.0"
//			    android:toYScale="0.5"
//			    android:pivotX="50%p"		动画放大或者缩小后的位置
//			    android:pivotY="50%p"
		scaleAnim1 = (ScaleAnimation) AnimationUtils.loadAnimation(this, R.anim.scale1);
		RelativeLayout.startAnimation(scaleAnim1);
		scaleAnim2 = (ScaleAnimation) AnimationUtils.loadAnimation(this, R.anim.scale2);
	}

	private void setlistener() {
		scaleAnim1.setAnimationListener(this);
		scaleAnim2.setAnimationListener(this);
	}

	private void startScaleAnimationJavaCode() {
		//Animation.RELATIVE_TO_SELF  动画相对于自身移动
		ScaleAnimation scaleAnim = new ScaleAnimation(1.0f, 0.5f, 1.0f, 0.5f,
				Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF,
				0.5f);
		scaleAnim.setDuration(2000);
		scaleAnim.setFillAfter(true);
		RelativeLayout.startAnimation(scaleAnim);

	}

	private void startScaleAnimationJavaCodes() {

		ScaleAnimation scaleAnims = new ScaleAnimation(0.5f, 1.0f, 0.5f, 1.0f,
				Animation.RELATIVE_TO_SELF, 0.5f, Animation.RELATIVE_TO_SELF,
				0.5f);
		scaleAnims.setDuration(2000);
		// scaleAnims.setStartOffset(2000);
		RelativeLayout.startAnimation(scaleAnims);
	}

	public void onAnimationStart(Animation animation) {
		// TODO Auto-generated method stub
		
	}

	public void onAnimationEnd(Animation animation) {
		if(s == 1){
			RelativeLayout.startAnimation(scaleAnim2);
			s = 2;
		}
		else if(s == 2){
			RelativeLayout.startAnimation(scaleAnim1);
			s = 1;
		}
		else{
			System.out.println("ScaleAnimationDemoActivity ++ 大姐来了");
		}
	}

	public void onAnimationRepeat(Animation animation) {
		// TODO Auto-generated method stub
		
	}

}