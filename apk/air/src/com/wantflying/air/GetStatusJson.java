package com.wantflying.air;

import java.io.File;
import java.util.Locale;

import org.json.JSONException;
import org.json.JSONObject;

import android.content.BroadcastReceiver;
import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.net.Uri;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.BatteryManager;
import android.os.Build.VERSION;
import android.os.Environment;
import android.os.StatFs;
import android.provider.ContactsContract;
import android.provider.MediaStore;
import android.telephony.TelephonyManager;
import android.util.DisplayMetrics;

import com.wantflying.server.NanoWebSocketServer;

public class GetStatusJson {
    private BroadcastReceiver batteryLevelRcvr;
    private IntentFilter batteryLevelFilter;
    static Context mcontext;

    //private String size_ext_sd_avail="0";
    //private String size_ext_sd="0";
    private String size_sd="0";
    private String size_sys="0";
    private String size_sd_avail="0";
    private String size_sys_avail="0";
    private String size_musics="0";
    private String size_images="0";
    private String size_videos="0";

    private String num_musics="0";
    private String num_images="0";
    private String num_videos="0";
    private String num_apps="0";
    private String num_contacts="0";
    private String num_sms="0";

    private String info_network_IP="0.0.0.0";
    private String info_network_isConn="";
    private String info_network_type="";
    private String info_network_typename="";
    private String info_network_Netname="";
    private String info_network_isWIFI="";
    private String info_wifi_mac="";
    private String info_wifi_status="";
    private String info_wifi_ssid="";
    private String info_wifi_RSSI="";
    private String info_wifi_RSSI_level="";
    private String info_wifi_ip="0.0.0.0";
    @SuppressWarnings("deprecation")
	private String info_sdklevel=VERSION.SDK;
    private String info_language=Locale.getDefault().getLanguage();
    private String info_location=Locale.getDefault().getCountry();
    private String info_model=android.os.Build.BRAND+" "+android.os.Build.MODEL;
    private String info_screen_size="";
    private String info_osversion="Android "+VERSION.RELEASE;
    private String info_gsm_signal_asu="";
    private String info_gsm_signal_dbm="";
    private String info_battery_status="";
    private String info_battery="";
    private String info_IMEI="";
    private String info_ProvidersName="";
    private String info_NativePhoneNumber="";
    private String info_clipboard="";

    private String sys_websocket_port=String.valueOf(OpenNanoServerActivity.port);
    
    
	public GetStatusJson(Context context) {
		mcontext=context;
	    info_IMEI=getDeviceId();
	    
	    info_ProvidersName=getProvidersName();
	    info_NativePhoneNumber=getNativePhoneNumber();
	    getDisplayMetrics();
	    monitorBatteryState();
	}


