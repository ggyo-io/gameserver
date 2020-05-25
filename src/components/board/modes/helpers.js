const selectedSquare = 'rgba(255, 255, 0, 0.4)';
const possibleMove = {
    background:
        'radial-gradient(circle, gray 15%, transparent 25%)',
    borderRadius: '5%'
}

export const calcPosition = (history, browseIndex, game) => {
    if (history.length === 0 || browseIndex === 0)
        return "start"

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
            [square]: {
                backgroundColor: selectedSquare
            }
        })
    }
}

export const lastMoveSquareStyling = (history, browseIndex) => {
    const sourceSquare = browseIndex && history[browseIndex - 1].from
    const targetSquare = browseIndex && history[browseIndex - 1].to

    return {
        ...(browseIndex && {
            [sourceSquare]: {
                backgroundColor: selectedSquare
            }
        }),
        ...(browseIndex && {
            [targetSquare]: {
                backgroundColor: selectedSquare
            }
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
        ...{ [square]: { backgroundColor: selectedSquare } },
        ...moves.map(x => x.to).reduce(
            (a, c) => {
                return {
                    ...a,
                    ...{
                        [c]: possibleMove
                    },
                }
            },
            {}
        )
    }

}
