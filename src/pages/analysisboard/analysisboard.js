import React from "react";
import {Board} from "components/board/board";
import {AnalysisPanel} from "components/analysis-panel/analysisPanel"
import {useLocation} from "react-router-dom";
import {Analysis} from "components/board/modes/analysis";
import {useStoreActions} from 'easy-peasy'
import Chess from 'chess.js'

const game = new Chess()

export const Analysisboard = () => {
        const location = useLocation();
        const update = useStoreActions(actions => actions.game.update)
        let pgn = ""
        if (location.state && location.state.game) {
                pgn = location.state.game.pgn
                if (game.load_pgn(pgn, { sloppy: true })) {
                        update({
                                history: game.history({ verbose: true }),
                                browseIndex: game.history().length,
                                pieceSquare: ''
                        })
                }
        }

    return <Board
        boardId="analysisboard"
        Mode={<Analysis/>}
        RightPanel={<AnalysisPanel/>}
    />
}

