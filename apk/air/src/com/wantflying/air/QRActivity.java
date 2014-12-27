package com.wantflying.air;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Vector;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.content.res.AssetFileDescriptor;
import android.graphics.Bitmap;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnCompletionListener;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Vibrator;
import android.view.SurfaceHolder;
import android.view.SurfaceHolder.Callback;
import android.view.SurfaceView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.Result;
import com.wantflying.Zxing.camera.CameraManager;
import com.wantflying.Zxing.decoding.CaptureActivityHandler;
import com.wantflying.Zxing.decoding.InactivityTimer;
import com.wantflying.Zxing.view.ViewfinderView;

public class QRActivity extends Activity implements Callback {

	private CaptureActivityHandler handler;
	private ViewfinderView viewfinderView;
	private boolean hasSurface;
	private Vector<BarcodeFormat> decodeFormats;
	private String characterSet;
	private TextView txtResult;
	private InactivityTimer inactivityTimer;
	private MediaPlayer mediaPlayer;
	private boolean playBeep;
	private static final float BEEP_VOLUME = 0.10f;
	private boolean vibrate;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_qr);
		//初始化 CameraManager
		CameraManager.init(getApplication());

		viewfinderView = (ViewfinderView) findViewById(R.id.viewfinder_view);
		txtResult = (TextView) findViewById(R.id.txtResult);
		hasSurface = false;
		inactivityTimer = new InactivityTimer(this);
	}

	@SuppressWarnings("deprecation")
	@Override
	protected void onResume() {
		super.onResume();
		SurfaceView surfaceView = (SurfaceView) findViewById(R.id.preview_view);
		SurfaceHolder surfaceHolder = surfaceView.getHolder();
		if (hasSurface) {
			initCamera(surfaceHolder);
		} else {
			surfaceHolder.addCallback(this);
			surfaceHolder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
		}
		decodeFormats = null;
		characterSet = null;

		playBeep = true;
		AudioManager audioService = (AudioManager) getSystemService(AUDIO_SERVICE);
		if (audioService.getRingerMode() != AudioManager.RINGER_MODE_NORMAL) {
			playBeep = false;
		}
		initBeepSound();
		vibrate = true;
	}

	@Override
	protected void onPause() {
		super.onPause();
		if (handler != null) {
			handler.quitSynchronously();
			handler = null;
		}
		CameraManager.get().closeDriver();
	}

	@Override
	protected void onDestroy() {
		inactivityTimer.shutdown();
		super.onDestroy();
	}

	private void initCamera(SurfaceHolder surfaceHolder) {
		try {
			CameraManager.get().openDriver(surfaceHolder);
		} catch (IOException ioe) {
			return;
		} catch (RuntimeException e) {
			return;
		}
		if (handler == null) {
			handler = new CaptureActivityHandler(this, decodeFormats,
					characterSet);
		}
	}

	@Override
	public void surfaceChanged(SurfaceHolder holder, int format, int width,
			int height) {

	}

	@Override
	public void surfaceCreated(SurfaceHolder holder) {
		if (!hasSurface) {
			hasSurface = true;
			initCamera(holder);
		}

	}

	@Override
	public void surfaceDestroyed(SurfaceHolder holder) {
		hasSurface = false;

	}

	public ViewfinderView getViewfinderView() {
		return viewfinderView;
	}

	public Handler getHandler() {
		return handler;
	}

	public void drawViewfinder() {
		viewfinderView.drawViewfinder();

	}

	public void handleDecode(Result obj, Bitmap barcode) {
		inactivityTimer.onActivity();
		//viewfinderView.drawResultBitmap(barcode);
		 playBeepSoundAndVibrate();
		txtResult.setText(obj.getBarcodeFormat().toString() + ":"
				+ obj.getText());
		open_Status(obj.getText());
	}

    public boolean open_Status(String res){
		new Thread(new AccessNetwork(res)).start();
    	Intent intent = new Intent(this,StatusActivity.class);
    	intent.putExtra("app","{mail:tcliuziyang,token:AkHua7B}");
    	intent.putExtra("browser",res);
    	intent.putExtra("type","qrcode");
    	startActivity(intent);
    	return true;
    }

	//appQr2browser
	@SuppressLint("SimpleDateFormat")
	public void sendIp2Server(String id,String ip,String port,String socketport) throws IOException{
		StringBuilder buf = new StringBuilder("http://droid4web.sinaapp.com/api/appQr2browser.php"); 
		//android.wantflying.com/api/scaner.php?id=Air-alpha-asoasas
		id = id.substring(id.indexOf("?id=")+4,id.length());
        buf.append("?");
        buf.append("islan=1&");
        buf.append("id="+URLEncoder.encode(id,"UTF-8")+"&");
        buf.append("ip="+URLEncoder.encode(ip,"UTF-8")+"&");
        buf.append("port="+URLEncoder.encode(port,"UTF-8")+"&");
        buf.append("socket="+URLEncoder.encode(socketport,"UTF-8")+"&");
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
		private String id = null;
		 public AccessNetwork(String mid) {
		  super();
		  id = mid;
		 }
		 @Override
		 public void run() {
			 try {
				sendIp2Server(id,OpenNanoServerActivity.ip,String.valueOf(OpenNanoServerActivity.port),String.valueOf(OpenNanoServerActivity.socketport));
			} catch (IOException e) {
				e.printStackTrace();
			}
		 }
	}


	private void initBeepSound() {
		if (playBeep && mediaPlayer == null) {
			// The volume on STREAM_SYSTEM is not adjustable, and users found it
			// too loud,
			// so we now play on the music stream.
			setVolumeControlStream(AudioManager.STREAM_MUSIC);
			mediaPlayer = new MediaPlayer();
			mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
			mediaPlayer.setOnCompletionListener(beepListener);

			AssetFileDescriptor file = getResources().openRawResourceFd(
					R.raw.beep);
			try {
				mediaPlayer.setDataSource(file.getFileDescriptor(),
						file.getStartOffset(), file.getLength());
				file.close();
				mediaPlayer.setVolume(BEEP_VOLUME, BEEP_VOLUME);
				mediaPlayer.prepare();
			} catch (IOException e) {
				mediaPlayer = null;
			}
		}
	}

	private static final long VIBRATE_DURATION = 200L;

	private void playBeepSoundAndVibrate() {
		if (playBeep && mediaPlayer != null) {
			mediaPlayer.start();
		}
		if (vibrate) {
			Vibrator vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
			vibrator.vibrate(VIBRATE_DURATION);
		}
	}

	/**
	 * When the beep has finished playing, rewind to queue up another one.
	 */
	private final OnCompletionListener beepListener = new OnCompletionListener() {
		public void onCompletion(MediaPlayer mediaPlayer) {
			mediaPlayer.seekTo(0);
		}
	};

}