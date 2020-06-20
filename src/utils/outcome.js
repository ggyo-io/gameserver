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

export const colorResult = (res) => {
    if (res === "1-0") return "White Won"
    if (res === "0-1") return "Black Won"
    return "Draw"
}