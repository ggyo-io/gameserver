import Chess from "chess.js";
import React, { useEffect } from "react";
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
import wsConn from '../../ws/ws'

const game = new Chess()

export const ChessGame = (props) => {

    // Store state
    const history = useStoreState(state => state.game.history)
    const pieceSquare = useStoreState(state => state.game.pieceSquare)
    const dropSquare = useStoreState(state => state.game.dropSquare)
    const browseIndex = useStoreState(state => state.game.browseIndex)
    const myColor = useStoreState(state => state.game.myColor)
    const opponent = useStoreState(state => state.game.opponent)
    const timeControl = useStoreState(state => state.game.timeControl)

    // Actions
    const onMove = useStoreActions(actions => actions.game.onMove)
    const update = useStoreActions(actions => actions.game.update)
    const setPieceSquare = useStoreActions(actions => actions.game.setPieceSquare)
    const setDropSquare = useStoreActions(actions => actions.game.setDropSquare)
    const promote = useStoreActions(actions => actions.game.promote)

    //
    // WebSocket
    //

    // dispatch message by type
    const  onWebSocketMessage = (evt) => {
        var msg = JSON.parse(evt.data);
        console.log('onWebSocketMessage: evt.data: ' + evt.data + ' msg: ' + msg);
        if (msg.Cmd == "start") {
            newGame(msg);
        } else if (msg.Cmd == "move") {
            move(msg);
        } else if (msg.Cmd == "outcome") {
            outcome(msg.Params);
            /*
        } else if (msg.Cmd == "offer") {
            //modal.offer(msg.Params); // make visible
        } else if (msg.Cmd == "disconnect") {
            //disconnect();
        } else if (msg.Cmd == "reconnected") {
            //reconnected();
        } else if (msg.Cmd == "must_login") {
            //must_login();
        } else if (msg.Cmd == "nomatch") {
            //nomatch();
        } else if (msg.Cmd == "accept_undo") {
            //accept_undo(msg);
        } else if (msg.Cmd == "undo") {
            //modal.offer(msg.Cmd);
        } else if (msg.Cmd == "queues_status") {
            //selectGame.updateMatching(msg);
            */
        } else {
            console.log("Unknown command: '" + msg.Cmd + "'");
        }
    }

    // Server game: start message handler
    // TODO:
    // if (msg.Params !== undefined)  game.load_pgn(msg.Params, { sloppy: true }));
    const newGame = (msg) =>
    update({
        history: [],
        browseIndex: 0,
        pieceSquare: '',
        dropSquare: '',
        result: '',
        orientation: msg.Color,
        myColor: msg.Color,
        top: {
            name: msg.User || 'Anonymous',
            elo: msg.Color === 'white' ? msg.BlackElo: msg.WhiteElo,
            serverTime: timeControl.seconds,
        },
        bottom: {
            name: "Hey that's me",
            elo: msg.Color === 'white' ? msg.WhiteElo : msg.BlackElo,
            serverTime: timeControl.seconds,
        },
        lastMoveTimestamp: Date.now()
    })

    // Recieved move command from server
    const move = (msg) => {
        const from_sq = msg.Params[0] + msg.Params[1];
        const to_sq = msg.Params[2] + msg.Params[3];
        let promotePiece = "q";
        if (msg.Params.length > 4) {
            if (msg.Params[4] == "=")
                promotePiece = msg.Params[5];
            else
                promotePiece = msg.Params[4];
        }
        const mr = game.move({
            from: from_sq,
            to: to_sq,
            promotion: promotePiece
        });

        console.log("computa mr begin from: " + from_sq + " to: " + to_sq + " promo: " + promotePiece);
        console.log(JSON.stringify(mr));
        console.log("computa mr end");
        console.log("game fen: " + game.fen());

        onMove({
            history: game.history({verbose: true}),
        })
    }

    // Recieved outcome from server
    const outcome = (r) => update({result: r})

    // Send last local move to server
    const onMyMoveVsRemote = (move) => {
        onMove({
            history: game.history({verbose: true})
        })
        console.log("move: " + JSON.stringify(move))
        const { from, to, promotion } = move
        let last_move = from + to
        if (promotion !== undefined) last_move += '=' + promotion
        console.log("last_move: " + last_move)

        wsConn.send({
            Cmd: 'move',
            Params: last_move
        })
    }

    //
    // Local game vs. random
    //
    // Called on local vs. random path
    const updateResult = () => {
        if (!game.game_over()) return
        let result = ''
            if (game.in_draw())
                result = '1/2-1/2'
            else if (turnColor(history) == 'white')
                result = '1-0'
            else
                result = '0-1'
            update({ result: result })
    }

    const moveMade = () => {
        updateResult()

        onMove({
            history: game.history({ verbose: true })
        })
    }

    const timer = () => setTimeout(makeRandomMove, 200)

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

    // Called for local game vs. random
    const onMyMoveVsLocal = () => {
        moveMade()
        timer()
    }

    //
    // Board mouse/keyboard handlers
    //
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
            if (!move) return
            if (opponent === 'random')
                onMyMoveVsLocal()
            else
                onMove({
                    history: game.history({verbose: true})
                })
        }
        promote(onPromote)
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

        if (piece
            && ((piece.color === 'w' && piece.type === 'p' && target.indexOf('8') !== -1)
            ||  (piece.color === 'b' && piece.type === 'p' && target.indexOf('1') !== -1))
            ) {
            showPromotion(source, target);
        } else {
            if (opponent === 'random') {
                onMyMoveVsLocal()
            } else {
                onMyMoveVsRemote(move)
            }
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


    const position = calcPosition(history, browseIndex, game);
    let squareStyles = {}
    checkSquareStyling(squareStyles, game)
    lastMoveSquareStyling(squareStyles, history, browseIndex)
    possibleMovesSquareStyling(squareStyles, pieceSquare, game)
    pieceSquareStyling(squareStyles, pieceSquare)
    dropSquareStyling(squareStyles, dropSquare)

    useEffect(() => {
        if (opponent === 'random') {
            update({
                history: [],
                browseIndex: 0,
                pieceSquare: '',
                dropSquare: '',
                result: '',
                orientation: myColor === 'any' ? 'white' : myColor,
                myColor: myColor === 'any' ? 'white' : myColor,
                top: {
                    name: 'Random',
                    elo: 0,
                    serverTime: timeControl.seconds,
                },
                bottom: {
                    name: "Hey that's me",
                    elo: 300,
                    serverTime: timeControl.seconds,
                },
                lastMoveTimestamp: Date.now()
            })

            if (myColor === 'black') timer()
        } else {
            wsConn.connect(onWebSocketMessage);
            wsConn.send({
                Cmd: "start",
                Params: opponent,
                Color: myColor,
                TimeControl: timeControl.seconds.toString() + '+' +
                             timeControl.increment.toString()
            });
        }
    }, []);

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


