import Chess from "../../ggboard/chess.js/chess";
import React from "react";
import {useStoreActions, useStoreState} from "easy-peasy";
import {useRegisterCmd, wsSend} from '../../ws/ws'
import {Gameboard} from "../components/gameboard";
import {colorResult, outcomeMethod} from "../../../utils/outcome";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const game = new Chess()

export const ChessGame = (props) => {

    // Actions
    const {onMove, update, newGame, setClocks} = useStoreActions(actions => actions.game)
    const {top, bottom, match} = useStoreState(state => state.game)
    const routerHistory = useHistory()
    useEffect(() => {
        if (top.name === '' && bottom.name === '' && match === false)
            routerHistory.push('/')
    })

    //// dispatch message by type
    //const  onWebSocketMessage = (evt) => {
    //    var msg = JSON.parse(evt.data);
    //    console.log('onWebSocketMessage: evt.data: ' + evt.data + ' msg: ' + msg);
    //    if (msg.Cmd == "start") {
    //        newGame(msg);
    //    } else if (msg.Cmd == "move") {
    //        move(msg);
    //    } else if (msg.Cmd == "outcome") {
    //        outcome(msg.Params);
    //        /*
    //    } else if (msg.Cmd == "offer") {
    //        //modal.offer(msg.Params); // make visible
    //    } else if (msg.Cmd == "disconnect") {
    //        //disconnect();
    //    } else if (msg.Cmd == "reconnected") {
    //        //reconnected();
    //    } else if (msg.Cmd == "must_login") {
    //        //must_login();
    //    } else if (msg.Cmd == "nomatch") {
    //        //nomatch();
    //    } else if (msg.Cmd == "accept_undo") {
    //        //accept_undo(msg);
    //    } else if (msg.Cmd == "undo") {
    //        //modal.offer(msg.Cmd);
    //    } else if (msg.Cmd == "queues_status") {
    //        //selectGame.updateMatching(msg);
    //        */
    //    } else {
    //        console.log("Unknown command: '" + msg.Cmd + "'");
    //    }
    //}

    const clock = (msg) => {
        setClocks(msg)
    }

    // Recieved move command from server
    const move = (msg) => {
        const from_sq = msg.Params[0] + msg.Params[1];
        const to_sq = msg.Params[2] + msg.Params[3];
        let promotePiece = "q";
        if (msg.Params.length > 4) {
            if (msg.Params[4] == "=")
                promotePiece = msg.Params[5];
            else
                promotePiece = msg.Params[4];
        }

        const mr = game.move({
            from: from_sq,
            to: to_sq,
            promotion: promotePiece
        });

        if (!mr)
            console.error("illegal move received: " + JSON.stringify(msg))

        onMove({
            history: game.history({verbose: true}),
            WhiteClock: msg.WhiteClock,
            BlackClock: msg.BlackClock,
        })
    }

    // Recieved outcome from server
    const outcome = (msg) => {
        const {Result, Reason} = msg.Map

        const result = {outcome: colorResult(Result), method: outcomeMethod(Reason)}

        update({result: result})
    }

    // Send last local move to server
    const onMakeMove = (move) => {
        onMove({
            history: game.history({verbose: true})
        })
        const {from, to, promotion} = move
        let last_move = from + to
        if (promotion !== undefined) last_move += promotion

        wsSend({
            Cmd: 'move',
            Params: last_move
        })
    }


    useRegisterCmd("move", move)
    useRegisterCmd("outcome", outcome)
    useRegisterCmd("clock", clock)

    return (
        <Gameboard
            onMakeMove={onMakeMove}
            style={props.style}
            game={game}
        />
    )
}
