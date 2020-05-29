import React, { useEffect } from 'react'
import './chessboardjs/chessboard-1.0.0.css'
import { Chessboard } from './chessboardjs/chessboard-1.0.0'

const unhl = () => {
    const squareClass = '.square-55d63'
    const highlights = ['possible-move', 'selected-square-black', 'selected-square-white', 'in-check']

    highlights.forEach(function (cn) {
        document.querySelectorAll(squareClass).forEach(function (el) {
            el.classList.remove(cn);
        })
    });
}

const hl = (props) => {
    const { squareStyles } = props
    for (let [key, value] of Object.entries(squareStyles)) {
        const el = document.querySelector(".square-" + key)
        if (el)
            el.classList.add(value);
    }
}

let board

const GGBoard = (props) => {
    let element = null;

    useEffect(() => {
        const config = {
            draggable: true,
            position: props.position,
            onDragStart: props.onDragStart,
            onDrop: props.onDrop,
            onSquareClick: props.onSquareClick,
            //pieceTheme: 'img/chesspieces/merida/{piece}.svg'
            pieceTheme: 'img/chesspieces/wikisvg/{piece}.svg'
        }
        board = Chessboard(element, config);
    }, []);

    useEffect(() => {
        if (board)
            board.position(props.position, false)
    }, [props.position]);

    useEffect(() => {
        if (board)
            board.resize()
        hl(props)
    }, [props.style.width]);

    useEffect(() => {
        unhl()
        hl(props)
    }, [props.squareStyles]);

    if (board)
        board.setConfig({
            onSquareClick: props.onSquareClick
        })

    // Render
    const _props = { style: { ...props.style } }
    return <div ref={el => element = el} {..._props} />
}

export default GGBoard;
