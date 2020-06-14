import { actions } from "./actions";
import {computed} from "easy-peasy";
import {turnPosish} from "../utils/turns";

export const gameModel = {
    game: {
        myColor: 'white',
        colorPreference: 'any',
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
        turn: computed(state => turnPosish(state.history.length, state.orientation)),
        lastMoveTimestamp: Date.now(),
        result: '',
        user: '',

        // actions
        ...actions

    }
}
