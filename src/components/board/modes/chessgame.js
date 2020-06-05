import Chess from "chess.js";
import React from "react";
import {useStoreActions, useStoreState} from "easy-peasy";
import {
    calcPosition,
    turnColor,
    checkSquareStyling,
    dropSquareStyling,
    lastMoveSquareStyling,
    pieceSquareStyling,
    possibleMovesSquareStyling
} from "./helpers";
import GGBoard from '../../ggboard'

const game = new Chess()

export const ChessGame = (props) => {

    // Store state
    const myColor = useStoreState(state => state.game.myColor)
    const history = useStoreState(state => state.game.history)
    const pieceSquare = useStoreState(state => state.game.pieceSquare)
    const dropSquare = useStoreState(state => state.game.dropSquare)
    const browseIndex = useStoreState(state => state.game.browseIndex)

    // Actions
    const onMove = useStoreActions(actions => actions.game.onMove)
    const setPieceSquare = useStoreActions(actions => actions.game.setPieceSquare)
    const setDropSquare = useStoreActions(actions => actions.game.setDropSquare)
    const promote = useStoreActions(actions => actions.game.promote)

    //
    // Game logic
    //
    const timer = () => setTimeout(makeRandomMove, 200)

    const onDragStart = (square, piece, position, orientation) => {
        // do not pick up pieces if the game is over
        if (game.game_over()) return false

        // browsing
        if (browseIndex !== history.length) return false

        // not my turn
        if (turnColor(history) !== myColor) return false

        // only pick up pieces for my color
        if (piece.charAt(0) !== myColor.charAt(0)) return false

        // double click
        if (square === pieceSquare) {
            setPieceSquare('');
        } else {
            setPieceSquare(square);
        }

    }

    const moveMade = () => {

        // TODO: flip turn, reset start times,

        // TODO: result based on whose turn
        let result = ''
        if (game.game_over())
            if (game.in_draw())
                result = '1/2-1/2'
            else if (turnColor(history) == 'white')
                result = '1-0'
            else
                result = '0-1'

        onMove({
            history: game.history({verbose: true}),
            result: result,
        })
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
                onMyMove()
            }
        }
        promote(onPromote)
    }

    function onMyMove() {
        //onMove({turn: "top", })
        moveMade()
        timer()
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
            onMyMove();
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