	public String getJson(){
	    //size_ext_sd="0";
	    size_sd=getSDTotalSize();
	    size_sys=getRomTotalSize();
	    //size_ext_sd_avail="0";
	    size_sd_avail=getSDAvailableSize();
	    size_sys_avail=getRomAvailableSize();
	    info_clipboard=getClipboard();
	    getNetWorkInfo();
	    getWifiInfo();
	    ScannerVideos();
	    ScannerMusic();
	    ScannerPics();
	    scanApps();
	    scanContacts();
	    scanSMSs();
	    phoneState();

        JSONObject size = new JSONObject();
        try {
        	size.put("sd_avail", size_sd_avail);
        	size.put("sd_size", size_sd);
        	size.put("sys_avail", size_sys_avail);
        	size.put("sys_size", size_sys);
        	size.put("music", size_musics);
        	size.put("photo", size_images);
        	size.put("video", size_videos);
		} catch (JSONException e) {
			e.printStackTrace();
		}
        JSONObject num = new JSONObject();
        try {
        	num.put("app", num_apps);
        	num.put("contacts", num_contacts);
        	num.put("sms", num_sms);
        	num.put("music", num_musics);
        	num.put("photo", num_images);
        	num.put("video", num_videos);
		} catch (JSONException e) {
			e.printStackTrace();
		}
        JSONObject info = new JSONObject();
        try {
        	info.put("network_IP", info_network_IP);
        	info.put("network_isConn", info_network_isConn);
        	info.put("network_type", info_network_type);
	        info.put("network_typename", info_network_typename);
	        info.put("network_Netname", info_network_Netname);
	        info.put("network_isWIFI", info_network_isWIFI);
	        info.put("wifi_mac", info_wifi_mac);
	        info.put("wifi_status", info_wifi_status);
	        info.put("wifi_ssid", info_wifi_ssid);
	        info.put("wifi_RSSI", info_wifi_RSSI);
	        info.put("wifi_RSSI_level", info_wifi_RSSI_level);
	        info.put("wifi_ip", info_wifi_ip);
	        info.put("sdklevel", info_sdklevel);
	        info.put("language", info_language);
	        info.put("location", info_location);
	        info.put("model", info_model);
	        info.put("screen_size", info_screen_size);
	        info.put("osversion", info_osversion);
	        info.put("gsm_signal_asu", info_gsm_signal_asu);
	        info.put("gsm_signal_dbm", info_gsm_signal_dbm);
	        info.put("battery_status", info_battery_status);
	        info.put("battery", info_battery);
	        info.put("IMEI", info_IMEI);
	        info.put("ProvidersName", info_ProvidersName);
	        info.put("NativePhoneNumber", info_NativePhoneNumber);
	        info.put("clipboard", info_clipboard);
		} catch (JSONException e) {
			e.printStackTrace();
		}
	    String temp2 = "";
        JSONObject ret = new JSONObject();
        try {
			ret.put("size", size);
	        ret.put("num", num);
	        ret.put("info", info);
	        ret.put("websocket_port", sys_websocket_port);
		} catch (JSONException e) {
			e.printStackTrace();
		}
        temp2 = ret.toString();
	    return temp2;
	}
	public String getStatus(){
	    getNetWorkInfo();
	    getWifiInfo();
	    phoneState();

	    String temp = "";
        JSONObject object = new JSONObject();
        try {
			object.put("network_IP", info_network_IP);
	        object.put("network_isConn", info_network_isConn);
	        object.put("network_type", info_network_type);
	        object.put("network_typename", info_network_typename);
	        object.put("network_Netname", info_network_Netname);
	        object.put("network_isWIFI", info_network_isWIFI);
	        object.put("wifi_mac", info_wifi_mac);
	        object.put("wifi_status", info_wifi_status);
	        object.put("wifi_ssid", info_wifi_ssid);
	        object.put("wifi_RSSI", info_wifi_RSSI);
	        object.put("wifi_RSSI_level", info_wifi_RSSI_level);
	        object.put("wifi_ip", info_wifi_ip);
	        object.put("gsm_signal_asu", info_gsm_signal_asu);
	        object.put("gsm_signal_dbm", info_gsm_signal_dbm);
	        object.put("battery_status", info_battery_status);
	        object.put("battery", info_battery);
		} catch (JSONException e) {
			e.printStackTrace();
		}
        temp = object.toString();

	    return temp;
	}
	public void pushStatus(){
		NanoWebSocketServer.userList.sendToAll("{\"type\":\"status\",\"data\":"+getStatus()+"}");
	}
	
    protected void onDestroy() {
    	mcontext.unregisterReceiver(batteryLevelRcvr);
    }
    
    private void monitorBatteryState() {
        batteryLevelRcvr = new BroadcastReceiver() {
            public void onReceive(Context context, Intent intent) {
                int rawlevel = intent.getIntExtra("level", -1);
                int scale = intent.getIntExtra("scale", -1);
                int status = intent.getIntExtra("status", -1);
                int health = intent.getIntExtra("health", -1);
                int level = -1; // percentage, or -1 for unknown
                if (rawlevel >= 0 && scale > 0) {
                    level = (rawlevel * 100) / scale;
                }
                if (BatteryManager.BATTERY_HEALTH_OVERHEAT == health) {
                	info_battery_status = "battery overheat";
                } else {
                    switch (status) {
                        case BatteryManager.BATTERY_STATUS_UNKNOWN:
                        	info_battery_status="no battery";
                            break;
                        case BatteryManager.BATTERY_STATUS_CHARGING:
                        	info_battery_status="charging";
                        	info_battery=String.valueOf(level);
                            break;
                        case BatteryManager.BATTERY_STATUS_DISCHARGING:
                        case BatteryManager.BATTERY_STATUS_NOT_CHARGING:
                            	info_battery_status="not charging";
                            	info_battery=String.valueOf(level);
                            break;
                        case BatteryManager.BATTERY_STATUS_FULL:
                        	info_battery_status="fully charged";
                        	info_battery=String.valueOf(level);
                            break;
                        default:
                        	info_battery_status="unknow";
                        	info_battery=String.valueOf(level);
                            break;
                    }
                }
                pushStatus();
            }
        };
        batteryLevelFilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        mcontext.registerReceiver(batteryLevelRcvr, batteryLevelFilter);
		return;
    }
    private void phoneState(){
    	int temp = OpenNanoServerActivity.info_gsm_signal_asu;
    	info_gsm_signal_asu = String.valueOf(temp);
    	info_gsm_signal_dbm = String.valueOf(-113+2*temp);
    }

