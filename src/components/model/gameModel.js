import {action} from "easy-peasy";

export const gameModel = {
    game: {
        position: "start",
        history: [],
        browseIndex: 0,
        // custom square styles
        squareStyles: {},
        // square with the currently clicked piece
        pieceSquare: "",
        // currently clicked square
        square: '',
        // square styles for active drop squares
        dropSquareStyle: {},

        setBrowseIndex: action((state, payload) => {
            if (payload < 0 || payload > state.history.length)
                return
            state.browseIndex = payload
        }),

        onMove: action((state, payload) => {
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
}
