import React from "react";
import {Player} from "../../components/player/player";
import {Board} from "../../components/board/board";

export const Playboard = () => (
    <div className="d-flex justify-content-center">
        <div className="d-inline-flex p-3">
            <Board position="start"/>
            <div className="d-flex flex-column justify-content-between">
                <Player/>
                <Player/>
            </div>
        </div>
    </div>
)