import Chess from "chess.js";
import React, { useEffect } from "react";
import {useStoreActions, useStoreState} from "easy-peasy";
import {wsSend, registerCmd} from '../../ws/ws'
import {Gameboard} from "../components/gameboard";

const game = new Chess()

export const ChessGame = (props) => {

    // Store state
    const { myColor, opponent, timeControl} = useStoreState(state => state.game)

    // Actions
    const {onMove, update, newGame} = useStoreActions(actions => actions.game)

    //
    // WebSocket
    //


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


    const start = (msg) => {
        newGame(msg)
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

        console.log("computa mr begin from: " + from_sq + " to: " + to_sq + " promo: " + promotePiece);
        console.log(JSON.stringify(mr));
        console.log("computa mr end");
        console.log("game fen: " + game.fen());

        onMove({
            history: game.history({verbose: true}),
            WhiteClock: msg.WhiteClock,
            BlackClock: msg.BlackClock,
        })
    }

    // Recieved outcome from server
    const outcome = (msg) => update({result: msg.Params})

    // Send last local move to server
    const onMakeMove = (move, game) => {
        onMove({
            history: game.history({verbose: true})
        })
        console.log("move: " + JSON.stringify(move))
        const { from, to, promotion } = move
        let last_move = from + to
        if (promotion !== undefined) last_move += promotion
        console.log("last_move: " + last_move)

        wsSend({
            Cmd: 'move',
            Params: last_move
        })
    }



    useEffect(() => {

            registerCmd('start', start)
            registerCmd("move", move)
            registerCmd("outcome", outcome)
            wsSend({
                Cmd: "start",
                Params: opponent,
                Color: myColor,
                TimeControl: timeControl.seconds.toString() + '+' +
                             timeControl.increment.toString()
            });

    }, []);

    return (
            <Gameboard
                onMakeMove={onMakeMove}
                style={props.style}
                game={game}
            />
    )
}


