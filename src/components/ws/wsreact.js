import React, {useEffect} from "react";
import {useStoreActions} from "easy-peasy";
import {useRegisterCmd, wsConn} from "./ws";

export const WsReact = () => {
    const {update, addChatMessage, setDialogLabel} = useStoreActions(actions => actions.game)

    useEffect(() => {
        wsConn.connect(update)

        // Specify how to clean up after this effect:
        return () => {
            wsConn.disconnect();
        };
    }, [])

    useRegisterCmd("disconnect", ()=>{update({opponentOnline: false})})
    useRegisterCmd("reconnected", ()=>{update({opponentOnline: true})})
    useRegisterCmd("chat", (msg)=>{addChatMessage({message: msg.Params, oponent:true})})
    useRegisterCmd("offer", (msg)=>{setDialogLabel("dialog_accept_draw")})

    return null
}
