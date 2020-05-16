import React from "react";
import ReactResizeDetector from 'react-resize-detector';
import {Board} from "../../components/board/board";
import {ChatPanel} from "../../components/chat-panel/chatPanel";

export const Playboard = () =>
        <ReactResizeDetector handleWidth handleHeight querySelector="#root">
            {({ width, height }) => <Board height={height} width={width} position="start" boardId="playboard" RightPanel={ChatPanel}/>}
        </ReactResizeDetector>