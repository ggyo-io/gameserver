import {action} from "easy-peasy";
import {clock2millis, timeMin} from "../utils/time";
import {turnPosish} from "../utils/turns";
import Chess from "../components/ggboard/chess.js/chess";

const chess = new Chess()

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

function setServerClocks(state, WhiteClock, BlackClock) {
    console.log("setServerClocks whiteClock = " + timeMin(WhiteClock) + ", blackClock = " + timeMin(BlackClock))
    if (state.orientation === "white") {
        state.bottom.serverTime = WhiteClock
        state.top.serverTime = BlackClock
    } else {
        state.top.serverTime = WhiteClock
        state.bottom.serverTime = BlackClock
    }
}

export const actions = {

    onMove: action((state, payload) => {
        state.history = payload.history
        const {WhiteClock, BlackClock} = payload

        if (WhiteClock !== undefined && BlackClock !== undefined) {
            // Server update
            setServerClocks(state, WhiteClock, BlackClock);
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
            name: !!state.user ? state.user : "Hey that's me",
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
        state.result = {outcome: payload.Result}
        chess.load_pgn(payload.pgn, {sloppy: true})
        state.history = chess.history({verbose: true})
        state.browseIndex = state.history.length
        setBrowseClocks(state.history.length, state.history, state)
    }),

    setUser: action((state, payload) => {
        state.user = payload
    }),

    setClocks: action((state, payload) => {
        const {WhiteClock, BlackClock} = payload
        if (WhiteClock !== undefined && BlackClock !== undefined) {
            setServerClocks(state, WhiteClock, BlackClock);
        }
    }),

    addChatMessage: action((state, payload) => {
        state.chatMessages.push(payload)
    }),
}
