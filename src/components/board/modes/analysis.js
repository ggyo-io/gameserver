import React from "react";
import Chessboard from "../../ggchessboard";
import Chess from "chess.js";
import { useStoreState } from "easy-peasy";
import { calcPosition } from "./helpers";

const game = new Chess()

export const Analysis = (props) => {
    const { calcWidth } = props
    const history = useStoreState(state => state.game.history)
    const browseIndex = useStoreState(state => state.game.browseIndex)

    const position = calcPosition(history, browseIndex, game);

    const squareStyling = () => {
        const sourceSquare = browseIndex && history[browseIndex - 1].from
        const targetSquare = browseIndex && history[browseIndex - 1].to

        return {
            ...(browseIndex && {
                [sourceSquare]: {
                    backgroundColor: 'rgba(255, 255, 0, 0.4)'
                }
            }),
            ...(browseIndex && {
                [targetSquare]: {
                    backgroundColor: 'rgba(255, 255, 0, 0.4)'
                }
            })
        }
    }

    const squareStyles=squareStyling()

    return (
        <Chessboard
            position={position}
            calcWidth={calcWidth}
            squareStyles={squareStyles}
        />
    )
}
