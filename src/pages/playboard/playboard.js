import React from "react";
import {Player} from "../../components/player/player";
import {Board} from "../../components/board/board";
import {PGN} from "../../components/pgn/pgn";

export const Playboard = () => (
    <div className="d-flex justify-content-center pt-3">
        <div className="d-flex flex-column justify-content-between">
            <PGN/>
            <div className="d-inline-flex p-3">
                <Board position="start"/>
                <div className="d-flex flex-column justify-content-between pl-3">
                    <Player/>
                    <Player/>
                </div>
            </div>
        </div>
    </div>
)