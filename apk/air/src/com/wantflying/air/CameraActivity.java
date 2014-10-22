package com.wantflying.air;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.Socket;

import android.app.Activity;
import android.content.Intent;
import android.graphics.ImageFormat;
import android.graphics.Rect;
import android.graphics.YuvImage;
import android.hardware.Camera;
import android.hardware.Camera.Size;
import android.os.Bundle;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceHolder.Callback;
import android.view.SurfaceView;
import android.view.Window;
import android.view.WindowManager;

public class CameraActivity extends Activity {
	SurfaceView sView;
	SurfaceHolder surfaceHolder;
	int screenWidth, screenHeight;	
	Camera camera;                    // ¶¨ÒåÏµÍ³ËùÓÃµÄÕÕÏà»ú	
	boolean isPreview = false;        //ÊÇ·ñÔÚä¯ÀÀÖÐ
	private String ipname;

	@SuppressWarnings("deprecation")
	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // ÉèÖÃÈ«ÆÁ
     	requestWindowFeature(Window.FEATURE_NO_TITLE);
     	getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,WindowManager.LayoutParams.FLAG_FULLSCREEN);
        
        // »ñÈ¡IPµØÖ·
        Intent intent = getIntent();
        Bundle data = intent.getExtras();
        ipname = data.getString("ipname");
        		
		screenWidth = 640;
		screenHeight = 480;		
		sView = (SurfaceView) findViewById(R.id.sView);                  // »ñÈ¡½çÃæÖÐSurfaceView×é¼þ		
		surfaceHolder = sView.getHolder();                               // »ñµÃSurfaceViewµÄSurfaceHolder
		
		// ÎªsurfaceHolderÌí¼ÓÒ»¸ö»Øµ÷¼àÌýÆ÷
		surfaceHolder.addCallback(new Callback() {
			@Override
			public void surfaceChanged(SurfaceHolder holder, int format, int width,int height) {				
			}
			@Override
			public void surfaceCreated(SurfaceHolder holder) {							
				initCamera();                                            // ´ò¿ªÉãÏñÍ·
			}
			@Override
			public void surfaceDestroyed(SurfaceHolder holder) {
				// Èç¹ûcamera²»Îªnull ,ÊÍ·ÅÉãÏñÍ·
				if (camera != null) {
					if (isPreview)
						camera.stopPreview();
					camera.release();
					camera = null;
				}
			    System.exit(0);
			}		
		});
		// ÉèÖÃ¸ÃSurfaceView×Ô¼º²»Î¬»¤»º³å    
		surfaceHolder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
		
    }
    
    private void initCamera() {
    	if (!isPreview) {
			camera = Camera.open();
		}
		if (camera != null && !isPreview) {
			try{
				Camera.Parameters parameters = camera.getParameters();				
				parameters.setPreviewSize(screenWidth, screenHeight);    // ÉèÖÃÔ¤ÀÀÕÕÆ¬µÄ´óÐ¡				
				parameters.setPreviewFpsRange(20,30);                    // Ã¿ÃëÏÔÊ¾20~30Ö¡				
				parameters.setPictureFormat(ImageFormat.NV21);           // ÉèÖÃÍ¼Æ¬¸ñÊ½				
				parameters.setPictureSize(screenWidth, screenHeight);    // ÉèÖÃÕÕÆ¬µÄ´óÐ¡
				//camera.setParameters(parameters);                      // android2.3.3ÒÔºó²»ÐèÒª´ËÐÐ´úÂë
				camera.setPreviewDisplay(surfaceHolder);                 // Í¨¹ýSurfaceViewÏÔÊ¾È¡¾°»­Ãæ				
		        camera.setPreviewCallback(new StreamIt(ipname));         // ÉèÖÃ»Øµ÷µÄÀà				
				camera.startPreview();                                   // ¿ªÊ¼Ô¤ÀÀ				
				camera.autoFocus(null);                                  // ×Ô¶¯¶Ô½¹
			} catch (Exception e) {
				e.printStackTrace();
			}
			isPreview = true;
		}
    }
    
}

class StreamIt implements Camera.PreviewCallback {
	private String ipname;
	public StreamIt(String ipname){
		this.ipname = ipname;
	}
	
    @Override
    public void onPreviewFrame(byte[] data, Camera camera) {
        Size size = camera.getParameters().getPreviewSize();          
        try{ 
        	//µ÷ÓÃimage.compressToJpeg£¨£©½«YUV¸ñÊ½Í¼ÏñÊý¾Ýdata×ªÎªjpg¸ñÊ½
            YuvImage image = new YuvImage(data, ImageFormat.NV21, size.width, size.height, null);  
            if(image!=null){
            	ByteArrayOutputStream outstream = new ByteArrayOutputStream();
                image.compressToJpeg(new Rect(0, 0, size.width, size.height), 80, outstream); 
                outstream.flush();
                //ÆôÓÃÏß³Ì½«Í¼ÏñÊý¾Ý·¢ËÍ³öÈ¥
                Thread th = new MyThread(outstream,ipname);
                th.start();               
            }  
        }catch(Exception ex){  
            Log.e("Sys","Error:"+ex.getMessage());  
        }        
    }
}
    
class MyThread extends Thread{	
	private byte byteBuffer[] = new byte[1024];
	private OutputStream outsocket;	
	private ByteArrayOutputStream myoutputstream;
	private String ipname;
	
	public MyThread(ByteArrayOutputStream myoutputstream,String ipname){
		this.myoutputstream = myoutputstream;
		this.ipname = ipname;
        try {
			myoutputstream.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
    public void run() {
        try{
        	//½«Í¼ÏñÊý¾ÝÍ¨¹ýSocket·¢ËÍ³öÈ¥
            Socket tempSocket = new Socket(ipname, 6000);
            outsocket = tempSocket.getOutputStream();
            ByteArrayInputStream inputstream = new ByteArrayInputStream(myoutputstream.toByteArray());
            int amount;
            while ((amount = inputstream.read(byteBuffer)) != -1) {
                outsocket.write(byteBuffer, 0, amount);
            }
            myoutputstream.flush();
            myoutputstream.close();
            tempSocket.close();                   
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}