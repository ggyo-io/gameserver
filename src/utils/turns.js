
export const turnPosish = (idx, orient) =>
    idx % 2 ?
        (orient === "white" ? "top" : "bottom") :
        (orient === "white" ? "bottom" : "top")

export const turnColor = (idx) =>
    idx % 2 === 0 ? "white" : "black"
