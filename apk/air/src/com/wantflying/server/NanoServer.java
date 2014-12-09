package com.wantflying.server;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Map;
import java.util.Vector;

import android.app.PendingIntent.CanceledException;
import android.content.Context;
import android.content.pm.PackageManager.NameNotFoundException;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.ThumbnailUtils;
import android.os.Environment;
import android.provider.MediaStore;

import com.wantflying.air.CameraStart;
import com.wantflying.air.GetAppsJson;
import com.wantflying.air.GetContactsJson;
import com.wantflying.air.GetFileJson;
import com.wantflying.air.GetPhoneJson;
import com.wantflying.air.GetRunStatusJson;
import com.wantflying.air.GetSmsJson;
import com.wantflying.air.GetStatusJson;
import com.wantflying.air.NotificationFetcherService;
import com.wantflying.air.ScreenShot;
import com.wantflying.server.NanoHTTPD.Response.Status;

public class NanoServer extends NanoHTTPD {
	public static Context mcontext;
	public static GetStatusJson StatusJson=null;
	public static GetContactsJson ContactsJson=null;
	public static GetAppsJson AppsJson=null;
	public static GetFileJson FileJson=null;
	public static GetSmsJson SmsJson=null;
	public static GetPhoneJson PhoneJson=null;
	public static ScreenShot screenShot=null;
	public static runCommond cmd=null;
	public static ShellUtil shell=null;
	public static GetRunStatusJson runStatus=null;
	
	public static final String HTML_SUCCESS_STRING = "<html>"
			+ "<head><title>Air</title></head>"
			+ "<body>"
			+ "upload Success !</body></html>";
	public static Process sh=null;
	Vector<Integer> screen;
	
	public NanoServer(int port,Context context) {
		super(port);
		mcontext = context;
		checkAirDirs();
		StatusJson = new GetStatusJson(mcontext);
		screen = StatusJson.getDisplayMetrics();
		ContactsJson = new GetContactsJson(mcontext);
		AppsJson = new GetAppsJson(mcontext);
		FileJson = new GetFileJson(mcontext);
		SmsJson = new GetSmsJson(mcontext);
		PhoneJson = new GetPhoneJson(mcontext);
		shell = ShellUtil.getInstance();
		cmd = new runCommond(shell);
		runStatus = new GetRunStatusJson(mcontext);
	}
	public static void checkAirDirs(){
		String airDir = Environment.getExternalStorageDirectory().getPath()+ File.separator +"air";
		File file = new File(airDir);
    	if(file.exists() && file.isDirectory()){
    		File file2 = new File(airDir+ File.separator +"screens");
        	if(!(file2.exists() && file2.isDirectory())){
        		file2.mkdir();
        	}
    	}else{
    		file.mkdir();
        }
	}
	public static File getFile(String fileFullPath) {
		File f = new File(fileFullPath);
		if (!f.exists()) {
			try {
				f.createNewFile();
			} catch (Exception e) {
				return null;
			}
		}
		return f;
	}

