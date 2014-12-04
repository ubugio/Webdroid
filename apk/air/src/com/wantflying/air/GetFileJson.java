package com.wantflying.air;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;
import org.apache.http.entity.StringEntity;
import org.apache.http.message.BasicHttpEntityEnclosingRequest;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.content.Context;
import android.database.Cursor;
import android.provider.MediaStore;

public class GetFileJson {
	public static SimpleDateFormat time_n;
	public Context mcontext;
	@SuppressLint("SimpleDateFormat")
	public GetFileJson(Context context){
		mcontext=context;
		time_n = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
	}
	public String getFileList(String path){
		try {
			path = URLDecoder.decode(path,"UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		final File file = new File(path);
		if (!file.exists()) { // 不存在
			return "{\"status\":0,\"message\":\"path doesn't exists\"}";
		} else if (file.canRead()) { // 可读
			if (file.isDirectory()) { // 文件夹
				return DirList(file, path);
			} else { // 文件
				return "{\"status\":0,\"message\":\"file can't be listed\"}";
			}
		} else { // 不可读
			return "{\"status\":0,\"message\":\"access denied\"}";
		}
	}
	public String getFileTreeList(String path){
		List<Map<String, Object>> listems = new ArrayList<Map<String, Object>>();
		System.out.println(path);
		File dir = new File(path);
		File[] file = dir.listFiles();
		if (null != file) {
			sort(file); // 排序
			for (File f : file) {
				Boolean isParent = true;
				Boolean isEmpty = false;
				if (f.isDirectory()) {
					isParent=true;
				}else{
					isParent=false;
				}
				try {
					File[] files = f.listFiles();
					if(files.length > 0){
						isEmpty=false;
					}else{
						isEmpty=true;
					}
				} catch (Exception e) {
		            e.printStackTrace();
		        }
				Map<String, Object> listem = new HashMap<String, Object>();
		        listem.put("id", f.getAbsolutePath());
		        listem.put("name", f.getName());
		        listem.put("isParent", isParent);
		        listem.put("isEmpty", isEmpty);
		        listems.add(listem); 
			}
		}
		String jsonresult = "";
        try {  
            JSONArray jsonarray = new JSONArray();
    		for (Map<String, Object> m : listems) {
                JSONObject jsonObj = new JSONObject();
    		    for (String k : m.keySet()) {
    		    	jsonObj.put(k, m.get(k));
    		    }
                jsonarray.put(jsonObj);
   		}
    		jsonresult = jsonarray.toString();
        } catch (JSONException e) {  
            e.printStackTrace();  
        }  
        return jsonresult;
	}
	
	
	public void upload(String path,HttpRequest request,HttpResponse response) throws IllegalStateException, IOException {
		//获取请求实体
	  HttpEntity t=((BasicHttpEntityEnclosingRequest)request).getEntity();
	  int length=(int)t.getContentLength();
	  System.out.println(length);
	  InputStream inputStream=t.getContent();
	  ByteArrayOutputStream arrayOutputStream = new ByteArrayOutputStream();
	  int len = 0;
	  byte[] buffer = new byte[1024 * 10];
	  while((len=inputStream.read(buffer, 0, buffer.length))!=-1 ){
	      arrayOutputStream.write(buffer, 0, len);
	  }
	  byte[] data = arrayOutputStream.toByteArray();
	  arrayOutputStream.close();
	  inputStream.close();
	  FileOutputStream fileOutputStream = new FileOutputStream(path);
	  fileOutputStream.write(data);
	  fileOutputStream.close();
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Content-Type", "application/Json");
		response.setEntity(new StringEntity("{\"status\":1,\"message\":\"success\"}","UTF-8"));
	}
	public String DirList(File dir,String path){
		List<Map<String, Object>> listems = new ArrayList<Map<String, Object>>();
		/* 目录列表 */
		File[] files = dir.listFiles();
		if (null != files) {
			sort(files); // 排序
			for (File f : files) {
				appendRow(listems, f,path);
			}
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
            object.put("path", path);//向总对象里面添加包含pet的数组  
            object.put("list", jsonarray);//向总对象里面添加包含pet的数组  
            jsonresult = object.toString();//生成返回字符串  
        } catch (JSONException e) {  
            e.printStackTrace();  
        }  
        return jsonresult;
	}

	/** 排序：文件夹、文件，再各安字符顺序 */
	private void sort(File[] files) {
		Arrays.sort(files, new Comparator<File>() {
			@Override
			public int compare(File f1, File f2) {
				if (f1.isDirectory() && !f2.isDirectory()) {
					return -1;
				} else if (!f1.isDirectory() && f2.isDirectory()) {
					return 1;
				} else {
					return f1.toString().compareToIgnoreCase(f2.toString());
				}
			}
		});
	}

	private void appendRow(List<Map<String, Object>> listems, File f,String path) {
		String clazz, link,size,name,clazz_ext;
		name = f.getName();
		if (f.isDirectory()) {
			clazz_ext="dirempty";
			try {
				File[] files = f.listFiles();
				if(files.length > 0){
					clazz_ext="dir";
				}
			} catch (Exception e) {
	            e.printStackTrace();
	        }
			clazz = "dir";
			link = path+"/"+name;
			size = "";
		} else {
			if(name.endsWith(".jpg")||name.endsWith(".jpeg")||name.endsWith(".png")||name.endsWith(".bmp")||name.endsWith(".gif")){
				clazz_ext="image";
			}else if(name.endsWith(".mp4")||name.endsWith(".avi")||name.endsWith(".m4v")||name.endsWith(".rmvb")||name.endsWith(".wmv")||name.endsWith(".rm")||name.endsWith(".3gp")){
				clazz_ext="video";
			}else if(name.endsWith(".mp3")||name.endsWith(".m4a")||name.endsWith(".wav")||name.endsWith(".ogg")||name.endsWith(".mid")||name.endsWith(".amr")||name.endsWith(".awb")||name.endsWith(".wma")){
				clazz_ext="mp3";
			}else if(name.endsWith(".zip")||name.endsWith(".rar")||name.endsWith(".7z")){
				clazz_ext="zip";
			}else if(name.endsWith(".xls")||name.endsWith(".xlsx")||name.endsWith(".ppt")||name.endsWith(".pptx")||name.endsWith(".doc")||name.endsWith(".docx")||name.endsWith(".et")||name.endsWith(".wps")||name.endsWith(".dps")){
				clazz_ext="office";
			}else if(name.endsWith(".apk")){
				clazz_ext="apk";
			}else if(name.endsWith(".pdf")){
				clazz_ext="pdf";
			}else if(name.endsWith(".txt")||name.endsWith(".log")||name.endsWith(".xml")||name.endsWith(".chm")){
				clazz_ext="txt";
			}else{
				clazz_ext="default";
			}
			clazz = "file";
			link = path+"/"+name;
			size = String.valueOf(f.length());
		}
		Map<String, Object> listem = new HashMap<String, Object>();
        listem.put("name", name);
        listem.put("lastModified", time_n.format(f.lastModified()));
        listem.put("link", link);
        listem.put("type", clazz);
        listem.put("type_ext", clazz_ext);
        listem.put("size", size);
        listems.add(listem);  
	}
	public String musicList(String limit,String offset){
	    Cursor cursor = mcontext.getContentResolver().query(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,null, null, null,MediaStore.Audio.Media.DEFAULT_SORT_ORDER+" limit "+limit+" offset "+offset);
		List<Map<String, Object>> listems = new ArrayList<Map<String, Object>>();
		if(cursor.moveToFirst()){
		    do{
		    	String name = cursor.getString(cursor.getColumnIndex(MediaStore.Audio.Media.DISPLAY_NAME));
		    	String album = cursor.getString(cursor.getColumnIndex(MediaStore.Audio.Media.ALBUM));
		    	String artist = cursor.getString(cursor.getColumnIndex(MediaStore.Audio.Media.ARTIST));
		    	String size = cursor.getString(cursor.getColumnIndex(MediaStore.Audio.Media.SIZE));
		    	String title = cursor.getString(cursor.getColumnIndex(MediaStore.Audio.Media.TITLE));
		    	String id = cursor.getString(cursor.getColumnIndex(MediaStore.Audio.Media._ID));
		    	String duration = cursor.getString(cursor.getColumnIndex(MediaStore.Audio.Media.DURATION));
				Map<String, Object> listem = new HashMap<String, Object>();
		        listem.put("name", name);listem.put("album", album);
		        listem.put("artist", artist);listem.put("size", size);
		        listem.put("title", title);listem.put("id", id);
		        listem.put("duration", duration);listems.add(listem);  
		    }while(cursor.moveToNext());
		}
		cursor.close();
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
            object.put("musics", jsonarray);
            jsonresult = object.toString();
        } catch (JSONException e) {
            e.printStackTrace();  
        }  
        return jsonresult;  
	}
	public String imagesList(String bucketname,String limit,String offset){
	    Cursor cursor = mcontext.getContentResolver().query(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,null, MediaStore.Images.Media.BUCKET_DISPLAY_NAME+"=\""+bucketname+"\"", null,MediaStore.Images.Media.DATE_MODIFIED + " desc limit "+limit+" offset "+offset);
		List<Map<String, Object>> listems = new ArrayList<Map<String, Object>>();
		if(cursor.moveToFirst()){
		    do{
		    	String name = cursor.getString(cursor.getColumnIndex(MediaStore.Images.Media.DISPLAY_NAME));
		    	String bucket = cursor.getString(cursor.getColumnIndex(MediaStore.Images.Media.BUCKET_DISPLAY_NAME));
		    	String size = cursor.getString(cursor.getColumnIndex(MediaStore.Images.Media.SIZE));
		    	String width = cursor.getString(cursor.getColumnIndex(MediaStore.Images.Media.WIDTH));
		    	String height = cursor.getString(cursor.getColumnIndex(MediaStore.Images.Media.HEIGHT));
		    	String mdate = cursor.getString(cursor.getColumnIndex(MediaStore.Images.Media.DATE_MODIFIED));
		    	String tdate = cursor.getString(cursor.getColumnIndex(MediaStore.Images.Media.DATE_TAKEN));
		    	String id = cursor.getString(cursor.getColumnIndex(MediaStore.Images.Media._ID));
		    	String url = cursor.getString(cursor.getColumnIndex(MediaStore.Images.Media.DATA));
				Map<String, Object> listem = new HashMap<String, Object>();
		        listem.put("name", name);listem.put("size", size);listem.put("id", id);
		        listem.put("width", width);listem.put("height", height);listem.put("tdate", tdate);
		        listem.put("date", mdate);listem.put("bucket", bucket);listem.put("url", url);
		        listems.add(listem);  
		    }while(cursor.moveToNext());
		}
		cursor.close();
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
            object.put("images", jsonarray);
            jsonresult = object.toString();
        } catch (JSONException e) {
            e.printStackTrace();  
        }  
        return jsonresult;  
	}
	public String videosList(String bucketname,String limit,String offset){
	    Cursor cursor = mcontext.getContentResolver().query(MediaStore.Video.Media.EXTERNAL_CONTENT_URI,null, MediaStore.Video.Media.BUCKET_DISPLAY_NAME+"=\""+bucketname+"\"", null,MediaStore.Video.Media.DATE_MODIFIED + " desc limit "+limit+" offset "+offset);
		List<Map<String, Object>> listems = new ArrayList<Map<String, Object>>();
		if(cursor.moveToFirst()){
		    do{
		    	String name = cursor.getString(cursor.getColumnIndex(MediaStore.Video.Media.DISPLAY_NAME));
		    	String bucket = cursor.getString(cursor.getColumnIndex(MediaStore.Video.Media.BUCKET_DISPLAY_NAME));
		    	String size = cursor.getString(cursor.getColumnIndex(MediaStore.Video.Media.SIZE));
		    	String width = cursor.getString(cursor.getColumnIndex(MediaStore.Video.Media.WIDTH));
		    	String height = cursor.getString(cursor.getColumnIndex(MediaStore.Video.Media.HEIGHT));
		    	String mdate = cursor.getString(cursor.getColumnIndex(MediaStore.Video.Media.DATE_MODIFIED));
		    	String tdate = cursor.getString(cursor.getColumnIndex(MediaStore.Video.Media.DATE_TAKEN));
		    	String id = cursor.getString(cursor.getColumnIndex(MediaStore.Video.Media._ID));
		    	String url = cursor.getString(cursor.getColumnIndex(MediaStore.Video.Media.DATA));
				Map<String, Object> listem = new HashMap<String, Object>();
		        listem.put("name", name);listem.put("size", size);listem.put("id", id);
		        listem.put("width", width);listem.put("height", height);listem.put("tdate", tdate);
		        listem.put("date", mdate);listem.put("bucket", bucket);listem.put("url", url);
		        listems.add(listem);  
		    }while(cursor.moveToNext());
		}
		cursor.close();
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
            object.put("videos", jsonarray);
            jsonresult = object.toString();
        } catch (JSONException e) {
            e.printStackTrace();  
        }  
        return jsonresult;  
	}
	public String imageGroups(){
	    Cursor cursor = mcontext.getContentResolver().query(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,new String[]{MediaStore.Images.Media.BUCKET_DISPLAY_NAME,"COUNT(*)",MediaStore.Images.Media._ID}, "1) GROUP BY ("+MediaStore.Images.Media.BUCKET_DISPLAY_NAME+"", null,null);
		List<Map<String, Object>> listems = new ArrayList<Map<String, Object>>();
		if(cursor.moveToFirst()){
		    do{
		    	String bucket = cursor.getString(0);
		    	String num = cursor.getString(1);
		    	String first = cursor.getString(2);
				Map<String, Object> listem = new HashMap<String, Object>();
		        listem.put("bucket",bucket);
		        listem.put("num",num);
		        listem.put("first",first);
		        listems.add(listem);
		    }while(cursor.moveToNext());
		}
		cursor.close();
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
            object.put("images", jsonarray);
            jsonresult = object.toString();
        } catch (JSONException e) {
            e.printStackTrace();  
        }  
        return jsonresult;  
	}
	public String videoGroups(){
	    Cursor cursor = mcontext.getContentResolver().query(MediaStore.Video.Media.EXTERNAL_CONTENT_URI,new String[]{MediaStore.Video.Media.BUCKET_DISPLAY_NAME,"COUNT(*)",MediaStore.Video.Media._ID}, "1) GROUP BY ("+MediaStore.Video.Media.BUCKET_DISPLAY_NAME+"", null,null);
		List<Map<String, Object>> listems = new ArrayList<Map<String, Object>>();
		if(cursor.moveToFirst()){
		    do{
		    	String bucket = cursor.getString(0);
		    	String num = cursor.getString(1);
		    	String first = cursor.getString(2);
				Map<String, Object> listem = new HashMap<String, Object>();
		        listem.put("bucket",bucket);
		        listem.put("num",num);
		        listem.put("first",first);
		        listems.add(listem);
		    }while(cursor.moveToNext());
		}
		cursor.close();
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
            object.put("videos", jsonarray);
            jsonresult = object.toString();
        } catch (JSONException e) {
            e.printStackTrace();  
        }  
        return jsonresult;  
	}
}
