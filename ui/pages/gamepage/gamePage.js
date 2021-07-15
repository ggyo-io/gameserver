import React from "react";
import {Board} from "../../components/board/board";
import {ChatPanel} from "../../components/chat-panel/chatPanel";
import {ChessGame} from "../../components/board/modes/chessgame";

export const GamePage = () =>
        <Board
            boardId="playboard"
            Mode={<ChessGame/>}
            RightPanel={<ChatPanel/>}
        />
