import React from "react";
import {Board} from "../../components/board/board";
import {AnalysisPanel} from "../../components/analysis-panel/analysisPanel"
import {useLocation} from "react-router-dom";
import {Analysis} from "../../components/board/modes/analysis";

export const Analysisboard = () => {
    const location = useLocation();
    let pgn = ""
    if (location.state && location.state.game) {
        pgn = location.state.game.pgn
    }
    return <Board
        boardId="analysisboard"
        Mode={<Analysis pgn={pgn}/>}
        RightPanel={<AnalysisPanel/>}
    />
}

