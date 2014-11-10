package com.wantflying.server;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

import org.json.JSONException;
import org.json.JSONObject;

public final class ShellUtil { 
	 
    /** 内部类ShellUtilHolder */ 
    static class ShellUtilHolder { 
        static ShellUtil instance = new ShellUtil(); 
    } 
 
    /** 返回ShellUtil的单例 */ 
    public static ShellUtil getInstance() { 
        return ShellUtilHolder.instance; 
    } 
 
    /** 
     * @brief ROOT权限下执行命令 
     * @pre 执行\link #root()\endlink 
     *  
     * @param cmd 命令 
     * @param isOut 是否输出结果
     * @param isSu 是不是以root运行
     * @param dir 命令执行目录
     */
    public String runShell(String cmd,boolean isOut,boolean isSu,String dir) {
        System.out.println(cmd+"||"+isOut+"||"+isSu+"||"+dir);
    	StringBuffer retI = new StringBuffer("");
    	String status = "ok";
    	String ret = "";
    	ProcessBuilder pb = new ProcessBuilder("/system/bin/sh");
    	pb.redirectErrorStream(true);
    	pb.directory(new File(dir));
    	try {
    		Process proc = pb.start();
    		PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(proc.getOutputStream())), true);
    		InputStream ins = proc.getInputStream();
    		if(isSu){
    	    	out.println("su");
    			if(out.checkError())
                    System.out.println("========WRONG===========");
    		}
    		out.println("cd "+dir);
    		out.println(cmd);
    		out.println("pwd");///////////////////////////////////////////这里需要区分下，命令返回和路径返回作为不同参数返回(利用pwd能且只能返回一行数据，读取的时候按长度分割结果)
			out.println("exit");
			out.close();
			int retIl=0;
			int retItl=0;
	        BufferedReader in = new BufferedReader(new InputStreamReader(ins));
	        String line;
	        while ((line = in.readLine()) != null) {
	        	retIl = retI.length();
	        	retI.append(line+"\n");
	        	retItl = retI.length();
	        }
	        in.close();
    		System.out.println(retIl);
    		if(retIl!=0)
    			ret = retI.substring(0,retIl-1);
    		dir = retI.substring(retIl,retItl-1);
    		proc.destroy();
    	} catch (Exception e) {
    		System.out.println("exception:" + e);
    		status = "fail";
    	}
        JSONObject object = new JSONObject();
        try {
			object.put("status", status);
    		if(isOut){
		        object.put("message", ret);
			}
	        object.put("directory", dir);
		} catch (JSONException e) {
			e.printStackTrace();
		}
    	return object.toString();
	}
    
}
