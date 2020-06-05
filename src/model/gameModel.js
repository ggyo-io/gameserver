import { actions } from "./actions";
import {computed} from "easy-peasy";

export const gameModel = {
    game: {
        myColor: 'any',
        orientation: 'white',
        opponent: 'random',

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
            name: '',
            elo: '',
            serverTime: 0,
        },
        bottom: {
            name: '',
            elo: '',
            serverTime: 0,
        },

        turn: computed(state => state.history.length % 2 ? (state.orientation === "white" ? "top" : "bottom") :
                                                           (state.orientation === "white" ? "bottom" : "top" )),
        lastMoveTimestamp: Date.now(),

        result: '',

        // actions
        ...actions

    }
}
