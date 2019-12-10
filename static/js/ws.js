//------------------------------------------------------------------------------
// Websocket handler
//------------------------------------------------------------------------------
var wsConn = {
    connect: function(onmessage) {
        if (wsConn.q === undefined) {
            wsConn.q = [];
        }
        wsConn.ws = new WebSocket("ws://" + document.location.host + "/ws");
        wsConn.ws.onopen = function() {
            console.log('wsConn: Socket is open, q length: ' + wsConn.q.length);
            wsConn.flush();
        };
        wsConn.ws.onmessage = onmessage;
        wsConn.ws.onclose = function(e) {
            console.log('wsConn: Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(function() {
                wsConn.connect();
            }, 1000);
        };
        wsConn.ws.onerror = function(err) {
            console.error('wsConn: Socket encountered error: ', err.message, 'Closing socket');
            wsConn.ws.close();
        };

    },

    send: function(o) {
        if (o !== null) {
            wsConn.q.push(o);
        }

        while (wsConn.q.length != 0) {

            try {
                var obj = wsConn.q[0];
                var msg = JSON.stringify(obj);
                console.log('wsConn: sending: ' + msg + ' object: ' + obj);
                wsConn.ws.send(msg);

            } catch (e) {
                console.log("wsConn: Caught an error while sending: " + e);
                if (!WebSocket.OPEN) {
                    console.log('wsConn: Error sending: ' + e + ', enqueue object: ' + o);
                    return;
                } else { // Assume Json SYNTAX_ERR 
                    console.log('wsConn: Error sending: ' + e + ', discard object: ' + o);

                }
            }
            wsConn.q.pop();
        }
    },
    flush: function() { wsConn.send(null); }
};