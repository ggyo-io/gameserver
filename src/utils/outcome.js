import {useStoreState} from "easy-peasy";

export const outcomeMethod = (code) => {
    switch (code) {
        case 1:
            return "Checkmate"
        case 2:
            return "Resignation"
        case 3:
            return "Draw offer"
        case 4:
            return "Stalemate"
        case 5:
            return "Threefold repetition"
        case 6:
            return "Fivefold Repetition"
        case 7:
            return "Fifty Move Rule"
        case 8:
            return "Seventy Five Move Rule"
        case 9:
            return "Insufficient Material"
    }
    return code
}

export const colorResult = (res, myColor) => {
    console.log("colorResult", res, myColor)
    if (myColor === "black") {
        if (res === "1-0") return "0-1"
        if (res === "0-1") return "1-0"
    }
    return res
}
