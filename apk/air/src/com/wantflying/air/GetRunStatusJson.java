package com.wantflying.air;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import android.app.ActivityManager;
import android.app.ActivityManager.RunningAppProcessInfo;
import android.app.ActivityManager.RunningServiceInfo;
import android.app.ActivityManager.RunningTaskInfo;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;

public class GetRunStatusJson {
	private static List<Map<String, Object>> listems = new ArrayList<Map<String, Object>>();  
	private static List<Map<String, Object>> listems1 = new ArrayList<Map<String, Object>>();  
	private static List<Map<String, Object>> listems2 = new ArrayList<Map<String, Object>>(); 
	private static Context mContext;
	private static SimpleDateFormat format;
	
	public GetRunStatusJson(Context context){
		mContext = context;
	}
	
	
	public static void getRunningServicesInfo() {
		PackageManager pm = mContext.getPackageManager();   
		final ActivityManager activityManager = (ActivityManager) mContext
				.getSystemService(Context.ACTIVITY_SERVICE);
		List<RunningServiceInfo> services = activityManager.getRunningServices(100);
		for (RunningServiceInfo si : services) {
			Map<String, Object> listem = new HashMap<String, Object>();  
            try {    
            	ApplicationInfo info = pm.getApplicationInfo(si.process, 0);
                listem.put("head", info.loadIcon(pm));  
                listem.put("name", info.loadLabel(pm).toString()+"("+si.pid+")"); 
                listem.put("desc", si.process+"\n"+format.format(si.activeSince)+"-"+format.format(si.lastActivityTime));
                listems.add(listem);  
           } catch (NameNotFoundException e) {
        	   //e.printStackTrace();
           }
		}
	}
	public static void getRunningTaskInfo() {
		PackageManager pm = mContext.getPackageManager();   
		final ActivityManager activityManager = (ActivityManager) mContext
				.getSystemService(Context.ACTIVITY_SERVICE);
		List<RunningTaskInfo> tasks = activityManager.getRunningTasks(100);
		for (RunningTaskInfo ti : tasks) {
			Map<String, Object> listem = new HashMap<String, Object>();  
            try {    
            	ApplicationInfo info = pm.getApplicationInfo(ti.baseActivity.getPackageName(), 0);
                listem.put("head", info.loadIcon(pm));  
                listem.put("name", info.loadLabel(pm).toString()+"("+ti.id+")"); 
                listem.put("desc", ti.baseActivity.getPackageName()+"\n"+ti.numRunning+"/"+ti.numActivities);
                listems1.add(listem);  
           } catch (NameNotFoundException e) {
        	   //e.printStackTrace();
           }
		}
	}

	public static void getProcessTaskInfo() {
		PackageManager pm = mContext.getPackageManager();
		final ActivityManager activityManager = (ActivityManager) mContext
				.getSystemService(Context.ACTIVITY_SERVICE);
		List<RunningAppProcessInfo> tasks = activityManager.getRunningAppProcesses();
		for (RunningAppProcessInfo ti : tasks) {
			Map<String, Object> listem = new HashMap<String, Object>();  
            try {    
            	ApplicationInfo info = pm.getApplicationInfo(ti.processName, 0);
                listem.put("head", info.loadIcon(pm));  
                listem.put("name", info.loadLabel(pm).toString()+"("+ti.pid+"-"+ti.uid+")"); 
                listem.put("desc", ti.processName+"\nimportance:"+ti.importance);
                listems2.add(listem);  
           } catch (NameNotFoundException e) {
        	   //e.printStackTrace();
           }
		}
	}
}
