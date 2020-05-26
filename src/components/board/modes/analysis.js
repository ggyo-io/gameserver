import React from "react";
import Chessboard from "../../ggchessboard";
import Chess from "chess.js";
import { useStoreState } from "easy-peasy";
import { calcPosition, lastMoveSquareStyling } from "./helpers";
import GGBoard from "../../ggboard";

const game = new Chess()

export const Analysis = (props) => {
    const history = useStoreState(state => state.game.history)
    const browseIndex = useStoreState(state => state.game.browseIndex)

    const position = calcPosition(history, browseIndex, game);
    const squareStyles=lastMoveSquareStyling(history, browseIndex)

    return (
        <GGBoard
            position={position}
            style={props.style}
            squareStyles={squareStyles}
        />
    )
}
