import Chessboard from "../ggchessboard";
import React, {useState} from "react";
import './styles/board.scss';
import {Player} from "../player/player";
import {ControlPanel} from "../control-panel/controlPanel";

import Chess from "chess.js"
import ReactResizeDetector from "react-resize-detector";

const MaxBoardSize = 600;
const ratio = .6;

const chess = new Chess()

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
    if (props.pgn)
        chess.load_pgn(props.pgn, {sloppy: true})

    const moves = chess.history()
    const [state, setState] = useState({browseIndex: moves.length})
    const {browseIndex} = state
    const setBrowseIndex = (idx) => {
        if (idx === browseIndex || idx < 0 || idx > moves.length)
            return
        setState({browseIndex: idx})
    }
    if (browseIndex !== moves.length) {
        chess.reset()
        for (let i = 0; i < browseIndex; i++) {
            chess.move(moves[i])
        }
    }

    return {moves, browseIndex, position: chess.fen(), setBrowseIndex}
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
    const {browseIndex, moves, position, setBrowseIndex} = getState(props)

    return <React.Fragment>
        <div className='d-flex flex-fill justify-content-between'>
            <ControlPanel browseIndex={browseIndex} moves={moves} size={size} setBrowseIndex={setBrowseIndex}/>
            <div style={styleWidth} className="board-content d-flex flex-column">
                <Player/>
                <div className="position-relative border-warning p-1">
                    <Chessboard id={boardId} position={position} calcWidth={() => size}/>
                </div>
                <Player/>
            </div>
            {RightPanel(props)}
        </div>
    </React.Fragment>

}
