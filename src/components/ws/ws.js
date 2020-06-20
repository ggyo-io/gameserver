//------------------------------------------------------------------------------
// Websocket handler
//------------------------------------------------------------------------------

import {useEffect} from "react";

export const wsConn = {
    wsConnect: function () {
        wsConn.update ({ serverConnection: {
            bg: "warning",
            text: "Connecting"
        }})
        if (wsConn.q === undefined) {
            wsConn.q = [];
        }

        //wsConn.ws = new WebSocket("ws://" + document.location.host + "/ws");
        const goServer = 'ws://localhost:8383/ws';
        wsConn.ws = new WebSocket(goServer);
        wsConn.ws.onopen = function () {
            wsConn.update ({ serverConnection: {
                bg: "success",
                text: "Connected"
            }})

            console.log('wsConn: Socket is open, q length: ' + wsConn.q.length);
            wsConn.flush();
        };
        wsConn.ws.onmessage = onmessage;
        wsConn.ws.onclose = function (e) {
            wsConn.update ({ serverConnection: {
                bg: "danger",
                text: "Disconnected"
            }})
            console.log('wsConn: Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(function () {
                wsConn.wsConnect();
            }, 1000);
        };
        wsConn.ws.onerror = function (err) {
            console.error('wsConn: Socket encountered error: ', err.message, 'Closing socket');
            wsConn.ws.close();
        };
    },

    connect: function (update) {
        wsConn.update = update
        // TODO: can we skip auth if cookie is present?
        fetch("/api/auth", {credentials: "same-origin"})
            .then(resp => {
                wsConn.wsConnect();
            })
    },

    disconnect: function() {
        wsConn.update ({ serverConnection: {
            bg: "danger",
            text: "Disconnected"
        }})
        if (wsConn.q) {
            console.log('wsConn: disconnect, q length: ' + wsConn.q.length);
            wsConn.q = undefined
        }

        if (!wsConn.ws)
            return

        wsConn.ws.onclose = function () {}; // disable onclose handler first
        wsConn.ws.close()
        wsConn.ws = undefined
    },

    send: function (o) {
        if (wsConn.q === undefined) {
            wsConn.q = [];
        }

        if (o !== null) {
            wsConn.q.push(o);
        }

        while (wsConn.q.length != 0) {

            try {
                var obj = wsConn.q[0];
                var msg = JSON.stringify(obj);
                console.log('wsConn: sending: ' + msg);
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

export const useRegisterCmd = (name, handler) => {
    useEffect(() => {
        handlers[name] = handler
        return () => {
            delete  handlers[name]
        }
    }, [])
}

const onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    console.log('onWebSocketMessage: evt.data: ' + evt.data);
    const handler = handlers[msg.Cmd]
    if (handler)
        handler(msg)
}


export const wsSend = wsConn.send
