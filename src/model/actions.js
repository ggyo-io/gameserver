import {action} from "easy-peasy";

const adjustTime = (t) => Math.floor(t/1000)

export const actions = {

    onMove: action((state, payload) => {
        state.history = payload.history
        const {WhiteClock, BlackClock} = payload
        if (WhiteClock !== undefined && BlackClock !== undefined) {
            if (state.orientation === "white") {
                state.bottom.serverTime = adjustTime(WhiteClock)
                state.top.serverTime = adjustTime(BlackClock)
            } else {
                state.top.serverTime = adjustTime(WhiteClock)
                state.bottom.serverTime = adjustTime(BlackClock)
            }
        } else if (payload.localTime) {
            // Local game - for simplicity and since it doesnt really matter update both top and bottom
            const elapsed = Math.floor((Date.now() - state.lastMoveTimestamp)/1000)
            state.bottom.serverTime -= elapsed
            state.top.serverTime -= elapsed
        }
        //state.result = payload.result
        state.browseIndex = state.history.length
        state.pieceSquare = ''
        state.lastMoveTimestamp = Date.now()

    }),

    promote: action((state, payload) => {
        state.promote = true
        state.onPromote = payload
    }),


    update: action((state, payload) => {
        Object.assign(state, payload)
    }),

    //          ~= Actions =~          //
    setBrowseIndex: action((state, payload) => {
        if (payload < 0 || payload > state.history.length)
            return
        state.browseIndex = payload
        state.pieceSquare = ''
        state.dropSquare = ''
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

    newGame: action((state, {Color, BlackElo, WhiteElo, WhiteClock, BlackClock, User}) => {
        Object.assign(state, {
            history: [],
            browseIndex: 0,
            pieceSquare: '',
            dropSquare: '',
            result: '',
            orientation: Color,
            myColor: Color,
            top: {
                name: User || 'Anonymous',
                elo: Color === 'white' ? BlackElo: WhiteElo,
                serverTime: adjustTime(Color === 'white' ? BlackClock: WhiteClock),
            },
            bottom: {
                name: "Hey that's me",
                elo: Color === 'white' ? WhiteElo : BlackElo,
                serverTime: adjustTime(Color === 'white' ? BlackClock: WhiteClock),
            },
            lastMoveTimestamp: Date.now()
        })
    }),

}
