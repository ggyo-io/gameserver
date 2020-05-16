import React from "react";
import ReactResizeDetector from 'react-resize-detector';
import {Board} from "../../components/board/board";
import {AnalysisPanel} from "../../components/analysis-pamel/analysisPanel"

export const Analysisboard = () =>
        <ReactResizeDetector handleWidth handleHeight querySelector="#root">
            {({ width, height }) => <Board height={height} width={width} position="start" boardId="analysisboard" RightPanel={AnalysisPanel}/>}
        </ReactResizeDetector>