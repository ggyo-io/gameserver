
export const calcPosition = (history, browseIndex, game) => {
    if (browseIndex === history.length && game.history().length === history.length)
        return game.fen()

    game.reset()
    for (let i = 0; i < browseIndex; i++)
        game.move(history[i])

    return game.fen()
}

export const pieceSquareStyling = (square) => {
    return {
        ...(square && {
            [square]: 'selected-square'
        })
    }
}

const checkSquare = (game) => {
    const board = game.board()
    const alphaBase = 'a'.charCodeAt(0);
    const numericBase = '8'.charCodeAt(0);

    for (let i = 0; i < board.length; i++) {
        const row = board[i]
        for (let j = 0; j < row.length; j++) {
            const cell = row[j]
            if (cell !== null &&
                cell.type === 'k' &&
                cell.color === game.turn()) {
                return String.fromCharCode(alphaBase + j,
                    numericBase - i)
            }
        }
    }
    // never reached
    return ''
}

export const checkSquareStyling = (game) => {
    return {
        ...(game.in_check() &&
            { [checkSquare(game)]: 'in-check' })
    }
}

export const lastMoveSquareStyling = (history, browseIndex) => {
    const sourceSquare = browseIndex && history[browseIndex - 1].from
    const targetSquare = browseIndex && history[browseIndex - 1].to

    return {
        ...(browseIndex && {
            [sourceSquare]: 'selected-square'
        }),
        ...(browseIndex && {
            [targetSquare]: 'selected-square'
        })
    }
}

// show possible moves
export const possibleMovesSquareStyling = (square, game) => {
    // get list of possible moves for this square
    let moves = game.moves({
        square: square,
        verbose: true
    })

    // exit if there are no moves available for this square
    if (moves.length === 0) return {}

    return {
        ...{ [square]: 'selected-square' },
        ...moves.map(x => x.to).reduce(
            (a, c) => {
                return {
                    ...a,
                    ...{
                        [c]: 'possible-move'
                    },
                }
            },
            {}
        )
    }
}

export const combineStyles = (args) => {
    const result = {}

    for (let i = 0; i < args.length; i++) {
        const next = args[i];
        for (let [key, value] of Object.entries(next)) {
            const arr = result[key] || [];
            arr.push(value)
            result[key] = arr
        }
    }
    return result
}
