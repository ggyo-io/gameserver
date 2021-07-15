import React from "react";
import {Board} from "components/board/board";
import {AnalysisPanel} from "components/analysis-panel/analysisPanel"
import {Analysis} from "components/board/modes/analysis";

export const AnalysisPage = () => {
    return <Board
        boardId="analysisboard"
        Mode={<Analysis/>}
        RightPanel={<AnalysisPanel/>}
    />
}

