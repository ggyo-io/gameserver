import {action} from "easy-peasy";

export const actions = {

    //          ~= Actions =~          //
    setBrowseIndex: action((state, payload) => {
        if (payload < 0 || payload > state.history.length)
            return
        state.browseIndex = payload
    }),

    update: action((state, payload) => {
        Object.assign(state, payload)
    }),

    setDropSquareStyle: action((state, payload) => {
        state.dropSquareStyle = payload
    }),
    setSquareStyles: action((state, payload) => {
        state.squareStyles = payload
    }),
    setPieceSquare: action((state, payload) => {
        state.pieceSquare = payload
    })

}
