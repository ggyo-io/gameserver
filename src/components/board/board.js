import React from "react"
import './styles/board.scss'
import {Player} from "../player/player"
import {ControlPanel} from "../control-panel/controlPanel"
import {ChatPanel} from "../chat-panel/chatPanel"
import {ChessGame} from "./modes/chessgame";


export const Board = () => {
    return (
        <div className='d-flex flex-fill justify-content-between'>
            <ControlPanel/>
            <div className="board-content d-flex flex-column">
                <Player/>
                <ChessGame/>
                <Player/>
            </div>
            <ChatPanel/>
        </div>
    )
}
