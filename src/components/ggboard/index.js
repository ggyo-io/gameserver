import React from 'react'
import Chess from "chess.js"
import './chessboardjs/chessboard-1.0.0.css'
import { Chessboard } from './chessboardjs/chessboard-1.0.0'

export default class GGBoard extends React.Component {

    onDragStart = (source, piece, position, orientation) => {
        // do not pick up pieces if the game is over
        if (this.game.game_over()) return false

        // only pick up pieces for White
        if (piece.search(/^b/) !== -1) return false
    }

    makeRandomMove = () => {
        const possibleMoves = this.game.moves()

        // game over
        if (possibleMoves.length === 0) return

        const randomIdx = Math.floor(Math.random() * possibleMoves.length)
        this.game.move(possibleMoves[randomIdx])
        this.board.position(this.game.fen())
    }

    onDrop = (source, target) => {
        // see if the move is legal
        const move = this.game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        })

        // illegal move
        if (move === null) return 'snapback'

        // make random legal move for black
        window.setTimeout(this.makeRandomMove, 250)
    }

    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    onSnapEnd = () => {
        this.board.position(this.game.fen())
    }

    componentDidMount = () => {
        const position = 'start';
        const config = {
            draggable: true,
            position: position,
            onDragStart: this.onDragStart,
            onDrop: this.onDrop,
            onSnapEnd: this.onSnapEnd
        }
        this.game = new Chess();
        this.board = Chessboard(this.el, config);
    }

    componentWillUnmount = () => {
        // destroy?
        this.board = null;
        this.game = null;
    }

    render = () => {
        const props = { style: { ...this.props.style } }
        if (this.props.width) {
            props.style.width = this.props.width
        }
        if (this.props.height) {
            props.style.height = this.props.height
        }
        return <div ref={el => this.el = el} {...props} />
    }
}