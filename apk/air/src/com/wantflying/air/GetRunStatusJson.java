package com.wantflying.air;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.ActivityManager;
import android.app.ActivityManager.RunningAppProcessInfo;
import android.app.ActivityManager.RunningServiceInfo;
import android.app.ActivityManager.RunningTaskInfo;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;

public class GetRunStatusJson { 
	private static Context mContext;
	
	public GetRunStatusJson(Context context){
		mContext = context;
	}
	
	//正在运行的服务
	public String getRunningServicesInfo() {
		PackageManager pm = mContext.getPackageManager(); 
		List<Map<String, Object>> listems = new ArrayList<Map<String, Object>>();   
		final ActivityManager activityManager = (ActivityManager) mContext.getSystemService(Context.ACTIVITY_SERVICE);
		List<RunningServiceInfo> services = activityManager.getRunningServices(100);
		for (RunningServiceInfo si : services) {
			Map<String, Object> listem = new HashMap<String, Object>();  
            try {    
            	ApplicationInfo info = pm.getApplicationInfo(si.process, 0);
                listem.put("name", info.loadLabel(pm).toString());
                listem.put("pid", si.pid);
                listem.put("foreground", si.foreground);
                listem.put("process", si.process);
                listem.put("activeSince", si.activeSince);
                listem.put("lastActivityTime", si.lastActivityTime);
                listems.add(listem);
           } catch (NameNotFoundException e) {
        	   //e.printStackTrace();
           }
		}
        JSONObject object = new JSONObject();
        try {
			object.put("status", true);
            JSONArray jsonarray = new JSONArray();
    		for (Map<String, Object> m : listems) {
                JSONObject jsonObj = new JSONObject();
    		    for (String k : m.keySet()) {
    		    	jsonObj.put(k, m.get(k));
    		    }
                jsonarray.put(jsonObj);
    		}
			object.put("list", jsonarray);
		} catch (JSONException e) {
			e.printStackTrace();
		}
        return object.toString();
	}
	//正在运行的任务
	public String getRunningTaskInfo() {
		List<Map<String, Object>> listems1 = new ArrayList<Map<String, Object>>();  
		PackageManager pm = mContext.getPackageManager();   
		final ActivityManager activityManager = (ActivityManager) mContext.getSystemService(Context.ACTIVITY_SERVICE);
		List<RunningTaskInfo> tasks = activityManager.getRunningTasks(100);
		for (RunningTaskInfo ti : tasks) {
			Map<String, Object> listem = new HashMap<String, Object>();
            try {
            	ApplicationInfo info = pm.getApplicationInfo(ti.baseActivity.getPackageName(), 0);
                listem.put("name", info.loadLabel(pm).toString());
                listem.put("id", ti.id);
                listem.put("packageName", ti.baseActivity.getPackageName());
                listem.put("numRunning", ti.numRunning);
                listem.put("numActivities", ti.numActivities);
                listems1.add(listem);
           } catch (NameNotFoundException e) {
        	   //e.printStackTrace();
           }
		}
        JSONObject object = new JSONObject();
        try {
			object.put("status", true);
            JSONArray jsonarray = new JSONArray();
    		for (Map<String, Object> m : listems1) {
                JSONObject jsonObj = new JSONObject();
    		    for (String k : m.keySet()) {
    		    	jsonObj.put(k, m.get(k));
    		    }
                jsonarray.put(jsonObj);
    		}
			object.put("list", jsonarray);
		} catch (JSONException e) {
			e.printStackTrace();
		}
        return object.toString();
	}

	//正在运行的进程
	public String getProcessTaskInfo() { 
		List<Map<String, Object>> listems3 = new ArrayList<Map<String, Object>>();
		PackageManager pm = mContext.getPackageManager();
		final ActivityManager activityManager = (ActivityManager) mContext.getSystemService(Context.ACTIVITY_SERVICE);
		List<RunningAppProcessInfo> tasks = activityManager.getRunningAppProcesses();
		for (RunningAppProcessInfo ti : tasks) {
			Map<String, Object> listem = new HashMap<String, Object>();  
            try {    
            	ApplicationInfo info = pm.getApplicationInfo(ti.processName, 0);
            	// 获得该进程占用的内存  
                int[] myMempid = new int[] {ti.pid};  
                // 此MemoryInfo位于android.os.Debug.MemoryInfo包中，用来统计进程的内存信息  
                android.os.Debug.MemoryInfo[] memoryInfo =activityManager.getProcessMemoryInfo(myMempid);             
                // 获取进程占内存信息形如3.14MB  
                double memSize = memoryInfo[0].dalvikPrivateDirty/1024.0;     
                int temp = (int)(memSize*100);  
                memSize = temp/100.0;  
                listem.put("name", info.loadLabel(pm).toString()); 
                listem.put("memory", memSize); 
                listem.put("importance", ti.importance); 
                listem.put("pid", ti.pid); 
                listem.put("uid",ti.uid); 
                listem.put("processName", ti.processName);
                listems3.add(listem);  
           } catch (NameNotFoundException e) {
        	   //e.printStackTrace();
           }
		}
		ActivityManager.MemoryInfo memoryInfo = new ActivityManager.MemoryInfo();  
		activityManager.getMemoryInfo(memoryInfo) ;    
	    long memSize = memoryInfo.availMem ;
        JSONObject object = new JSONObject();
        try {
			object.put("status", true);
			object.put("leftMem", memSize);
            JSONArray jsonarray = new JSONArray();
    		for (Map<String, Object> m : listems3) {
                JSONObject jsonObj = new JSONObject();
    		    for (String k : m.keySet()) {
    		    	jsonObj.put(k, m.get(k));
    		    }
                jsonarray.put(jsonObj);
    		}
			object.put("list", jsonarray);
		} catch (JSONException e) {
			e.printStackTrace();
		}
        return object.toString();
	}
	public String killProcess(){
		final ActivityManager activityManager = (ActivityManager) mContext.getSystemService(Context.ACTIVITY_SERVICE);
		List<RunningAppProcessInfo> tasks = activityManager.getRunningAppProcesses();
		for (ActivityManager.RunningAppProcessInfo amPro : tasks){
            activityManager.killBackgroundProcesses(amPro.processName);
        }
		return "{\"status\":\"ok\"}";
	}
	public String killProcessByProcess(String name){
		final ActivityManager activityManager = (ActivityManager) mContext.getSystemService(Context.ACTIVITY_SERVICE);
        activityManager.killBackgroundProcesses(name);
		return "{\"status\":\"ok\"}";
	}
}
