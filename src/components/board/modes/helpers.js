
export const calcPosition = (history, browseIndex, game) => {
    if (browseIndex === history.length && game.history().length === history.length)
        return game.fen()

    game.reset()
    for (let i = 0; i < browseIndex; i++)
        game.move(history[i])

    return game.fen()
}

function isBlack(square) {
    if (!square || !square.length || square.length !== 2)
        return false

    const x = square.charCodeAt(0)
    const y = square.charCodeAt(1);
    return (x + y) % 2 === 0
}

export const pieceSquareStyling = (square) => {
    return {
        ...(square && {
            [square]: selectedSquareColor(square)
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

const selectedSquareColor = square => isBlack(square) ? 'selected-square-black' : 'selected-square-white'

export const lastMoveSquareStyling = (history, browseIndex) => {
    const sourceSquare = browseIndex && history[browseIndex - 1].from
    const targetSquare = browseIndex && history[browseIndex - 1].to

    return {
        ...(browseIndex && {
            [sourceSquare]: selectedSquareColor(sourceSquare)
        }),
        ...(browseIndex && {
            [targetSquare]: selectedSquareColor(targetSquare)
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
        ...{ [square]: selectedSquareColor(square) },
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
