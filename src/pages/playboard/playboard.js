import React from "react";
import ReactResizeDetector from 'react-resize-detector';
import {Board} from "../../components/board/board";
const el = document.getElementById('root');

export const Playboard = () =>
        <ReactResizeDetector handleWidth handleHeight targetDomEl={el}>
            {({ width, height }) => <Board height={height} width={width} position="start"/>}
        </ReactResizeDetector>