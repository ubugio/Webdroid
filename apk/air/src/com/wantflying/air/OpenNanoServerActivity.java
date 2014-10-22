package com.wantflying.air;

import java.io.File;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Collections;
import java.util.List;

import android.app.Activity;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
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
		//----�źŸı��¼�
		MyPhoneStateListener MyListener = new MyPhoneStateListener();
		TelephonyManager Tel = ( TelephonyManager )getSystemService(Context.TELEPHONY_SERVICE);
		Tel.listen(MyListener ,PhoneStateListener.LISTEN_SIGNAL_STRENGTHS);
		//----ͨ��״̬
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