        @SuppressWarnings("deprecation")
    private String getSDTotalSize() {  
        File path = Environment.getExternalStorageDirectory();  
        StatFs stat = new StatFs(path.getPath());  
		long blockSize = stat.getBlockSize();  
        long totalBlocks = stat.getBlockCount();  
        return String.valueOf(blockSize * totalBlocks);  
    }  

        @SuppressWarnings("deprecation")
    private String getSDAvailableSize() {  
        File path = Environment.getExternalStorageDirectory();  
        StatFs stat = new StatFs(path.getPath());  
        long blockSize = stat.getBlockSize();  
        long availableBlocks = stat.getAvailableBlocks();  
        return String.valueOf(blockSize * availableBlocks);  
    }  

        @SuppressWarnings("deprecation")
    private String getRomTotalSize() {  
        File path = Environment.getDataDirectory();  
        StatFs stat = new StatFs(path.getPath());  
        long blockSize = stat.getBlockSize();  
        long totalBlocks = stat.getBlockCount();  
        return String.valueOf(blockSize * totalBlocks);  
    }  

        @SuppressWarnings("deprecation")
    private String getRomAvailableSize() {  
        File path = Environment.getDataDirectory();  
        StatFs stat = new StatFs(path.getPath());  
        long blockSize = stat.getBlockSize();  
        long availableBlocks = stat.getAvailableBlocks();  
        return String.valueOf(blockSize * availableBlocks);  
    }   
    
    private void getWifiInfo(){
        WifiManager wifi = (WifiManager) mcontext.getSystemService(Context.WIFI_SERVICE);
        WifiInfo info = wifi.getConnectionInfo();
        String maxText = info.getMacAddress();
        String ipText = intToIp(info.getIpAddress());
        String status = "";
        switch (wifi.getWifiState()) { 
	        case WifiManager.WIFI_STATE_DISABLING: 
	            status = "DISABLING"; 
	            break; 
	        case WifiManager.WIFI_STATE_DISABLED: 
	            status = "DISABLED"; 
	            break; 
	        case WifiManager.WIFI_STATE_ENABLING: 
	            status = "ENABLING"; 
	            break; 
	        case WifiManager.WIFI_STATE_ENABLED: 
	            status = "ENABLED"; 
	            break; 
	        case WifiManager.WIFI_STATE_UNKNOWN: 
	            status = "UNKNOWN"; 
	            break; 
	    } 
        int rssi = info.getRssi();
        String level = null;
        if(rssi>-55)level = "4/4";
        else if(rssi>-70)level = "3/4";
        else if(rssi>-85)level = "2/4";
        else if(rssi>-100)level = "1/4";
        else if(rssi<=-100)level = "0/4";
        info_wifi_mac=maxText;
        info_wifi_status=status;
        info_wifi_ssid=info.getSSID();
        info_wifi_RSSI=String.valueOf(rssi);
        info_wifi_RSSI_level=level;
        info_wifi_ip=ipText;
        
    }
    private String intToIp(int ip)  {  
    	return (ip & 0xFF) + "." + ((ip >> 8) & 0xFF) + "." + ((ip >> 16) & 0xFF) + "."  
    	+ ((ip >> 24) & 0xFF);  
    }
    
