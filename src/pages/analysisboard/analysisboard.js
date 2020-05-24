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
                        console.log("headers", game.header())
                        const { Black, BlackElo, White, WhiteElo, Result } = game.header()
                        update({
                                history: game.history({ verbose: true }),
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
        }

    return <Board
        boardId="analysisboard"
        Mode={<Analysis/>}
        RightPanel={<AnalysisPanel/>}
    />
}

