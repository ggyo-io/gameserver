import React from 'react'
import Chess from "chess.js"
import './chessboardjs/chessboard-1.0.0.css'
import { Chessboard } from './chessboardjs/chessboard-1.0.0'

export default class GGBoard extends React.Component {



    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    onSnapEnd = () => {
        this.board.position(this.props.position, false)
    }

    componentDidMount = () => {
        const config = {
            draggable: true,
            position: this.props.position,
            onDragStart: this.props.onDragStart,
            onDrop: this.props.onDrop,
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

    componentDidUpdate = (prevProps) => {
        const position = this.props.position;
        if (this.board.position() !== position)
            this.board.position(position, false)
        this.board.resize()
    }

    render = () => {
        const props = { style: { ...this.props.style } }
        if (this.props.width) {
            props.style.width = this.props.width
        }
        if (this.props.height) {
            props.style.height = this.props.height
        }
        return <div ref={el => this.el = el} width={props.style.width} {...props} />
    }
}