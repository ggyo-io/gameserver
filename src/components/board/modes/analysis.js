import React from "react";
import Chess from "../../ggboard/chess.js/chess"
import {useStoreState} from "easy-peasy";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {calcPosition, checkSquareStyling, lastMoveSquareStyling} from "./helpers";
import GGBoard from "../../ggboard";

const game = new Chess()

export const Analysis = (props) => {
    const history = useStoreState(state => state.game.history)
    const browseIndex = useStoreState(state => state.game.browseIndex)

    const position = calcPosition(history, browseIndex, game);

    let squareStyles = {};
    checkSquareStyling(squareStyles, game);
    lastMoveSquareStyling(squareStyles, history, browseIndex)

    const routerHistory = useHistory()
    useEffect(() => {
        if (!history || history.length === 0)
            routerHistory.push('/')
    })

    return (
        <GGBoard
            position={position}
            style={props.style}
            width={props.width}
            squareStyles={squareStyles}
        />
    )
}
