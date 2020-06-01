import {action} from "easy-peasy";

export const actions = {

    update: action((state, payload) => {
        Object.assign(state, payload)
    }),

    //          ~= Actions =~          //
    setBrowseIndex: action((state, payload) => {
        if (payload < 0 || payload > state.history.length)
            return
        state.browseIndex = payload
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
