import React from "react";
import {Board} from "../../components/board/board";
import {ChatPanel} from "../../components/chat-panel/chatPanel";

export const Playboard = () =>
        <Board position="start" boardId="playboard" RightPanel={ChatPanel}/>
