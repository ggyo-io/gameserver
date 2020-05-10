import Chessboard from "chessboardjsx";
import React from "react";
import './board.scss';
import {Player} from "../player/player";
import {Controller} from "../controller/controller";
import {Chat} from "../chat/chat";

const MaxBoardSize = 600;
const ratio = .6;
const calculate = (value) => {
    return Math.ceil(value * ratio);
}
const getSizes = (props) => {
    const {width, height} = props;
    const boardSize = height < width ? Math.min(calculate(height), MaxBoardSize) : Math.min(calculate(width), MaxBoardSize)
    return {
        size: boardSize,
        styleWidth: {width: `${boardSize}px`},
        styleHeight: {height: `${boardSize}px`}
    };
};


export const Board = (props) => {
    const {position} = props;
    const {size, styleWidth, styleHeight} = getSizes(props);
    return (
        <React.Fragment>
            <div className="mb-2 text-danger align-self-center">Board Width: {size} x {size}</div>

            <div style={styleHeight} className="board-content d-flex flex-row justify-content-center">
                <Chat className="col-3"/>
                <Chessboard id="board" position={position} calcWidth={() => size}/>
                <div style={styleHeight} className="d-flex flex-column justify-content-between pl-3">
                    <Player/>
                    <Controller/>
                    <Player/>
                </div>
            </div>
        </React.Fragment>
    )
}
