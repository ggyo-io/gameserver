import React, { useEffect } from 'react'
import './chessboardjs/chessboard-1.0.0.css'
import { Chessboard } from './chessboardjs/chessboard-1.0.0'

const GGBoard = (props) => {
    let board = null;
    let element = null;

    useEffect(() => {
        const config = {
            draggable: true,
            position: props.position,
            onDragStart: props.onDragStart,
            onDrop: props.onDrop,
            pieceTheme: 'img/chesspieces/merida/{piece}.svg'
        }
        board = Chessboard(element, config);

        const { squareStyles } = props
        for (let [key, value] of Object.entries(squareStyles)) {
            console.log(`${key}: ${JSON.stringify(value)}`);
            const el = document.querySelector(".square-" + key)
            if (el)
                Object.assign(el.style, value)
        }
    });

    // Render
    const _props = { style: { ...props.style } }
    return <div ref={el => element = el} {..._props} />
}

export default GGBoard;
