//------------------------------------------------------------------------------
// Websocket handler
//------------------------------------------------------------------------------

export const wsConn = {
    connect: function () {
        if (wsConn.q === undefined) {
            wsConn.q = [];
        }

        //wsConn.ws = new WebSocket("ws://" + document.location.host + "/ws");
        const goServer = 'ws://localhost:8383/ws';
        wsConn.ws = new WebSocket(goServer);
        wsConn.ws.onopen = function () {
            console.log('wsConn: Socket is open, q length: ' + wsConn.q.length);
            wsConn.flush();
        };
            wsConn.ws.onmessage = onmessage;
        wsConn.ws.onclose = function (e) {
            console.log('wsConn: Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(function () {
                wsConn.connect();
            }, 1000);
        };
        wsConn.ws.onerror = function (err) {
            console.error('wsConn: Socket encountered error: ', err.message, 'Closing socket');
            wsConn.ws.close();
        };

    },

    send: function (o) {
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
                console.log('wsConn: Error sending: ' + e + ', enqueue object: ' + JSON.stringify(o));
                return;
            }
            wsConn.q.pop();
        }
    },
    flush: function () {
        wsConn.send(null);
    }
};

const handlers = {}

export const registerCmd = (name, handler) => handlers[name] = handler

const onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    console.log('onWebSocketMessage: evt.data: ' + evt.data + ' msg: ' + msg);
    //debugger
    const handler = handlers[msg.Cmd]
    if (handler)
        handler(msg)
}


export const wsSend = wsConn.send