import Chess from "../../../../node_modules/chess.js/chess";
import React, {useEffect} from "react";
import {useStoreActions, useStoreState} from "easy-peasy";
import Chessboard from "../../ggchessboard";
import {calcPosition} from "./helpers";

const game = new Chess()

export const ChessGame = (props) => {

    useEffect(() => (() => {
        window.clearTimeout(timer())
    }))

    // Store state
    const history = useStoreState(state => state.game.history)
    const pieceSquare = useStoreState(state => state.game.pieceSquare)
    const squareStyles = useStoreState(state => state.game.squareStyles)
    const dropSquareStyle = useStoreState(state => state.game.dropSquareStyle)
    const browseIndex = useStoreState(state => state.game.browseIndex)

    // Actions
    const onMove = useStoreActions(actions => actions.game.update)
    const setSquareStyles = useStoreActions(actions => actions.game.setSquareStyles)
    const setDropSquareStyle = useStoreActions(actions => actions.game.setDropSquareStyle)
    const setPieceSquare = useStoreActions(actions => actions.game.setPieceSquare)

    const getSizes = (props) => {
        const MaxBoardSize = 600
        const ratio = .6
        const calculate = (value) => {
            return Math.ceil(value * ratio)
        }

        const {width, height} = props
        const boardSize = height < width ? Math.min(calculate(height), MaxBoardSize) : Math.min(calculate(width), MaxBoardSize)
        return {
            size: boardSize - 7,
            styleWidth: {width: `${boardSize}px`},
            styleHeight: {height: `${boardSize}px`}
        }
    }

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
            squareStyles: {
                [game.history({verbose: true})[game.history().length - 1].to]: {
                    backgroundColor: 'DarkTurquoise'
                }
            }
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


    const onMouseOverSquare = (square) => {
        // get list of possible moves for this square
        let moves = game.moves({
            square: square,
            verbose: true
        })

        // exit if there are no moves available for this square
        if (moves.length === 0) return

        let squaresToHighlight = []
        for (let i = 0; i < moves.length; i++) {
            squaresToHighlight.push(moves[i].to)
        }

        highlightSquare(square, squaresToHighlight)
    }

    const onMouseOutSquare = (square) => {
        removeHighlightSquare(square)
    }

    // central squares get diff dropSquareStyles
    const onDragOverSquare = square => {
        setDropSquareStyle(
            square === 'e4' || square === 'd4' || square === 'e5' || square === 'd5'
                ? {backgroundColor: 'cornFlowerBlue'}
                : {boxShadow: 'inset 0 0 1px 4px rgb(255, 255, 0)'}
        )
    }

    const onSquareClick = (square) => {
        setSquareStyles(squareStyling(square))
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

    const onSquareRightClick = (square) =>
        setSquareStyles({[square]: {backgroundColor: 'deepPink'}})

    const squareStyling = (ps) => {
        if (!ps)
            ps = pieceSquare

        const sourceSquare = history.length && history[history.length - 1].from
        const targetSquare = history.length && history[history.length - 1].to

        return {
            [ps]: {backgroundColor: 'rgba(255, 255, 0, 0.4)'},
            ...(history.length && {
                [sourceSquare]: {
                    backgroundColor: 'rgba(255, 255, 0, 0.4)'
                }
            }),
            ...(history.length && {
                [targetSquare]: {
                    backgroundColor: 'rgba(255, 255, 0, 0.4)'
                }
            })
        }
    }

    // keep clicked square style and remove hint squares
    const removeHighlightSquare = () => {
        setSquareStyles({pieceSquare, history})
    }


    // show possible moves
    const highlightSquare = (sourceSquare, squaresToHighlight) => {
        const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
            (a, c) => {
                return {
                    ...a,
                    ...{
                        [c]: {
                            background:
                                'radial-gradient(circle, #fffc00 36%, transparent 40%)',
                            borderRadius: '50%'
                        }
                    },
                    ...squareStyling()
                }
            },
            {}
        )
        setSquareStyles({...squareStyles, ...highlightStyles})
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

    function calcPosition() {
        if (history.length === 0 || browseIndex === 0)
            return "start"

        if (browseIndex === history.length && game.history().length === history.length)
            return game.fen()

        game.reset()
        for (let i = 0; i < browseIndex; i++)
            game.move(history[i])

        return game.fen()
    }

    const {size, styleWidth} = getSizes(props)
    const position = calcPosition();

    return (
        <Chessboard
            position={position}
            squareStyles={squareStyles}
            dropSquareStyle={dropSquareStyle}
            onDrop={onDrop}
            onMouseOverSquare={onMouseOverSquare}
            onMouseOutSquare={onMouseOutSquare}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
            onDragOverSquare={onDragOverSquare}
            calcWidth={props.calcWidth}
        />
    )
}

