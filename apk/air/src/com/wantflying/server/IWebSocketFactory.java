package com.wantflying.server;

import com.wantflying.server.NanoHTTPD.IHTTPSession;

public interface IWebSocketFactory {
    WebSocket openWebSocket(IHTTPSession handshake);
}