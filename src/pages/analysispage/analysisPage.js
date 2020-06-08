import React from "react";
import {Board} from "components/board/board";
import {AnalysisPanel} from "components/analysis-panel/analysisPanel"
import {useLocation} from "react-router-dom";
import {Analysis} from "components/board/modes/analysis";
import {useStoreActions} from 'easy-peasy'
import Chess from 'chess.js'

const game = new Chess()

function updateState(headers) {
    const {Black, BlackElo, White, WhiteElo, Result} = headers
    const update = useStoreActions(actions => actions.game.update)
    update({
        mode: "analysis",
        history: game.history({verbose: true}),
        browseIndex: game.history().length,
        pieceSquare: '',
        top: {
            name: Black,
            elo: BlackElo
        },
        bottom: {
            name: White,
            elo: WhiteElo
        },
        result: Result
    })
}

export const AnalysisPage = () => {
    const location = useLocation();
    let pgn = ""
    if (location.state && location.state.game) {
        pgn = location.state.game.pgn
        if (game.load_pgn(pgn, {sloppy: true})) {
            updateState(game.header());
        }
    }

    return <Board
        boardId="analysisboard"
        Mode={<Analysis/>}
        RightPanel={<AnalysisPanel/>}
    />
}

