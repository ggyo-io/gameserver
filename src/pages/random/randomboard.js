import React from "react";
import {Board} from "../../components/board/board";
import {Random} from "../../components/board/modes/random";

export const Randomboard = () =>
    <Board
        boardId="randomboard"
        Mode={<Random/>}
        RightPanel={<div/>}
    />
