import {action} from "easy-peasy";

const adjustTime = (t) => Math.floor(t/1000)
const clock2secs = (c) => {
    const a = c.split(':')
    let multiplier = 1
    let secs = 0
    let digit
    while (digit = a.pop()) {
        secs += parseInt(digit) * multiplier
        multiplier *= 60
    }

    return secs
}

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

        const { clock }   = state.history[payload]
        if (clock === undefined) return

        const secs = clock2secs(clock)
        if (state.orientation === "white")
            if (payload % 2) // white clock
                state.bottom.serverTime = secs
            else // black clock
                state.top.serverTime = secs
        else // orientation black
            if (payload % 2) // white clock
                state.top.serverTime = secs
            else // black clock
                state.bottom.serverTime = secs
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
            serverTime: adjustTime(Color === 'white' ? BlackClock : WhiteClock)
        }
        state.bottom = {
                name: "Hey that's me",
                elo: Color === 'white' ? WhiteElo : BlackElo,
                serverTime: adjustTime(Color === 'white' ? WhiteClock: BlackClock)
            }
        state.lastMoveTimestamp = Date.now()
    }),
    setUser: action((state, payload) => {
        state.user = payload
    })

}
