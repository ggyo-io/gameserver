import Chessboard from "chessboardjsx";
import React from "react";
import './styles/board.scss';
import {Player} from "../player/player";
import {ControlPanel} from "../control-panel/controlPanel";
import {ChatPanel} from "../chat-panel/chatPanel";

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


export const Board = (props) => {
    const {position} = props;
    const {size, styleWidth, styleHeight} = getSizes(props);
    return (
        <React.Fragment>
            <div className='d-flex flex-fill justify-content-between'>
                <ControlPanel size={size}/>
                <div style={styleWidth} className="board-content d-flex flex-column">
                    <Player/>
                    <div className="position-relative border-warning p-1">
                        <Chessboard id="board" position={position} calcWidth={() => size}/>
                    </div>
                    <Player/>
                </div>
                <ChatPanel/>
            </div>
        </React.Fragment>
    )
}
