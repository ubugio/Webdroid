package com.wantflying.air;

import java.io.File;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Collections;
import java.util.List;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.ProgressDialog;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.telephony.PhoneStateListener;
import android.telephony.SignalStrength;
import android.telephony.TelephonyManager;
import android.view.View;
import android.widget.CompoundButton;
import android.widget.CompoundButton.OnCheckedChangeListener;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ToggleButton;

import com.wantflying.server.NanoHTTPD;
import com.wantflying.server.NanoServer;
import com.wantflying.server.NanoWebSocketServer;

public class OpenNanoServerActivity extends Activity implements OnCheckedChangeListener {
	public static NanoHTTPD nanoHTTPD;
    public static String ip = "";
    public static int port = 7910;
    public static int socketport = 9999;
    File wwwroot;
    String hostaddres;
    public static NanoWebSocketServer ws;

	private ToggleButton toggleBtn;
	private TextView urlText;
	public static TextView ulText;
	private Intent intent;
	
	public static ClipboardManager cmb;
	public static int info_gsm_signal_asu = -1;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_open_nano_server);
		cmb = (ClipboardManager)getSystemService(Context.CLIPBOARD_SERVICE);
		initViews();
		//----信号改变事件
		MyPhoneStateListener MyListener = new MyPhoneStateListener();
		TelephonyManager Tel = ( TelephonyManager )getSystemService(Context.TELEPHONY_SERVICE);
		Tel.listen(MyListener ,PhoneStateListener.LISTEN_SIGNAL_STRENGTHS);
		//----通话状态
		new GetPhoneJson(getApplicationContext());

	}
	private class MyPhoneStateListener extends PhoneStateListener{
		@Override
		public void onSignalStrengthsChanged(SignalStrength signalStrength){
			super.onSignalStrengthsChanged(signalStrength);
			info_gsm_signal_asu = signalStrength.getGsmSignalStrength();
			if(nanoHTTPD!=null)
				NanoServer.StatusJson.pushStatus();
		}
	};

	private void initViews() {
		toggleBtn = (ToggleButton) findViewById(R.id.toggleBtn_nano);
		toggleBtn.setOnCheckedChangeListener(this);
		urlText = (TextView) findViewById(R.id.urlText_nano);
		ulText = (TextView) findViewById(R.id.urlText_userList);
	}


	@Override
	public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
		if (isChecked) {
			ip = getLocalIpAddress2();
			if (ip == null) {
				Toast.makeText(this, R.string.msg_net_off, Toast.LENGTH_SHORT).show();
				urlText.setText("");
			} else {
				processThread();
			}
		} else {
			if (nanoHTTPD != null)
				nanoHTTPD.stop();
			if (ws != null){
	        	NanoWebSocketServer.userList.disconectAll();
	        	ws.stop();
			}
	        System.out.println("Server stopped.\n");
			urlText.setText("");
		}
	}
	
	public void newServer(){
		try{
			nanoHTTPD = new NanoServer(port,getApplicationContext());
			nanoHTTPD.start();
			ws = new NanoWebSocketServer(socketport);
			ws.start();
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	
	
	
	//声明变量
	private ProgressDialog pd;
	//定义Handler对象
	@SuppressLint("HandlerLeak")
	private Handler handler =new Handler(){
		@SuppressWarnings("deprecation")
		@Override
		public void handleMessage(Message msg){
			super.handleMessage(msg);
			pd.dismiss();
			urlText.setText("Server IP://" + ip + "/\n\nhttp port : " + port + "\nWebSocket port : " + socketport);
			//新建状态栏通知
			NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);  
			Notification baseNF = new Notification();
			baseNF.icon = R.drawable.ic_launcher;
			baseNF.tickerText = "Air 服务成功启动!";
			baseNF.flags |= Notification.FLAG_NO_CLEAR;
	        Intent intent = new Intent(OpenNanoServerActivity.this,StatusActivity.class);
	        PendingIntent pi = PendingIntent.getActivity(OpenNanoServerActivity.this, 0, intent, 0); 
			baseNF.setLatestEventInfo(OpenNanoServerActivity.this, "Air服务正在运行", "http://" + ip + ":" + port + "(" + socketport+")", pi);
			nm.notify(9983, baseNF);
		}
	};
	private void processThread(){
		//构建一个下载进度条
		pd = ProgressDialog.show(this, "请稍候", "正在打开手机端服务器…");
		new Thread(){
			public void run(){
				newServer();
				handler.sendEmptyMessage(0);
			}
		}.start();
	}
	
	
	
	
	public  String getLocalIpAddress2() {
		String networkIp = null;
		try {
			List<NetworkInterface> interfaces = Collections
					.list(NetworkInterface.getNetworkInterfaces());
			for (NetworkInterface iface : interfaces) {
				if (iface.getDisplayName().equals("eth0")) {
					List<InetAddress> addresses = Collections.list(iface
							.getInetAddresses());
					for (InetAddress address : addresses) {
						if (address instanceof Inet4Address) {
							networkIp = address.getHostAddress();
						}
					}
				} else if (iface.getDisplayName().equals("wlan0")) {
					List<InetAddress> addresses = Collections.list(iface
							.getInetAddresses());
					for (InetAddress address : addresses) {
						if (address instanceof Inet4Address) {
							networkIp = address.getHostAddress();
						}
					}
				}
			}
		} catch (SocketException e) {
			e.printStackTrace();
		}

		return networkIp;
	}

	@Override
	public void onBackPressed() {
		if (intent != null) {
			stopService(intent);
		}
		super.onBackPressed();
	}

	@Override
	protected void onDestroy() {
		super.onDestroy();
	}
	
    public boolean open_inputsteps(View view){
    	Intent intent = new Intent(this,InputStepsActivity.class);
    	startActivity(intent);
    	return true;
    }
    public boolean open_camera(View view){
    	Intent intent = new Intent(this,QRActivity.class);
    	startActivity(intent);
    	return true;
    }

}