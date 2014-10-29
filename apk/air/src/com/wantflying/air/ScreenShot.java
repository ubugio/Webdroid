package com.wantflying.air;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import android.os.Environment;

public class ScreenShot {
	public static String screenShotPath = Environment.getExternalStorageDirectory().getPath()+"/air/screens/img.png";
	public static InputStream shot() throws IOException, InterruptedException {
		Process sh = Runtime.getRuntime().exec("su", null,null);
		OutputStream os = sh.getOutputStream();
		os.write(("/system/bin/screencap -p " + screenShotPath).getBytes("ASCII"));
		os.flush();
		os.close();
		sh.waitFor();
		FileInputStream swapStream = new FileInputStream(new File(screenShotPath));
        return swapStream;
	}
}