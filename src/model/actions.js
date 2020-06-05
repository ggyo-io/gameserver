import {action} from "easy-peasy";

export const actions = {

    onMove: action((state, payload) => {
        state.history = payload.history
        state.result = payload.result
        state.browseIndex = state.history.length
        state.pieceSquare = ''

        const prevMoveTimestamp = state.lastMoveTimestamp
        state.lastMoveTimestamp = Date.now()

        // TODO: use real server time
        if (state.history.length % 2) {
            state.top.serverTime = state.top.serverTime - 5
            state.bottom.serverTime = state.bottom.serverTime - Math.round((state.lastMoveTimestamp - prevMoveTimestamp) / 1000)
        }

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
    })


}
