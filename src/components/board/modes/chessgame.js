import Chess from "chess.js";
import React, {useEffect} from "react";
import {useStoreActions, useStoreState} from "easy-peasy";
import {
    calcPosition,
    checkSquareStyling,
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
    const browseIndex = useStoreState(state => state.game.browseIndex)

    // Actions
    const onMove = useStoreActions(actions => actions.game.update)
    const setPieceSquare = useStoreActions(actions => actions.game.setPieceSquare)

    //
    // Game logic
    //
    const timer = () => window.setTimeout(makeRandomMove, 200)

    const onDragStart = (source, piece, position, orientation) => {
        // do not pick up pieces if the game is over
        if (game.game_over()) return false

        // only pick up pieces for White
        if (piece.search(/^b/) !== -1) return false
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
        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // always promote to a queen for example simplicity
        })

        // illegal move
        if (move === null) return 'snapback'

        moveMade()
        timer()
    }

    const onSquareClick = (square) => {
        setPieceSquare(square)
        let move = game.move({
            from: pieceSquare,
            to: square,
            promotion: 'q' // always promote to a queen for example simplicity
        })

        // illegal move
        if (move === null) return false

        moveMade()
        timer()
        return true
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
    const squareStyles = {
        ...checkSquareStyling(game),
        ...pieceSquareStyling(pieceSquare),
        ...lastMoveSquareStyling(history, browseIndex),
        ...possibleMovesSquareStyling(pieceSquare, game)
    };

    return (
        <GGBoard
            position={position}
            squareStyles={squareStyles}
            onDragStart={onDragStart}
            onDrop={onDrop}
            onSquareClick={onSquareClick}
            style={props.style}
        />
    )
}
