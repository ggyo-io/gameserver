import React, {useEffect} from "react";
import {wsConn} from "./ws";

export const WsReact = () => {

    useEffect(() => {
        wsConn.connect()

        // Specify how to clean up after this effect:
        return () => {
            wsConn.disconnect();
        };
    }, [])

    return null
}
