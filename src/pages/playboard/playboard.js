import React from "react";
import ReactResizeDetector from 'react-resize-detector';
import {Board} from "../../components/board/board";

export const Playboard = () =>
        <ReactResizeDetector handleWidth handleHeight querySelector="#root">
            {({ width, height }) => <Board height={height} width={width} position="start"/>}
        </ReactResizeDetector>