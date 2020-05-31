import Chess from "chess.js";
import React, {useEffect, useState} from "react";
import {useStoreActions, useStoreState} from "easy-peasy";
import {
    calcPosition,
    checkSquareStyling,
    dropSquareStyling,
    lastMoveSquareStyling,
    pieceSquareStyling,
    possibleMovesSquareStyling
} from "./helpers";
import GGBoard from '../../ggboard'

const game = new Chess()

export const ChessGame = (props) => {

    useEffect(() => (() => {
        window.clearTimeout(timer())
    }))

    // Store state
    const history = useStoreState(state => state.game.history)
    const pieceSquare = useStoreState(state => state.game.pieceSquare)
    const dropSquare = useStoreState(state => state.game.dropSquare)
    const browseIndex = useStoreState(state => state.game.browseIndex)

    // Actions
    const onMove = useStoreActions(actions => actions.game.update)
    const setPieceSquare = useStoreActions(actions => actions.game.setPieceSquare)
    const setDropSquare = useStoreActions(actions => actions.game.setDropSquare)

    //
    // Game logic
    //
    const timer = () => window.setTimeout(makeRandomMove, 200)

    const onDragStart = (square, piece, position, orientation) => {
        // do not pick up pieces if the game is over
        if (game.game_over()) return false

        // only pick up pieces for White
        if (piece.search(/^b/) !== -1) return false

        // double click
        if (square === pieceSquare) {
            setPieceSquare('');
        } else {
            setPieceSquare(square);
        }

    }

    const moveMade = () => {
        let result = ''
        if (game.game_over())
            if (game.in_draw())
                result = '1/2-1/2'
            else
                result = '1-0'

        const update = {
            position: game.fen(),
            history: game.history({verbose: true}),
            browseIndex: game.history().length,
            pieceSquare: '',
            result: result
        }
        onMove(update)
    }


    const onDrop = (sourceSquare, targetSquare) => {
        // see if the move is legal
        const move = makeMove(sourceSquare, targetSquare)

        // illegal move
        if (move === null) return 'snapback'
    }

    function showPromotion(source, target) {
        game.undo()
        const onPromote = (promotion) => {
            let move = game.move({
                from: source,
                to: target,
                promotion: promotion
            })
            if (move) {
                moveMade()
                timer()
            }
        }
        onMove({promote: true, onPromote: onPromote})
    }

    const makeMove = (source, target) => {
        const piece = game.get(source)
        // show promotion
        let move = game.move({
            from: source,
            to: target,
            promotion: 'q'
        })

        if (move == null)
            return null

        if (piece && piece.type === 'p' && target.indexOf('8') !== -1) {
            showPromotion(source, target);
        } else {
            moveMade()
            timer()
        }
        return move
    }

    const onSquareClick = (square, piece) => {
        makeMove(pieceSquare, square);
    }

    const onMouseoverSquare = (square) => {
        if (game.moves({square: pieceSquare, verbose: true}).map(x => x.to).includes(square)) {
            setDropSquare(square)
        }
    }

    const onMouseoutSquare = (square) => {
        if (dropSquare === square)
            setDropSquare('')
    }

    const onDragMove = (
        square,
        draggedPieceLocation,
        draggedPieceSource,
        draggedPiece,
        currentPosition,
        currentOrientation
    ) => {
        let sq = pieceSquare
        if (sq === '') {
            sq = draggedPieceSource
            setPieceSquare(sq)
        }
        if (game.moves({square: sq, verbose: true}).map(x => x.to).includes(square)) {
            setDropSquare(square)
        }
    }

    const onSnapbackEnd = (
        draggedPiece,
        draggedPieceSource,
        currentPosition,
        currentOrientation
    ) => {
        setDropSquare('')
    }

    const makeRandomMove = () => {
        let possibleMoves = game.moves()

        // exit if the game is over
        if (
            game.game_over() === true ||
            game.in_draw() === true ||
            possibleMoves.length === 0
        )
            return

        let randomIndex = Math.floor(Math.random() * possibleMoves.length)
        game.move(possibleMoves[randomIndex])

        moveMade()
    }

    const position = calcPosition(history, browseIndex, game);
    let squareStyles = {}
    checkSquareStyling(squareStyles, game)
    lastMoveSquareStyling(squareStyles, history, browseIndex)
    possibleMovesSquareStyling(squareStyles, pieceSquare, game)
    pieceSquareStyling(squareStyles, pieceSquare)
    dropSquareStyling(squareStyles, dropSquare)

    return (
            <GGBoard
                position={position}
                squareStyles={squareStyles}
                onDrop={onDrop}
                onSquareClick={onSquareClick}
                onMouseoverSquare={onMouseoverSquare}
                onMouseoutSquare={onMouseoutSquare}
                onDragStart={onDragStart}
                onDragMove={onDragMove}
                onSnapbackEnd={onSnapbackEnd}
                style={props.style}
            />
    )
}


