import Chessboard from "../ggchessboard";
import React, {useEffect, useState} from "react";
import './styles/board.scss';
import {Player} from "../player/player";
import {ControlPanel} from "../control-panel/controlPanel";

import Chess from "chess.js"
import {ChatPanel} from "../chat-panel/chatPanel";
import {action, createStore, StoreProvider, useStoreActions, useStoreState} from "easy-peasy";


const game = new Chess();

const ChessGame = (props) => {

    useEffect(() => (() => {
        window.clearTimeout(timer())
    }))

    // Actions
    const onMove = useStoreActions(actions => actions.game.onMove)
    const setSquareStyles = useStoreActions(actions => actions.game.setSquareStyles)
    const setDropSquareStyle = useStoreActions(actions => actions.game.setDropSquareStyle)
    const setPieceSquare = useStoreActions(actions => actions.game.setPieceSquare)

    // Store state
    const history = useStoreState(state => state.game.history)
    const pieceSquare = useStoreState(state => state.game.pieceSquare)
    const position = useStoreState(state => state.game.position)
    const squareStyles = useStoreState(state => state.game.squareStyles)
    const dropSquareStyle = useStoreState(state => state.game.dropSquareStyle)

    const getSizes = (props) => {
        const MaxBoardSize = 600;
        const ratio = .6;
        const calculate = (value) => {
            return Math.ceil(value * ratio);
        };

        const {width, height} = props;
        const boardSize = height < width ? Math.min(calculate(height), MaxBoardSize) : Math.min(calculate(width), MaxBoardSize)
        return {
            size: boardSize - 7,
            styleWidth: {width: `${boardSize}px`},
            styleHeight: {height: `${boardSize}px`}
        };
    };

    //
    // Game logic
    //
    const timer = () => window.setTimeout(makeRandomMove, 200);

    const onDrop = ({sourceSquare, targetSquare}) => {
        // see if the move is legal
        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return;

        onMove();
        timer();
    };


    const onMouseOverSquare = (square) => {
        // get list of possible moves for this square
        let moves = game.moves({
            square: square,
            verbose: true
        });

        // exit if there are no moves available for this square
        if (moves.length === 0) return;

        let squaresToHighlight = [];
        for (let i = 0; i < moves.length; i++) {
            squaresToHighlight.push(moves[i].to);
        }

        highlightSquare(square, squaresToHighlight);
    };

    const onMouseOutSquare = (square) => {
        removeHighlightSquare(square);
    }

    // central squares get diff dropSquareStyles
    const onDragOverSquare = square => {
        setDropSquareStyle(
                square === 'e4' || square === 'd4' || square === 'e5' || square === 'd5'
                    ? {backgroundColor: 'cornFlowerBlue'}
                    : {boxShadow: 'inset 0 0 1px 4px rgb(255, 255, 0)'}
        );
    };

    const onSquareClick = (square) => {

        setSquareStyles(squareStyling({pieceSquare: square})),
        setPieceSquare(square)

        let move = game.move({
            from: pieceSquare,
            to: square,
            promotion: 'q' // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return;

        onMove();
        timer();
    };

    const onSquareRightClick = (square) =>
        setSquareStyles({[square]: {backgroundColor: 'deepPink'}})

    const squareStyling = (pieceSquare) => {

        const sourceSquare = history.length && history[history.length - 1].from;
        const targetSquare = history.length && history[history.length - 1].to;

        return {
            [pieceSquare]: {backgroundColor: 'rgba(255, 255, 0, 0.4)'},
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
        };
    };

    // keep clicked square style and remove hint squares
    const removeHighlightSquare = () => {
        setSquareStyles({pieceSquare, history})
    };


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
                };
            },
            {}
        );
        setSquareStyles({...squareStyles, ...highlightStyles})
    };

    const makeRandomMove = () => {
        let possibleMoves = game.moves();

        // exit if the game is over
        if (
            game.game_over() === true ||
            game.in_draw() === true ||
            possibleMoves.length === 0
        )
            return;

        let randomIndex = Math.floor(Math.random() * possibleMoves.length);
        game.move(possibleMoves[randomIndex]);

        onMove();
    };

    const {size, styleWidth} = getSizes(props)

    return (
        <div className="position-relative border-warning p-1">
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
                calcWidth={() => size}
                {...props}
            />
        </div>
    )
}

const store = createStore({
    game: {
        position: "start",
        history: [],
        browseIndex: 0,
        // custom square styles
        squareStyles: {},
        // square with the currently clicked piece
        pieceSquare: "",
        // currently clicked square
        square: '',
        // square styles for active drop squares
        dropSquareStyle: {},

        setBrowseIndex: action((state, payload) => {
            if (payload < 0 || payload > state.history.length)
                return
            state.browseIndex = payload
        }),

        onMove: action((state, payload) => {
            state.position = game.fen()
            state.history = game.history({verbose: true})
            state.browseIndex = game.history().length
            state.pieceSquare = ''
            state.squareStyles = {
                [game.history({verbose: true})[game.history().length - 1]
                    .to]: {
                    backgroundColor: 'DarkTurquoise'
                }
            }
        }),

        setDropSquareStyle: action(((state, payload) => state.dropSquareStyle = payload)),
        setSquareStyles: action((state, payload) => state.squareStyles = payload),
        setPieceSquare: action((state, payload) => state.pieceSquare = payload)

    }
});

export const Board = () => {
    return (

        <StoreProvider store={store}>
            <div className='d-flex flex-fill justify-content-between'>
                <ControlPanel/>
                <div className="board-content d-flex flex-column">
                    <Player/>
                    <ChessGame/>
                    <Player/>
                </div>
                <ChatPanel/>
            </div>
        </StoreProvider>
    )
}
