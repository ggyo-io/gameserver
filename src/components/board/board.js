import Chessboard from "chessboardjsx";
import React from "react";
import './board.scss';

export const Board = (props) => (
    <div className="board">
        <Chessboard id="board" position={props.position}/>
    </div>
)