
export const turnPosish = (idx, orient) =>
    idx % 2 ?
        (orient === "white" ? "top" : "bottom") :
        (orient === "white" ? "bottom" : "top")

export const turnColor = (idx) =>
    idx % 2 === 0 ? "white" : "black"

export const myPosish = (state) =>
    state.myColor === state.orientation ? "bottom" : "top"


export const oponentPosish = (state) =>
    state.myColor === state.orientation ? "top" : "bottom"

export const oponentName = (state) => {
    const op = state[oponentPosish(state)]
    if (op) return op.name
    return ''
}
