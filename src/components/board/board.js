import Chessboard from "../ggchessboard";
import GGBoard from "../ggboard"
import React, {useState} from "react";
import './styles/board.scss';
import {Player} from "../player/player";
import {ControlPanel} from "../control-panel/controlPanel";

import Chess from "chess.js"
import ReactResizeDetector from "react-resize-detector";

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

const getState = (props) => {
    const chess = new Chess()
    if (props.pgn)
        chess.load_pgn(props.pgn, {sloppy: true})

    const history = chess.history()
    const [gameState, setGameState] = useState({browseIndex: history.length, chess: chess})
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
    return (
        <ReactResizeDetector handleWidth handleHeight querySelector="#root">
            {({width, height}) =>
                <ResizableBoard {...props} width={width} height={height}/>
            }
        </ReactResizeDetector>
    )
}

const ResizableBoard = (props) => {
    const {boardId, RightPanel} = props;
    const {size, styleWidth} = getSizes(props)
    const {gameState, setGameState, position} = getState(props)

    return <React.Fragment>
        <div className='d-flex flex-fill justify-content-between'>
            <ControlPanel gameState={gameState} setGameState={setGameState} size={size}/>
            <div style={styleWidth} className="board-content d-flex flex-column">
                <Player/>
                <div className="position-relative border-warning p-1">
                    <GGBoard id={boardId} position={position} style={styleWidth}/>
                </div>
                <Player/>
            </div>
            {RightPanel(props)}
        </div>
    </React.Fragment>

}
