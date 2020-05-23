import React from "react";
import Chessboard from "../../ggchessboard";
import Chess from "chess.js";
import {useStoreActions, useStoreState} from "easy-peasy";
import diff from "deep-diff";
import {calcPosition} from "./helpers";

const game = new Chess()

export const Analysis = (props) => {

    const _calcPosition = (pgn) => {
        let position = "start"

        if (pgn) {
            game.load_pgn(pgn, {sloppy: true})
            const {browseIndex, history, firstRender} = useStoreState(
                state => ({
                        browseIndex: state.game.browseIndex,
                        history: state.game.history,
                        firstRender: state.game.firstRender,
                    }
                ), (prev, next) => {
                    return prev.browseIndex == next.browseIndex
                })
            if (firstRender) {
                const update = useStoreActions(actions => actions.game.update);
                update({
                    history: game.history({verbose: true}),
                    browseIndex: game.history().length,
                    firstRender: false
                })
                return game.fen()
            }
            return calcPosition(history, browseIndex, game)
        }
        return position
    }

    const {pgn, calcWidth} = props
    const position = _calcPosition(pgn);

    return (
        <Chessboard
            position={position}
            calcWidth={calcWidth}
        />

    )
}
