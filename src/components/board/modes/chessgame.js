import Chess from "chess.js";
import React, {useEffect} from "react";
import {useStoreActions, useStoreState} from "easy-peasy";
import Chessboard from "../../ggchessboard";
import {calcPosition, lastMoveSquareStyling, possibleMovesSquareStyling, pieceSquareStyling} from "./helpers";

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

    const moveMade = () => {
        const update = {
            position: game.fen(),
            history: game.history({verbose: true}),
            browseIndex: game.history().length,
            pieceSquare: '',
        }
        onMove(update)
    }


    const onDrop = ({sourceSquare, targetSquare}) => {
        // see if the move is legal
        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // always promote to a queen for example simplicity
        })

        // illegal move
        if (move === null) return

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
        if (move === null) return

        moveMade()
        timer()
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
    const squareStyles= { ...pieceSquareStyling(pieceSquare),
                          ...lastMoveSquareStyling(history, browseIndex),
                          ...possibleMovesSquareStyling(pieceSquare, game) };

    return (
        <Chessboard
            position={position}
            squareStyles={squareStyles}
            onDrop={onDrop}
            onSquareClick={onSquareClick}
            calcWidth={props.calcWidth}
        />
    )
}

