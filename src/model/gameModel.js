import { actions } from "./actions";

export const gameModel = {
    game: {
        myColor: 'any',
        opponent: 'human',

        timeControl: {
            seconds: 5*60,
            increment:0
        },

        history: [],

        // browsing where?
        browseIndex: 0,

        // square with the currently clicked piece
        pieceSquare: '',
        dropSquare: '',

        dialogLabel: '',
        top: {
            name: 'Annonymous',
            elo: '1000',
            time: 15 * 60,

        },
        bottom: {
            name: 'Annonymous',
            elo: '1000',
            time: 15 * 60,

        },

        turn: "bottom",
        turnStart: Date.now(),
        startTurnClock: 15 * 60,

        result: '',

        // actions
        ...actions

    }
}
