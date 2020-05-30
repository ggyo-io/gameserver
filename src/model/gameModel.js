import { actions } from "./actions";

export const gameModel = {
    game: {
        history: [],

        // browsing where?
        browseIndex: 0,

        // square with the currently clicked piece
        pieceSquare: '',
        dropSquare: '',

        dialogLabel: '',
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
