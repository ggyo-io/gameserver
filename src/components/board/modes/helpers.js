
export const calcPosition = (history, browseIndex, game) => {
    if (browseIndex === history.length && game.history().length === history.length)
        return game.fen()

    game.reset()
    for (let i = 0; i < browseIndex; i++)
        game.move(history[i])

    return game.fen()
}

function isBlack(square) {
    if  (!square ||  !square.length || square.length !== 2)
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
        ...{[square]: selectedSquareColor(square)},
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
