import React from "react";
import Chessboard from "chessboardjsx";
import {Player} from "../components/player";
import "./play.css"

export const Play = () => (
    <div className="play">
        <h2> Шахматишки </h2>
        <Player/>
        <Chessboard position="start"/>
        <Player/>
    </div>
)