import {action} from "easy-peasy";
import {clock2millis, timeMin} from "../utils/time";
import {turnPosish} from "../utils/turns";

const setBrowseClocks = (idx, hist, state) => {
    if (idx > 0)
        setBrowseClock(idx, hist, state)
    if (idx > 1)
        setBrowseClock(idx - 1, hist, state)
}

const setBrowseClock = (idx, hist, state) => {
    const {clock} = hist[idx - 1]
    if (clock === undefined) return
    const millis = clock2millis(clock)
    const posish = turnPosish(idx)
    //console.log("payload = " + idx + ", posish = " + posish + ", clock = " + clock + ", millis = " + millis)
    state[posish].serverTime = millis
}

export const actions = {

    onMove: action((state, payload) => {
        state.history = payload.history
        const {WhiteClock, BlackClock} = payload

        if (WhiteClock !== undefined && BlackClock !== undefined) {
            // Server update
            console.log("onMove whiteClock = " + timeMin(WhiteClock) + ", blackClock = " + timeMin(BlackClock))
            if (state.orientation === "white") {
                state.bottom.serverTime = WhiteClock
                state.top.serverTime = BlackClock
            } else {
                state.top.serverTime = WhiteClock
                state.bottom.serverTime = BlackClock
            }
        } else {
            // My move
            const elapsed = Date.now() - state.lastMoveTimestamp
            if (state.orientation === state.myColor)
                state.bottom.serverTime -= elapsed
            else
                state.top.serverTime -= elapsed
        }
        state.lastMoveTimestamp = Date.now()
        state.browseIndex = state.history.length
        state.pieceSquare = ''
    }),

    promote: action((state, payload) => {
        state.promote = true
        state.onPromote = payload
    }),

    update: action((state, payload) => {
        Object.assign(state, payload)
    }),

    setBrowseIndex: action((state, payload) => {
        if (payload < 0 || payload > state.history.length)
            return
        state.browseIndex = payload
        state.pieceSquare = ''
        state.dropSquare = ''

        // update times only in finished games
        if (state.result === '') return

        setBrowseClocks(payload, state.history, state)

    }),

    setPieceSquare: action((state, payload) => {
        state.pieceSquare = payload
    }),
    setDropSquare: action((state, payload) => {
        state.dropSquare = payload
    }),

    setDialogLabel: action((state, payload) => {
        state.dialogLabel = payload
    }),

    setTime: action((state, payload) => {
        state[payload.player].time = payload.time
    }),

    newGame: action((state, {Color, BlackElo, WhiteElo, WhiteClock, BlackClock, User, History}) => {
        state.history = History ? History : []
        state.browseIndex = History ? History.length : 0
        state.pieceSquare = ''
        state.dropSquare = ''
        state.result = ''
        state.orientation = Color
        state.myColor = Color
        state.top = {
            name: User || 'Anonymous',
            elo: Color === 'white' ? BlackElo : WhiteElo,
            serverTime: Color === 'white' ? BlackClock : WhiteClock
        }
        state.bottom = {
            name: "Hey that's me",
            elo: Color === 'white' ? WhiteElo : BlackElo,
            serverTime: Color === 'white' ? WhiteClock : BlackClock
        }
        state.lastMoveTimestamp = Date.now()
    }),

    setAnalysis: action((state, payload) => {
        state.mode = "analysis"
        state.history = payload.history
        state.pieceSquare = ''
        state.top = {
            name: payload.Black,
            elo: payload.BlackElo
        }
        state.bottom = {
            name: payload.White,
            elo: payload.WhiteElo
        }
        state.result = payload.Result
        state.browseIndex = payload.history.length
        setBrowseClocks(payload.history.length, payload.history, state)
    }),

    setUser: action((state, payload) => {
        state.user = payload
    })

}
