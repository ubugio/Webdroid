package com.wantflying.air;

import java.io.File;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.URL;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.List;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Looper;
import android.telephony.PhoneStateListener;
import android.telephony.SignalStrength;
import android.telephony.TelephonyManager;
import android.widget.CompoundButton;
import android.widget.CompoundButton.OnCheckedChangeListener;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ToggleButton;
import com.wantflying.server.NanoHTTPD;
import com.wantflying.server.NanoServer;
import com.wantflying.server.NanoWebSocketServer;

public class OpenNanoServerActivity extends Activity implements OnCheckedChangeListener {
	NanoHTTPD nanoHTTPD;
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
			String ip = getLocalIpAddress2();
			if (ip == null) {
				Toast.makeText(this, R.string.msg_net_off, Toast.LENGTH_SHORT).show();
				urlText.setText("");
			} else {
				try{
					nanoHTTPD = new NanoServer(port,getApplicationContext());
					nanoHTTPD.start();
					ws = new NanoWebSocketServer(socketport);
					ws.start();
				}catch(Exception e){
					e.printStackTrace();
				}
				new Thread(new AccessNetwork(ip,String.valueOf(port),String.valueOf(socketport))).start();
				urlText.setText("Server IP://" + ip + "/\n\nhttp port : " + port + "\nWebSocket port : " + socketport);
				
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
	
	@SuppressLint("SimpleDateFormat")
	public void sendIp2Server(String ip,String port,String socketport) throws IOException{
		StringBuilder buf = new StringBuilder("http://droid4web.sinaapp.com/ipupdate.php");  
        buf.append("?");
        buf.append("ip="+URLEncoder.encode(ip,"UTF-8")+"&");
        buf.append("port="+URLEncoder.encode(port,"UTF-8")+"&");
        buf.append("socketport="+URLEncoder.encode(socketport,"UTF-8")+"&");
        SimpleDateFormat sDateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss a");     
        String date = sDateFormat.format(new java.util.Date());
        buf.append("updatetime="+URLEncoder.encode(date,"UTF-8"));
        URL url = new URL(buf.toString());  
        HttpURLConnection conn = (HttpURLConnection)url.openConnection(); 
        conn.setRequestProperty("accept", "*/*");
        conn.setRequestProperty("connection", "Keep-Alive");
        conn.setRequestProperty("user-agent","Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)"); 
        //conn.setRequestMethod("GET");  
        conn.connect();
        String txt = "";
        if(conn.getResponseCode()==200){  
        	txt="ip 提交成功";  
        }else
        	txt="ip 提交失败";   
    	Looper.prepare();
        Toast.makeText(this,txt, Toast.LENGTH_SHORT).show();  
	}
	class AccessNetwork implements Runnable{
		 private String ip ;
		 private String port;
		 private String socketport;

		 public AccessNetwork(String ip,String port,String socketport) {
		  super();
		  this.ip = ip;
		  this.port = port;
		  this.socketport = socketport;
		 }
		 @Override
		 public void run() {
			 try {
				sendIp2Server(this.ip,this.port,this.socketport);
			} catch (IOException e) {
				e.printStackTrace();
			}
		 }
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

}