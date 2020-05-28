const selectedSquareWhite = 'rgba(248,220,100,0.9)';
const selectedSquareBlack = 'rgba(201,167,60,0.88)';
const possibleMove = {
    background:
        'radial-gradient(circle, gray 15%, transparent 25%)',
    borderRadius: '5%'
}

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
            [square]: {
                backgroundColor: selectedSquareColor(square)
            }
        })
    }
}

function selectedSquareColor(square) {
    console.log("selectedSquareColor: " + square)
    const color = isBlack(square) ? selectedSquareBlack : selectedSquareWhite
    return color
}

export const lastMoveSquareStyling = (history, browseIndex) => {
    const sourceSquare = browseIndex && history[browseIndex - 1].from
    const targetSquare = browseIndex && history[browseIndex - 1].to

    return {
        ...(browseIndex && {
            [sourceSquare]: {
                backgroundColor: selectedSquareColor(sourceSquare)
            }
        }),
        ...(browseIndex && {
            [targetSquare]: {
                backgroundColor: selectedSquareColor(targetSquare)
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
        ...{[square]: {backgroundColor: selectedSquareColor(square)}},
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