    public void getNetWorkInfo(){
    	NetWorkUtil net = new NetWorkUtil(mcontext.getApplicationContext());
        info_network_IP=NetWorkUtil.getIPAddress();
        info_network_isConn=String.valueOf(NetWorkUtil.isConnectInternet(mcontext.getApplicationContext()));
        info_network_type=net.getExtraInfo();
        info_network_Netname=net.getNetTypeName();
        info_network_typename=net.getConnTypeName();
        info_network_isWIFI=String.valueOf(NetWorkUtil.isConnectWifi(mcontext.getApplicationContext()));
    }
    public void getDisplayMetrics() {
    	DisplayMetrics dm = new DisplayMetrics();
    	dm = mcontext.getApplicationContext().getApplicationContext().getResources().getDisplayMetrics();
    	info_screen_size=String.valueOf(dm.widthPixels)+ "X"+String.valueOf(dm.heightPixels) ;
    }
    public String getDeviceId() {
    	TelephonyManager tm = (TelephonyManager) mcontext.getApplicationContext()
    			.getSystemService(Context.TELEPHONY_SERVICE);
    	return tm.getDeviceId();
    }
    public String getNativePhoneNumber() {
    	TelephonyManager tm = (TelephonyManager) mcontext.getApplicationContext()
    			.getSystemService(Context.TELEPHONY_SERVICE);  
        String NativePhoneNumber=null;  
        NativePhoneNumber=tm.getLine1Number();  
        return NativePhoneNumber;  
    }  
    public String getProvidersName() {  
    	TelephonyManager tm = (TelephonyManager) mcontext.getApplicationContext()
    			.getSystemService(Context.TELEPHONY_SERVICE);  
        String ProvidersName = null;  
        // 返回唯一的用户ID;就是这张卡的编号神马的  
        String IMSI = tm.getSubscriberId();  
        // IMSI号前面3位460是国家，紧接着后面2位00 02是中国移动，01是中国联通，03是中国电信。  
        System.out.println(IMSI);  
        if (IMSI.startsWith("46000") || IMSI.startsWith("46002")) {  
            ProvidersName = "中国移动";  
        } else if (IMSI.startsWith("46001")) {  
            ProvidersName = "中国联通";  
        } else if (IMSI.startsWith("46003")) {  
            ProvidersName = "中国电信";  
        }  
        return ProvidersName;  
    }  

    public static String getClipboard()  {  
    // 得到剪贴板管理器  
	    if (OpenNanoServerActivity.cmb.hasPrimaryClip()){
	    	JSONObject object = new JSONObject();
	    	String str = String.valueOf(OpenNanoServerActivity.cmb.getPrimaryClip().getItemAt(0).getText());
	    	try {
				object.put("",str);
			} catch (JSONException e) {
				e.printStackTrace();
			}//向总对象里面添加包含pet的数组  
	    	str = object.toString();
	    	str = str.substring(5, str.length()-2);
	    	return str;//生成返回字符串  
	    }
	    return null;
    } 
    public String setClipboard(String str)  {
	    OpenNanoServerActivity.cmb.setPrimaryClip(ClipData.newPlainText(null, str));
	    return "{\"status\":\"ok\"}";
    } 
    
	public void ScannerMusic(){
	    Cursor cursor = mcontext.getContentResolver().query(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,new String[]{"total(_size)"}, null, null,null);
	    cursor.moveToFirst();
	    size_musics=String.valueOf(cursor.getLong(0));
	    System.out.println(size_musics);
	    Cursor cursor2 = mcontext.getContentResolver().query(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,null, null, null,null);
	    num_musics=String.valueOf(cursor2.getCount());
	    System.out.println(num_musics);
        cursor.close();
        cursor2.close();
	}
	public void ScannerVideos(){
	    Cursor cursor = mcontext.getContentResolver().query(MediaStore.Video.Media.EXTERNAL_CONTENT_URI,new String[]{"total(_size)"}, null, null,null);
	    cursor.moveToFirst();
	    size_videos=String.valueOf(cursor.getLong(0));
	    Cursor cursor2 = mcontext.getContentResolver().query(MediaStore.Video.Media.EXTERNAL_CONTENT_URI,null, null, null,null);
	    num_videos=String.valueOf(cursor2.getCount());
	    cursor.close();
        cursor2.close();
	}
	public void ScannerPics(){
	    Cursor cursor = mcontext.getContentResolver().query(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,new String[]{"total(_size)"}, null, null,null);
	    cursor.moveToFirst();
	    size_images=String.valueOf(cursor.getLong(0));
	    Cursor cursor2 = mcontext.getContentResolver().query(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,null, null, null,null);
	    num_images=String.valueOf(cursor2.getCount());
        cursor.close();
        cursor2.close();
	}

	public void scanApps(){
		num_apps = String.valueOf(mcontext.getPackageManager().getInstalledPackages(0).size());
	}
	public void scanContacts(){
		Cursor cursor = mcontext.getContentResolver().query(ContactsContract.Contacts.CONTENT_URI, null, null, null, null);
		num_contacts = String.valueOf(cursor.getCount());
        cursor.close();
	}
	public void scanSMSs(){
		Cursor cursor = mcontext.getContentResolver().query(Uri.parse("content://sms/"), null, null, null, null);
		num_sms = String.valueOf(cursor.getCount());
        cursor.close();
	}
	
}
