import React from "react";
import GGBoard from "../../ggboard";
import {calcPosition, gameSquareStyles} from "../modes/helpers";
import {useStoreActions, useStoreState} from "easy-peasy";
import {turnColor} from "../../../utils/turns";


export const Gameboard = (props) => {

    // Store state
    const { history, pieceSquare, dropSquare, browseIndex, myColor} =
        useStoreState(state => state.game)

    // Actions
    const {promote, setPieceSquare, setDropSquare} =
        useStoreActions(actions => actions.game)

    const {onMakeMove, game} = props

    //
    // Board mouse/keyboard handlers
    //
    const onDragStart = (square, piece, position, orientation) => {
        // do not pick up pieces if the game is over
        if (game.game_over()) return false

        // browsing
        if (browseIndex !== history.length) return false

        // not my turn
        if (turnColor(history.length) !== myColor) return false

        // only pick up pieces for my color
        if (piece.charAt(0) !== myColor.charAt(0)) return false

        // double click
        if (square === pieceSquare) {
            setPieceSquare('');
        } else {
            setPieceSquare(square);
        }
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

    const onSquareClick = (square, piece) => {
        makeMove(pieceSquare, square, game);
    }

    const onDrop = (sourceSquare, targetSquare) => {
        // see if the move is legal
        const move = makeMove(sourceSquare, targetSquare, game)

        // illegal move
        if (move === null) return 'snapback'

    }

    const makeMove = (source, target, game) => {
        const piece = game.get(source)
        // show promotion
        let move = game.move({
            from: source,
            to: target,
            promotion: 'q'
        })

        if (move == null)
            return null

        if (piece
            && ((piece.color === 'w' && piece.type === 'p' && target.indexOf('8') !== -1)
                ||  (piece.color === 'b' && piece.type === 'p' && target.indexOf('1') !== -1))
        ) {
            showPromotion(source, target);
        } else {
            onMakeMove(move, game)
        }
        return move
    }


    const showPromotion = (source, target) => {
        game.undo()
        const onPromote = (promotion) => {
            let move = game.move({
                from: source,
                to: target,
                promotion: promotion
            })
            if (!move) return
            onMakeMove(move, game)
        }
        promote(onPromote)
    }

    const position = calcPosition(history, browseIndex, game);
    const squareStyles = gameSquareStyles(game, history, pieceSquare, dropSquare, browseIndex)


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
