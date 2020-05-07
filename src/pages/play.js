import React from "react";
import {Player} from "../components/player";
import {Board} from "../components/board";
import "./play.css"

export const Play = () => (
    <div className="play">
        <Player position="top"/>
        <Board position="start"/>
        <Player position="bottom" />
    </div>
)