package com.wantflying.server;

import java.io.IOException;

import com.wantflying.server.NanoHTTPD.IHTTPSession;

class MyWebSocket extends WebSocket {
    IHTTPSession httpSession;
    User_WebSocket user ;

    public MyWebSocket(NanoHTTPD.IHTTPSession handshake) {
        super(handshake);
        user = new User_WebSocket();
        user.webSocket = this;
        this.httpSession = handshakeRequest;
        NanoWebSocketServer.userList.addUser(user);
    }

    @Override
    protected void onPong(WebSocketFrame pongFrame) {
            System.out.println("P " + pongFrame);
    }

    @Override
    protected void onMessage(WebSocketFrame messageFrame) {
        try {
            messageFrame.setUnmasked();
            sendFrame(messageFrame);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void onClose(WebSocketFrame.CloseCode code, String reason, boolean initiatedByRemote) {
            System.out.println("C [" + (initiatedByRemote ? "Remote" : "Self") + "] " +
                    (code != null ? code : "UnknownCloseCode[" + code + "]") +
                    (reason != null && !reason.isEmpty() ? ": " + reason : ""));
            NanoWebSocketServer.userList.removeUser(user);
    }

    @Override
    protected void onException(IOException e) {
        e.printStackTrace();
    }

    @Override
    protected void handleWebsocketFrame(WebSocketFrame frame) throws IOException {
        super.handleWebsocketFrame(frame);
    }

    @Override
    public synchronized void sendFrame(WebSocketFrame frame) throws IOException {
        super.sendFrame(frame);
    }
}