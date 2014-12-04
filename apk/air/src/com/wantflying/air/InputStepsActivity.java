package com.wantflying.air;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;

import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.view.Menu;
import android.view.View;
import android.widget.TextView;

public class InputStepsActivity extends Activity {
	private TextView ulText;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_input_steps);
		ulText = (TextView) findViewById(R.id.t1);
		new Thread(new AccessNetwork(OpenNanoServerActivity.ip,String.valueOf(OpenNanoServerActivity.port),String.valueOf(OpenNanoServerActivity.socketport))).start();
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.input_steps, menu);
		return true;
	}

    public boolean open_Status(View view){
    	Intent intent = new Intent(this,StatusActivity.class);
    	intent.putExtra("app","{mail:tcliuziyang,token:AkHua7B}");
    	intent.putExtra("browser","");
    	intent.putExtra("type","input");
    	startActivity(intent);
    	return true;
    }
    private String result = "";
	@SuppressLint("HandlerLeak")
	private Handler handler =new Handler(){
		@Override
		public void handleMessage(Message msg){
			super.handleMessage(msg);
        	ulText.setText(result);
		}
	};

	//appQr2browser
	@SuppressLint("SimpleDateFormat")
	public void sendIp2Server(String ip,String port,String socketport) throws IOException, JSONException{
		StringBuilder buf = new StringBuilder("http://droid4web.sinaapp.com/api/ipupdate.php");  
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
        if(conn.getResponseCode()==200){  
        	InputStream inStream = conn.getInputStream();
        	ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        	byte[] buffer = new byte[1024];
        	int len = -1;
        	while ((len = inStream.read(buffer)) != -1) {
        		outStream.write(buffer, 0, len);
        	}
        	outStream.close();
        	inStream.close();
        	byte[] data = outStream.toByteArray();
        	String res = new String(data, "UTF-8");
        	JSONObject jo = new JSONObject(res);
        	result = jo.getString("key")+"\n"+jo.getString("mes");
        }else{
        	result = "ip Ã·Ωª ß∞‹";
        }
		handler.sendEmptyMessage(0);
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
			} catch (JSONException e) {
				e.printStackTrace();
			}
		 }
	}


}
