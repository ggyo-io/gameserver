import React from "react"
import './styles/board.scss'
import { Player } from "../player/player"
import { ControlPanel } from "../control-panel/controlPanel"
import { ChatPanel } from "../chat-panel/chatPanel"
import { ChessGame } from "./modes/chessgame";
import ReactResizeDetector from "react-resize-detector";


export const view = (width, height) => {

    const getSizes = (width, height) => {
        const MaxBoardSize = 600
        const ratio = .6
        const calculate = (value) => {
            return Math.ceil(value * ratio)
        }

        const boardSize = height < width ? Math.min(calculate(height), MaxBoardSize) : Math.min(calculate(width), MaxBoardSize)
        return {
            size: boardSize - 7,
            styleWidth: { width: `${boardSize}px` },
            styleHeight: { height: `${boardSize}px` }
        }
    }

    const { size } = getSizes(width, height)

    return <div className='d-flex flex-fill justify-content-between'>
        <ControlPanel size={size} />
        <div className="board-content d-flex flex-column">
            <Player />
            <ChessGame size={size} />
            <Player />
        </div>
        <ChatPanel />
    </div>

}

export const Board = () => {
    return (
        <ReactResizeDetector handleWidth handleHeight querySelector="#root">
            {({ width, height }) => view(width, height)}
        </ReactResizeDetector>
    )
}
