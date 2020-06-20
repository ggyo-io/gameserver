import React, {useEffect} from "react";
import {useStoreActions} from "easy-peasy";
import {wsConn} from "./ws";

export const WsReact = () => {
    const {update} = useStoreActions(actions => actions.game)

    useEffect(() => {
        wsConn.connect(update)

        // Specify how to clean up after this effect:
        return () => {
            wsConn.disconnect();
        };
    }, [])

    return null
}
