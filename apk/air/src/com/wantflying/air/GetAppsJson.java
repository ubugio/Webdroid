package com.wantflying.air;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.PixelFormat;
import android.graphics.drawable.Drawable;

public class GetAppsJson {
    static Context mcontext;
	@SuppressLint("SimpleDateFormat")
	private static SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd");
	private String out="";
	static PackageManager pm;
	
    public GetAppsJson(Context context) {
		mcontext=context;
		pm = mcontext.getApplicationContext().getPackageManager();
    }
    public String getApps(){
		List<Map<String, Object>> listems = new ArrayList<Map<String, Object>>();
		List<PackageInfo> packs = pm.getInstalledPackages(0);
		out="";
		for (PackageInfo pi : packs) {
			Map<String, Object> listem = new HashMap<String, Object>();
            listem.put("head", pi.applicationInfo.loadIcon(pm));
            listem.put("name", pi.applicationInfo.loadLabel(pm));
            listem.put("packageName", pi.applicationInfo.packageName);
            listem.put("firstInstallTime",format.format(pi.firstInstallTime));
            listem.put("versionName",String.valueOf(pi.versionName));
            String dir = pi.applicationInfo.publicSourceDir;
            listem.put("size",new File(dir).length());
            if((pi.applicationInfo.flags&ApplicationInfo.FLAG_SYSTEM)==0&&(pi.applicationInfo.flags&ApplicationInfo.FLAG_UPDATED_SYSTEM_APP)==0){
				out+=pi.applicationInfo.packageName+"#&";
			}
            listems.add(listem);  
		}
		String jsonresult = "";
        JSONObject object = new JSONObject();
        try {  
            JSONArray jsonarray = new JSONArray();

    		for (Map<String, Object> m : listems) {
                JSONObject jsonObj = new JSONObject();
    		    for (String k : m.keySet()) {
    		    	jsonObj.put(k, m.get(k));
    		    }
                jsonarray.put(jsonObj);
    		}
            object.put("apps", jsonarray);//向总对象里面添加包含pet的数组  
            object.put("users", out);//向总对象里面添加包含pet的数组  
            jsonresult = object.toString();//生成返回字符串  
        } catch (JSONException e) {  
            e.printStackTrace();  
        }  
        return jsonresult;
    }
	public static InputStream packageHead(String packagename) throws NameNotFoundException, IOException  {
		ApplicationInfo info = pm.getApplicationInfo(packagename, 0);     
        Drawable icon = info.loadIcon(pm);
        
        int w = icon.getIntrinsicWidth();
        int h = icon.getIntrinsicHeight();
        Bitmap.Config config = icon.getOpacity() != PixelFormat.OPAQUE ? Bitmap.Config.ARGB_8888: Bitmap.Config.RGB_565;
       Bitmap bitmap = Bitmap.createBitmap(w, h, config);
       Canvas canvas = new Canvas(bitmap);
       icon.setBounds(0, 0, w, h);
       icon.draw(canvas);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, baos);
        InputStream is = new ByteArrayInputStream(baos.toByteArray());
        //baos.close();
		return is;
	}
	public static String packageName(String packagename) throws NameNotFoundException, IOException  {
		ApplicationInfo info = pm.getApplicationInfo(packagename, 0); 
		return (String) info.loadLabel(pm);
	}
	public static InputStream packageHeadFromPath(String apkpath) throws NameNotFoundException, IOException  {
		PackageManager pm = mcontext.getPackageManager();
	    PackageInfo pInfo = pm.getPackageArchiveInfo(apkpath , PackageManager.GET_ACTIVITIES);
        Drawable icon = pm.getApplicationIcon(pInfo.applicationInfo);
        
        int w = icon.getIntrinsicWidth();
        int h = icon.getIntrinsicHeight();
        Bitmap.Config config = icon.getOpacity() != PixelFormat.OPAQUE ? Bitmap.Config.ARGB_8888: Bitmap.Config.RGB_565;
       Bitmap bitmap = Bitmap.createBitmap(w, h, config);
       Canvas canvas = new Canvas(bitmap);
       icon.setBounds(0, 0, w, h);
       icon.draw(canvas);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, baos);
        InputStream is = new ByteArrayInputStream(baos.toByteArray());
        //baos.close();
		return is;
	}


}
