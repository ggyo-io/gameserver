import React from "react";
import {Board} from "../../components/board/board";
import {AnalysisPanel} from "../../components/analysis-panel/analysisPanel"
import {useLocation} from "react-router-dom";


export const Analysisboard = () => {
    const location = useLocation();
    let pgn = ""
    if (location.state && location.state.game) {
        pgn = location.state.game.pgn
    }
    return <Board pgn={pgn} boardId="analysisboard" RightPanel={AnalysisPanel}/>
}

