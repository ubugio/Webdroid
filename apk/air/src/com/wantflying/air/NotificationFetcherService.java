package com.wantflying.air;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.app.Notification;
import android.app.PendingIntent;
import android.app.PendingIntent.CanceledException;
import android.content.pm.PackageManager.NameNotFoundException;
import android.view.accessibility.AccessibilityEvent;

import com.wantflying.server.NanoWebSocketServer;
 
public class NotificationFetcherService extends AccessibilityService {
 
    //private static final String TAG = "NotificationFetcherService: ";
	private static List<Map<String, PendingIntent>> pendIntents = new ArrayList<Map<String, PendingIntent>>();
	
	public static void triggerIntent(String pack) throws CanceledException{
		int i = 0;
		int l= pendIntents.size();
		for (i=0;i<l;i++) {
			Map<String, PendingIntent> ob = pendIntents.get(i);
			if(ob.containsKey(pack)){
				ob.get(pack).send();
				pendIntents.remove(i);
			}
		}
	}
 
    public void onAccessibilityEvent(AccessibilityEvent event) {
        if (!(event.getEventType() == AccessibilityEvent.TYPE_NOTIFICATION_STATE_CHANGED) ){
            return;
        }
 
        Notification localNotification = (Notification)event.getParcelableData();
 
        if (localNotification != null) {
            //TODO 这里处理消息信息
        	Notification notification = (Notification) localNotification;
        	if(notification.tickerText!=null){
		        List<Map<String, Object>> listems = new ArrayList<Map<String, Object>>();
	            System.out.println("********************************");
	            String text = notification.tickerText.toString();
	            String getPackage = notification.contentView.getPackage();
	            PendingIntent pendIntent = notification.contentIntent;
	            boolean hasPendIntent = false;
				if (pendIntent!=null){
    				Map<String, PendingIntent> listem = new HashMap<String, PendingIntent>();
    		        listem.put(getPackage,pendIntent);
    		        pendIntents.add(listem);
    		        hasPendIntent = true;
				}
	            System.out.println("tickerText: " + text);
				Map<String, Object> listem = new HashMap<String, Object>();
		        listem.put("tickerText", text);
				listem.put("packageName", getPackage );
				listem.put("hasPendIntent", hasPendIntent );
		        try {
					listem.put("appName", GetAppsJson.packageName(getPackage));
				} catch (NameNotFoundException e1) {
					e1.printStackTrace();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
		        listems.add(listem);

    			if(OpenNanoServerActivity.ws!=null){
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
    		            object.put("type", "notify");
    		            object.put("data", jsonarray);
    		            jsonresult = object.toString();
    		        } catch (JSONException e) {
    		            e.printStackTrace();
    		        }  
    				NanoWebSocketServer.userList.sendToAll(jsonresult);
    			}
        	}
        }
 
    }
 
    @Override
    protected void onServiceConnected() {
 
        // Define it in both xml file and here,  for compatibility with pre-ICS devices
        AccessibilityServiceInfo info = new AccessibilityServiceInfo();
        info.eventTypes = AccessibilityEvent.TYPE_NOTIFICATION_STATE_CHANGED |
                AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED | 
                AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED;
 
        info.feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC;
        setServiceInfo(info);
    }
 
    @Override
    public void onInterrupt() {
        System.out.println("onInterrupt");
    }
 
}