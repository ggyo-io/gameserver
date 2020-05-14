import Chessboard from "chessboardjsx";
import React, {useState} from "react";
import './styles/board.scss';
import {Player} from "../player/player";
import {ControlPanel} from "../control-panel/controlPanel";
import {ChatPanel} from "../chat-panel/chatPanel";
import {pgn} from "./constants"
import Chess from "chess.js"

const MaxBoardSize = 600;
const ratio = .6;
const calculate = (value) => {
    return Math.ceil(value * ratio);
}
const getSizes = (props) => {
    const {width, height} = props;
    const boardSize = height < width ? Math.min(calculate(height), MaxBoardSize) : Math.min(calculate(width), MaxBoardSize)
    return {
        size: boardSize - 7,
        styleWidth: {width: `${boardSize}px`},
        styleHeight: {height: `${boardSize}px`}
    };
};

const initGameState = ()=> {
    const chess = new Chess()
    chess.load_pgn(pgn, {sloppy: true})
    const history = chess.history()
    const [gameState, setGameState] = useState({browseIndex: history.length, chess: chess})
    const browsing = false;
    let position = "start";
    if (gameState.browseIndex > 0) {
        if (gameState.browseIndex === history.length) {
            position = chess.fen()
        } else {
            const tmpChess = new Chess();
            for (let i = 0; i < gameState.browseIndex; i++)
                tmpChess.move(history[i])
            position = tmpChess.fen()
        }
    }
    return {gameState, setGameState, position};
}



export const Board = (props) => {

    const {size, styleWidth, styleHeight} = getSizes(props)
    const {gameState, setGameState, position} = initGameState()

    return (
        <React.Fragment>
            <div className='d-flex flex-fill justify-content-between'>
                <ControlPanel gameState={gameState} setGameState={setGameState} size={size}/>
                <div style={styleWidth} className="board-content d-flex flex-column">
                    <Player/>
                    <div className="position-relative border-warning p-1">
                        <Chessboard id="board" transitionDuration={0} position={position} calcWidth={() => size}/>
                    </div>
                    <Player/>
                </div>
                <ChatPanel/>
            </div>
        </React.Fragment>
    )
}
