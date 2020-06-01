import React from "react";
import Chess from "chess.js";
import {useStoreState} from "easy-peasy";
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

    //const update = useStoreActions(actions => actions.game.update)
    //useEffect(() => {
    //    update({promote: true, onPromote: (x) => console.log(x)})
    //})


    return (
        <GGBoard
            position={position}
            style={props.style}
            width={props.width}
            squareStyles={squareStyles}
        />
    )
}
