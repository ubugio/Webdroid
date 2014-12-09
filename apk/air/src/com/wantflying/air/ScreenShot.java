package com.wantflying.air;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.ThumbnailUtils;
import android.os.Environment;

public class ScreenShot {
	public static String screenShotPath = Environment.getExternalStorageDirectory().getPath()+"/air/screens/img.png";
	
	public static InputStream shot(String _width,String _height,String quality) throws IOException, InterruptedException {
		Process sh = Runtime.getRuntime().exec("su", null,null);
		OutputStream os = sh.getOutputStream();
		os.write(("/system/bin/screencap -p " + screenShotPath).getBytes("ASCII"));
		os.flush();
		os.close();
		sh.waitFor();
		
		int _quality=100;
		if(quality.equalsIgnoreCase("prefect"))
			_quality=80;
		if(quality.equalsIgnoreCase("good"))
			_quality=50;
		if(quality.equalsIgnoreCase("fine"))
			_quality=20;
		if(quality.equalsIgnoreCase("poor"))
			_quality=10;
		if(quality.equalsIgnoreCase("poorpoor"))
			_quality=5;
		
		 Bitmap bitmap = null;  
	        BitmapFactory.Options options = new BitmapFactory.Options();  
	        options.inJustDecodeBounds = true;
	        bitmap = BitmapFactory.decodeFile(screenShotPath, options);  
	        options.inJustDecodeBounds = false;
	        int h = options.outHeight;
	        int w = options.outWidth;
	        int width = Integer.parseInt(_width);
	        int height = Integer.parseInt(_height);
	        int beWidth = w / width;
	        int beHeight = h / height;
	        int be = 1;
	        if (beWidth < beHeight)
	            be = beWidth;  
	        else
	            be = beHeight;
	        if (be <= 0)
	            be = 1;
	        options.inSampleSize = be;
	        bitmap = BitmapFactory.decodeFile(screenShotPath, options);  
	        bitmap = ThumbnailUtils.extractThumbnail(bitmap, width, height,ThumbnailUtils.OPTIONS_RECYCLE_INPUT); 
		
	        ByteArrayOutputStream baos = new ByteArrayOutputStream();
	        bitmap.compress(Bitmap.CompressFormat.JPEG, _quality, baos);
	        return new ByteArrayInputStream(baos.toByteArray());
	}
}