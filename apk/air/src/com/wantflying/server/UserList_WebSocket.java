package com.wantflying.server;

import java.io.IOException;
import java.util.Vector;

import android.os.Message;

import com.wantflying.air.StatusActivity;
import com.wantflying.server.WebSocketFrame.CloseCode;

public class UserList_WebSocket {
    public static Vector<User_WebSocket> list;
    public static int statusFlag=0;

	    public UserList_WebSocket() {
	        list = new Vector<User_WebSocket>();
	    }

	    public void addUser(User_WebSocket user) {
	        list.add(user);
	        if(statusFlag==1){
	            Message message = new Message();
	            message.what = 1;
	            StatusActivity.handler.sendMessage(message);
	        }
	    }

	    public void removeUser(User_WebSocket user) {
	        list.remove(user);
	        if(statusFlag==1){
	            Message message = new Message();
	            message.what = 0;
	            StatusActivity.handler.sendMessage(message);
	        }
	    }

	    public int userCount() {
	        return list.size();
	    }

	    public void sendToAll(String str) {
	        for (int i = 0; i < list.size(); i++) {
	        	User_WebSocket user = list.get(i);
		        if(statusFlag==1){
		        	StatusActivity.shakeClient2Server(user.ip);
		        }
	            WebSocket ws = user.webSocket;
	            if (ws != null) {
	                try {
	                    ws.send(str);
	                } catch (IOException e) {
	                    System.out.println("sending error.....");
	                    try {
	                        ws.close(CloseCode.InvalidFramePayloadData, "reqrement");
	                    } catch (IOException e1) {
	                        removeUser(user);
	                    }
	                }
	            }
	        }
	    }

	    public void disconectAll() {
	        for (int i = 0; i < list.size(); i++) {
	        	User_WebSocket user = list.get(i);
	            WebSocket ws = user.webSocket;
	            if(ws != null){
	                try {
	                    ws.close(CloseCode.InvalidFramePayloadData, "reqrement");
	                } catch (IOException e) {
	                    removeUser(user);
	                }
	            }
	        }
	    }
	}