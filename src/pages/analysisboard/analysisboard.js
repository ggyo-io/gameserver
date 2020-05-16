import React from "react";
import {Board} from "../../components/board/board";
import {AnalysisPanel} from "../../components/analysis-pamel/analysisPanel"
import {pgn} from "./constants"

export const Analysisboard = () =>
        <Board pgn={pgn} boardId="analysisboard" RightPanel={AnalysisPanel}/>
