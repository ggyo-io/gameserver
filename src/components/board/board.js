import Chessboard from "chessboardjsx";
import React from "react";
import './board.scss';
import {Player} from "../player/player";
import {Moves} from "../moves/moves";
const MaxBoardSize = 470;
const ratio = .6;
const calculate = (value) => {
    return Math.ceil(value * ratio);
}
const getSizes = (props) => {
    const {width, height} = props;
    const boardSize = height < width ? Math.min(calculate(height), MaxBoardSize): Math.min(calculate(width), MaxBoardSize)
    return {
        size: boardSize,
        styleWidth: {width: `${boardSize}px`},
        styleHeight: {height: `${boardSize}px`}
    };
};


export const Board = (props) => {
   const {position} = props;
   const {size, styleWidth, styleHeight} = getSizes(props);
   return <div className="board-content d-flex flex-row justify-content-center">
        <div className="d-flex flex-column">
            <div className="mb-2 text-danger align-self-center">Board Width: {size} x {size}</div>
            <div style={styleWidth} className="align-self-center">
                <div className="mb-2">
                    <Player/>
                </div>
                <div className="mb-2 p-0 rounded-sm">
                    <Chessboard id="board" position={position} calcWidth={() => size}/>
                </div>
                <div className="mb-2">
                    <Player/>
                </div>
            </div>
        </div>
        <div className="ml-2 align-self-center overflow-auto pr-3 mt-4" style={styleHeight}>
            <Moves/>
        </div>
   </div>
}