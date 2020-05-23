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

    return (
        <Chessboard
            position={position}
            calcWidth={calcWidth}
        />

    )
}
