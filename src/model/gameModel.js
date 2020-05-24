import {actions} from "./actions";

export const gameModel = {
    game: {
        history: [],
        // browsing where?
        browseIndex: 0,
        // custom square styles
        squareStyles: {},
        // square with the currently clicked piece
        pieceSquare: "",
        // currently clicked square
        square: '',
        // square styles for active drop squares
        dropSquareStyle: {},
        dialogLabel: "",
        top: {
            name: 'Annonymous',
            elo: '1000'
        },
        bottom: {
            name: 'Annonymous',
            elo: '1000'
        },
        result: '',

        // actions
        ...actions

    }
}
