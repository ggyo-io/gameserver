import { actions } from "./actions";
import {computed} from "easy-peasy";

export const gameModel = {
    game: {
        myColor: 'any',
        orientation: 'white',
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
            serverTime: 15 * 60,
        },
        bottom: {
            name: 'Annonymous',
            elo: '1000',
            serverTime: 15 * 60,
        },

        turn: computed(state => state.history.length % 2 ? "top" : "bottom"),
        lastMoveTimestamp: Date.now(),

        result: '',

        // actions
        ...actions

    }
}
