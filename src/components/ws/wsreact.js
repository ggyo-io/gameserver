import React, {useEffect} from "react";
import {useStoreActions} from "easy-peasy";
import {useRegisterCmd, wsConn} from "./ws";
import {chess} from "../../utils/chessref";
import {useHistory} from "react-router-dom";

export const WsReact = () => {
    const {update, addChatMessage, setDialogLabel, newGame} = useStoreActions(actions => actions.game)
    const routerHistory = useHistory()

    const start = (msg) => {
        if (msg.Params) {
            chess.load_pgn(msg.Params, {sloppy: true})
            msg = {...msg, History: chess.history({verbose:true})}
        }
        newGame(msg)
        update({match: false})
        routerHistory.push('/playboard')
    }


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
    useRegisterCmd("start", start)

    return null
}
