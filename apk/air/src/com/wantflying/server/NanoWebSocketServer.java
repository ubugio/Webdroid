package com.wantflying.server;


public class NanoWebSocketServer extends NanoHTTPD implements IWebSocketFactory {
    public static UserList_WebSocket userList=new UserList_WebSocket();
    
    private final WebSocketResponseHandler responseHandler;

    public NanoWebSocketServer(int port) {
        super(port);
        responseHandler = new WebSocketResponseHandler(this);
    }

    public NanoWebSocketServer(String hostname, int port) {
        super(hostname, port);
        responseHandler = new WebSocketResponseHandler(this);
    }

    public NanoWebSocketServer(int port, IWebSocketFactory webSocketFactory) {
        super(port);
        responseHandler = new WebSocketResponseHandler(webSocketFactory);
    }

    public NanoWebSocketServer(String hostname, int port, IWebSocketFactory webSocketFactory) {
        super(hostname, port);
        responseHandler = new WebSocketResponseHandler(webSocketFactory);
    }

    @Override
    public Response serve(IHTTPSession session) {
        Response candidate = responseHandler.serve(session);
        return candidate == null ? super.serve(session) : candidate;
    }

    public WebSocket openWebSocket(IHTTPSession handshake) {
    	return new MyWebSocket(handshake);
    }
}