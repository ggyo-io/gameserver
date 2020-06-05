export const calcPosition = (history, browseIndex, game) => {
    if (history.length === 0)
        game.reset()

    if (browseIndex === history.length && game.history().length === history.length)
        return game.fen()

    game.reset()
    for (let i = 0; i < browseIndex; i++)
        game.move(history[i])

    return game.fen()
}
export const turnColor = (history) => history.length % 2 === 0 ? "white" : "black"

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

export const checkSquareStyling = (squareStyles, game) => {
    if (!game.in_check()) return;
    const cs = checkSquare(game);
    squareStyles[cs] = squareStyles[cs] ? [ ...squareStyles[cs], 'in-check' ] : [ 'in-check' ]
}

export const lastMoveSquareStyling = (squareStyles, history, browseIndex) => {
    if (!browseIndex) return;

    const sourceSquare = history[browseIndex - 1].from
    const targetSquare = history[browseIndex - 1].to
    squareStyles[sourceSquare] = squareStyles[sourceSquare] ? [ ...squareStyles[sourceSquare], 'selected-square' ] : [ 'selected-square' ]
    squareStyles[targetSquare] = squareStyles[targetSquare] ? [ ...squareStyles[targetSquare], 'selected-square' ] : [ 'selected-square' ]
}

// show possible moves
export const possibleMovesSquareStyling = (squareStyles, square, game) => {
    game.moves({square: square, verbose: true}).map(x => x.to).forEach(sq => {
        squareStyles[sq] = squareStyles[sq] ? [ ...squareStyles[sq], 'possible-move' ]
                                                : [ 'possible-move' ]
    });
}

export const pieceSquareStyling = (squareStyles, sq) => {
    if (sq === '') return;
    squareStyles[sq] = squareStyles[sq] ? [ ...squareStyles[sq], 'piece-square' ]
                                                : [ 'piece-square' ]
}

export const dropSquareStyling = (squareStyles, sq) => {
    if (sq === '') return;
    squareStyles[sq] = squareStyles[sq] ? [ ...squareStyles[sq], 'drop-square' ]
                                                : [ 'drop-square' ]
}