	@Override
	public Response serve(String uri, Method method,Map<String, String> header, Map<String, String> parms,Map<String, String> files) {
		String output = null;
		int status = 1;
		if(parms.containsKey("mode")){
			if(parms.get("mode").equals("device")){
				if(parms.containsKey("action")){
					if(parms.get("action").equals("overview")){
						output = devie_overview();
					}else if(parms.get("action").equals("openNotify")){
						try {
							NotificationFetcherService.triggerIntent(parms.get("activity"));
						} catch (CanceledException e) {
							e.printStackTrace();
						}
						output = "{\"status\":\"ok\"}";
					}else if(parms.get("action").equals("answerPhone")){
						GetPhoneJson.answserCall();
						output = "{\"status\":\"ok\"}";
					}else if(parms.get("action").equals("endCall")){
						GetPhoneJson.endCall();
						output = "{\"status\":\"ok\"}";
					}else if(parms.get("action").equals("status")){
						output = devie_status();
					}else if(parms.get("action").equals("contacts")){
						output = devie_contacts();
					}else if(parms.get("action").equals("addContact")){
						output = ContactsJson.addNewContact(parms.get("name"), parms.get("phone"));
					}else if(parms.get("action").equals("phones")){
						output = devie_phones();
					}else if(parms.get("action").equals("apps")){
						output = devie_apps();
					}else if(parms.get("action").equals("files")){
						if(parms.containsKey("path")){
							output = FileJson.getFileList(parms.get("path"));
						}
					}else if(parms.get("action").equals("fileList")){
						if(parms.containsKey("beginPath")){
							String ext = parms.get("beginPath");
							if(parms.get("path")!=null){
								ext = parms.get("path");
							}
							output = FileJson.getFileTreeList(ext);
						}
					}else if(parms.get("action").equals("clipboard")){
						if(parms.containsKey("text")){
							output = StatusJson.setClipboard(parms.get("text"));
						}
					}else if(parms.get("action").equals("call")){
						if(parms.containsKey("num")){
							output = PhoneJson.callNum(parms.get("num"));
						}
					}else if(parms.get("action").equals("musics")){
						if(parms.containsKey("limit")&&parms.containsKey("offset")){
							output = FileJson.musicList(parms.get("limit"),parms.get("offset"));
						}
					}else if(parms.get("action").equals("images")){
						if(parms.containsKey("limit")&&parms.containsKey("offset")&&parms.containsKey("bucketname")){
							output = FileJson.imagesList(parms.get("bucketname"),parms.get("limit"),parms.get("offset"));
						}
					}else if(parms.get("action").equals("videos")){
						if(parms.containsKey("limit")&&parms.containsKey("offset")&&parms.containsKey("bucketname")){
							output = FileJson.videosList(parms.get("bucketname"),parms.get("limit"),parms.get("offset"));
						}
					}else if(parms.get("action").equals("sms")){
						if(parms.containsKey("limit")&&parms.containsKey("offset")&&parms.containsKey("threadid")){
							output = SmsJson.getSmsfromthreadid(parms.get("threadid"),parms.get("limit"),parms.get("offset"));
						}
					}else if(parms.get("action").equals("sendsms")){
						if(parms.containsKey("number")&&parms.containsKey("text")){
							output = SmsJson.sendSMS(parms.get("number"),parms.get("text"),parms.get("id"));
						}
					}else if(parms.get("action").equals("image_groups")){
						output = FileJson.imageGroups();
					}else if(parms.get("action").equals("video_groups")){
						output = FileJson.videoGroups();
					}else if(parms.get("action").equals("sms_groups")){
						output = SmsJson.getSmsGroups();
					}else if(parms.get("action").equals("camera")){
						new CameraStart(mcontext).shoot();
						output = "success";
					}else{
						output ="<html><body><h1>当前动作不存在</h1></body></html>";
						status = 0;
					}
				}else{
					output = devie_overview();
				}

				Response ret = new Response(output);
				if(status == 1)
					ret.setMimeType("application/Json");
				ret.addHeader("Cache-control", "no-cache");
				ret.addHeader("Access-Control-Allow-Origin", "*");
				return ret;
				
			}else if(parms.get("mode").equals("image")){
				if(parms.containsKey("phoneid")){
					final Long ContactId =  Long.parseLong(parms.get("phoneid"));
					Response ret = new Response(Status.OK, "image/png",ContactsJson.contactHead(ContactId));
					ret.addHeader("Cache-control", "max-age=3600");
					ret.addHeader("Access-Control-Allow-Origin", "*");
					return ret;
				}else if(parms.containsKey("package")){
					final String packagename =  parms.get("package");
					InputStream is = null;
					try {
						is = GetAppsJson.packageHead(packagename);
					} catch (NameNotFoundException e) {
						e.printStackTrace();
					} catch (IOException e) {
						e.printStackTrace();
					}
					Response ret = new Response(Status.OK, "image/png",is);
					ret.addHeader("Cache-control", "max-age=3600");
					ret.addHeader("Access-Control-Allow-Origin", "*");
					return ret;
				}else if(parms.containsKey("packagepath")){
					final String apkPath =  parms.get("packagepath");
					InputStream is = null;
					try {
						is = GetAppsJson.packageHeadFromPath(apkPath);
					} catch (NameNotFoundException e) {
						e.printStackTrace();
					} catch (IOException e) {
						e.printStackTrace();
					}
					Response ret = new Response(Status.OK, "image/png",is);
					ret.addHeader("Cache-control", "max-age=3600");
					ret.addHeader("Access-Control-Allow-Origin", "*");
					return ret;
				}else{}
				
				
				
			}else if(parms.get("mode").equals("download")){
				if(parms.get("action").equals("file")){
					if(parms.containsKey("path")){
						InputStream in = null;
						File file = new File(parms.get("path"));
						try {
							if (file.exists()&&file.canRead()&&!file.isDirectory()) {
								in = new FileInputStream(file);
							}
						} catch (FileNotFoundException e) {
							e.printStackTrace();
						}
						Response ret = new Response(Status.OK, "application/octet-stream",in);
						ret.addHeader("Cache-control", "no-cache");
						ret.addHeader("Access-Control-Allow-Origin", "*");
						try {
							ret.addHeader("Content-Disposition", "attachment;filename="+URLEncoder.encode(file.getName(), "UTF-8"));
						} catch (UnsupportedEncodingException e) {
							e.printStackTrace();
						}
						return ret;
					}
				}else if(parms.get("action").equals("music")){
					if(parms.containsKey("id")){
						String id = parms.get("id");
						String url="";
					    Cursor cursor = mcontext.getContentResolver().query(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,new String[] {MediaStore.Audio.Media.DATA }, MediaStore.Audio.Media._ID + "=" + id, null,null);
						if(cursor.moveToFirst()){
						    	url = cursor.getString(0);
						}
						cursor.close();
						InputStream in = null;
						File file = new File(url);
						try {
							if (file.exists()&&file.canRead()&&!file.isDirectory()) {
								in = new FileInputStream(file);
							}
						} catch (FileNotFoundException e) {
							e.printStackTrace();
						}
						Response ret = new Response(Status.OK, "application/octet-stream",in);
						ret.addHeader("Cache-control", "no-cache");
						ret.addHeader("Access-Control-Allow-Origin", "*");
						try {
							ret.addHeader("Content-Disposition", "attachment;filename="+URLEncoder.encode(file.getName(), "UTF-8"));
						} catch (UnsupportedEncodingException e) {
							e.printStackTrace();
						}
						return ret;
					}
				}
			}else if(parms.get("mode").equals("upload")){
				if(parms.get("action").equals("file")){
					if(parms.containsKey("path")){
						for (String s : files.keySet()) {
							try {
								FileInputStream fis = new FileInputStream(files.get(s));
								FileOutputStream fos = new FileOutputStream(getFile(parms.get("path")));//+"/"+ parms.get("file")
								byte[] buffer = new byte[1024];
								while (true) {
									int byteRead = fis.read(buffer);
									if (byteRead == -1) {
										break;
									}
									fos.write(buffer, 0, byteRead);
								}
								fis.close();
								fos.close();
							} catch (FileNotFoundException e) {
								e.printStackTrace();
							} catch (IOException e) {
								e.printStackTrace();
							}
						}
						Response ret = new Response(HTML_SUCCESS_STRING);
						ret.addHeader("Cache-control", "no-cache");
						ret.addHeader("Access-Control-Allow-Origin", "*");
						return ret;
					}
				}
			}else if(parms.get("mode").equals("stream")){
				if(parms.get("action").equals("video")){
					if(parms.containsKey("id")){
						String id = parms.get("id");
						String url="",type="";
					    Cursor cursor = mcontext.getContentResolver().query(MediaStore.Video.Media.EXTERNAL_CONTENT_URI,new String[] {MediaStore.Video.Media.DATA,MediaStore.Video.Media.MIME_TYPE }, MediaStore.Video.Media._ID + "=" + id, null,null);
						if(cursor.moveToFirst()){
					    	url = cursor.getString(0);
					    	type = cursor.getString(1);
						}
						cursor.close();
						InputStream in = null;
						File file = new File(url);
						try {
							if (file.exists()&&file.canRead()&&!file.isDirectory()) {
								in = new FileInputStream(file);
							}
						} catch (FileNotFoundException e) {
							e.printStackTrace();
						}
						Response ret = new Response(Status.OK, type,in);
						ret.addHeader("Cache-control", "max-age=3600");
						ret.addHeader("Access-Control-Allow-Origin", "*");
						return ret;
					}else if(parms.containsKey("path")){
						String url=parms.get("path");
						InputStream in = null;
						File file = new File(url);
						try {
							if (file.exists()&&file.canRead()&&!file.isDirectory()) {
								in = new FileInputStream(file);
							}
						} catch (FileNotFoundException e) {
							e.printStackTrace();
						}
						Response ret = new Response(Status.OK, "video/*",in);
						ret.addHeader("Cache-control", "max-age=3600");
						ret.addHeader("Access-Control-Allow-Origin", "*");
						return ret;
					}
				}else if(parms.get("action").equals("music")){
					if(parms.containsKey("id")){
						String id = parms.get("id");
						String url="",type="";
					    Cursor cursor = mcontext.getContentResolver().query(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,new String[] {MediaStore.Audio.Media.DATA,MediaStore.Audio.Media.MIME_TYPE }, MediaStore.Audio.Media._ID + "=" + id, null,null);
						if(cursor.moveToFirst()){
					    	url = cursor.getString(0);
					    	type = cursor.getString(1);
						}
						cursor.close();
						InputStream in = null;
						File file = new File(url);
						try {
							if (file.exists()&&file.canRead()&&!file.isDirectory()) {
								in = new FileInputStream(file);
							}
						} catch (FileNotFoundException e) {
							e.printStackTrace();
						}
						Response ret = new Response(Status.OK, type,in);
						ret.addHeader("Cache-control", "max-age=3600");
						ret.addHeader("Access-Control-Allow-Origin", "*");
						return ret;
					}else if(parms.containsKey("path")){
						String url= parms.get("path");
						InputStream in = null;
						File file = new File(url);
						try {
							if (file.exists()&&file.canRead()&&!file.isDirectory()) {
								in = new FileInputStream(file);
							}
						} catch (FileNotFoundException e) {
							e.printStackTrace();
						}
						Response ret = new Response(Status.OK, "audio/*",in);
						ret.addHeader("Cache-control", "max-age=3600");
						ret.addHeader("Access-Control-Allow-Origin", "*");
						return ret;
					}
				}else if(parms.get("action").equals("imagepreview")){
					if(parms.containsKey("id")){
						String id = parms.get("id");
						int width =  Integer.parseInt(parms.get("width"));
						String url="";
					    Cursor cursor = mcontext.getContentResolver().query(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,new String[] {MediaStore.Images.Media.DATA }, MediaStore.Images.Media._ID + "=" + id, null,null);
						if(cursor.moveToFirst())url = cursor.getString(0);
						cursor.close();
						Response ret = new Response(Status.OK, "image/png",imagepreview(url,width,width));
						ret.addHeader("Cache-control", "max-age=3600");
						ret.addHeader("Access-Control-Allow-Origin", "*");
						return ret;
					}else if(parms.containsKey("path")){
						int width =  Integer.parseInt(parms.get("width"));
						String url=parms.get("path");
						Response ret = new Response(Status.OK, "image/png",imagepreview(url,width,width));
						ret.addHeader("Cache-control", "max-age=3600");
						ret.addHeader("Access-Control-Allow-Origin", "*");
						return ret;
					}
				}else if(parms.get("action").equals("videopreview")){
					if(parms.containsKey("id")){
						String id = parms.get("id");
						int width =  Integer.parseInt(parms.get("width"));
						String url="";
					    Cursor cursor = mcontext.getContentResolver().query(MediaStore.Video.Media.EXTERNAL_CONTENT_URI,new String[] {MediaStore.Video.Media.DATA }, MediaStore.Video.Media._ID + "=" + id, null,null);
						if(cursor.moveToFirst())url = cursor.getString(0);
						cursor.close();
						Response ret = new Response(Status.OK, "image/png",videopreview(url,width,width));
						ret.addHeader("Cache-control", "max-age=3600");
						ret.addHeader("Access-Control-Allow-Origin", "*");
						return ret;
					}else if(parms.containsKey("path")){
						int width =  Integer.parseInt(parms.get("width"));
						String url=parms.get("path");
						Response ret = new Response(Status.OK, "image/png",videopreview(url,width,width));
						ret.addHeader("Cache-control", "max-age=3600");
						ret.addHeader("Access-Control-Allow-Origin", "*");
						return ret;
					}
				}else if(parms.get("action").equals("image")){
					if(parms.containsKey("id")){
						String id = parms.get("id");
						String url="",type="";
					    Cursor cursor = mcontext.getContentResolver().query(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,new String[] {MediaStore.Images.Media.DATA,MediaStore.Images.Media.MIME_TYPE }, MediaStore.Images.Media._ID + "=" + id, null,null);
						if(cursor.moveToFirst()){
					    	url = cursor.getString(0);
					    	type = cursor.getString(1);
						}
						cursor.close();
						InputStream in = null;
						File file = new File(url);
						try {
							if (file.exists()&&file.canRead()&&!file.isDirectory()) {
								in = new FileInputStream(file);
							}
						} catch (FileNotFoundException e) {
							e.printStackTrace();
						}
						Response ret = new Response(Status.OK, type,in);
						ret.addHeader("Cache-control", "max-age=3600");
						ret.addHeader("Access-Control-Allow-Origin", "*");
						return ret;
					}else if(parms.containsKey("path")){
						String url=parms.get("path");
						InputStream in = null;
						File file = new File(url);
						try {
							if (file.exists()&&file.canRead()&&!file.isDirectory()) {
								in = new FileInputStream(file);
							}
						} catch (FileNotFoundException e) {
							e.printStackTrace();
						}
						Response ret = new Response(Status.OK, "image/*",in);
						ret.addHeader("Cache-control", "max-age=3600");
						ret.addHeader("Access-Control-Allow-Origin", "*");
						return ret;
					}
				}else if(parms.get("action").equals("answerphone")){
					InputStream in = null;
					//in = new ByteArrayInputStream(PhoneReceiver.m_out_bytes);
					//PhoneReceiver.startSound(in);
				    //phoneRcvr。startSound();
					Response ret = new Response(Status.OK, "audio/*",in);
					ret.addHeader("Cache-control", "no-cache");
					ret.addHeader("Access-Control-Allow-Origin", "*");
					return ret;
				}
			}else if(parms.get("mode").equals("process")){
				if(parms.get("action").equals("services")){
					output = runStatus.getRunningServicesInfo();
				}else if(parms.get("action").equals("tasks")){
					output = runStatus.getRunningTaskInfo();
				}else if(parms.get("action").equals("process")){
					output = runStatus.getProcessTaskInfo();
				}else if(parms.get("action").equals("processkill")){
					if(parms.containsKey("process")){
						output = runStatus.killProcessByProcess(parms.get("process"));
					}else{
						output = runStatus.killProcess();
					}
				}
				Response ret = new Response(output);
				ret.setMimeType("application/Json");
				ret.addHeader("Cache-control", "no-cache");
				ret.addHeader("Access-Control-Allow-Origin", "*");
				return ret;
			}else if(parms.get("mode").equals("screen")){
				if(parms.get("action").equals("shot")){
					InputStream in = null;
					try {
						in = ScreenShot.shot(parms.get("width"),parms.get("height"),parms.get("quality"));
					} catch (IOException e) {
						e.printStackTrace();
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
					Response ret = new Response(Status.OK, "image/png",in);
					ret.addHeader("Cache-control", "no-cache");
					ret.addHeader("Access-Control-Allow-Origin", "*");
					return ret;
				}else if(parms.get("action").equals("record")){
					//
				}
			}else if(parms.get("mode").equals("runcmd")){
				System.out.println(parms.toString());
				if(parms.get("action").equals("OpenUrl")){
					output = cmd.OpenUrl(parms.get("url"));
				}else if(parms.get("action").equals("simulateText")){
					output = cmd.simulateText(parms.get("txt"));
				}else if(parms.get("action").equals("cmd")){
					output = cmd.exec(parms.get("cmd"));
				}else if(parms.get("action").equals("Touch")){
					int l = Integer.parseInt(parms.get("x")) * screen.get(0)/100;
					int t = Integer.parseInt(parms.get("y")) * screen.get(1)/100;
					output = cmd.simulateTouch(l,t);
				}else if(parms.get("action").equals("Swap")){
					int x = Integer.parseInt(parms.get("x")) * screen.get(0)/100;
					int y = Integer.parseInt(parms.get("y")) * screen.get(1)/100;
					int x2 = Integer.parseInt(parms.get("x2")) * screen.get(0)/100;
					int y2 = Integer.parseInt(parms.get("y2")) * screen.get(1)/100;
					int dur = Integer.parseInt(parms.get("duration"));
					
					output = cmd.simulateSwap(x,y,x2,y2,dur);
				}else if(parms.get("action").equals("button")){
					int l = Integer.parseInt(parms.get("button"));
					output = cmd.simulateKey(l);
				}else if(parms.get("action").equals("shutdown")){
					output = cmd.shutdown();
				}else if(parms.get("action").equals("reboot")){
					output = cmd.reboot();
				}else if(parms.get("action").equals("CloseWifi")){
					output = cmd.CloseWifi();
				}else if(parms.get("action").equals("OpenWifi")){
					output = cmd.OpenWifi();
				}else if(parms.get("action").equals("Close3g")){
					output = cmd.Close3g();
				}else if(parms.get("action").equals("Open3g")){
					output = cmd.Open3g();
				}
				Response ret = new Response(output);
				ret.setMimeType("application/Json");
				ret.addHeader("Cache-control", "no-cache");
				ret.addHeader("Access-Control-Allow-Origin", "*");
				return ret;
			}else if(parms.get("mode").equals("shell")){
				if(parms.get("action").equals("cmd")){
					boolean isSU=false;
					if(parms.containsKey("user") && parms.get("user").equals("su")){
						isSU=true;
					}
					boolean isOut=false;
					if(parms.containsKey("output") && parms.get("output").equals("1")){
						isOut=true;
					}
					output = shell.runShell(parms.get("cmd"),isOut,isSU,parms.get("dir"));
				}
				Response ret = new Response(output);
				ret.setMimeType("application/Json");
				ret.addHeader("Cache-control", "no-cache");
				ret.addHeader("Access-Control-Allow-Origin", "*");
				return ret;
			}else{
				return new Response("<html><body><h1>当前模块不存在</h1></body></html>");
			}
		}else{
			return new Response("<html><body><h1>当前请求格式不正确</h1></body></html>");
		}
		return null;
	}

	public String devie_overview(){
		return StatusJson.getJson();
	}
	public String devie_status(){
		return StatusJson.getStatus();
	}
	public String devie_contacts(){
		return ContactsJson.getContacts();
	}
	public String devie_phones(){
		return ContactsJson.getPhones();
	}
	public String devie_apps(){
		return AppsJson.getApps();
	}
	public InputStream imagepreview(String url,int width,int height){
		 Bitmap bitmap = null;  
        BitmapFactory.Options options = new BitmapFactory.Options();  
        options.inJustDecodeBounds = true;
        bitmap = BitmapFactory.decodeFile(url, options);  
        options.inJustDecodeBounds = false;
        int h = options.outHeight;
        int w = options.outWidth;
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
        bitmap = BitmapFactory.decodeFile(url, options);  
        bitmap = ThumbnailUtils.extractThumbnail(bitmap, width, height,ThumbnailUtils.OPTIONS_RECYCLE_INPUT); 
	
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 90, baos);
        return new ByteArrayInputStream(baos.toByteArray());
	}
	private InputStream videopreview(String videoPath, int width, int height) {  
        Bitmap bitmap = null; 
        bitmap = ThumbnailUtils.createVideoThumbnail(videoPath, MediaStore.Images.Thumbnails.MICRO_KIND);
        bitmap = ThumbnailUtils.extractThumbnail(bitmap, width, height,ThumbnailUtils.OPTIONS_RECYCLE_INPUT);  
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 90, baos);
        return new ByteArrayInputStream(baos.toByteArray());
    }  

}