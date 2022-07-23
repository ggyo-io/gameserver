import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import './chessboardjs/chessboard-1.0.0.scss'
import { Chessboard } from './chessboardjs/chessboard-1.0.0'
import { Promote } from "../board/components/promote";
import MatchModal from "../board/components/matchModal";
import { useStoreState, useStoreActions } from "easy-peasy";
import { wsSend } from '../../components/ws/ws'

const unhl = () => {
    const squareClass = '.square-55d63'
    const highlights = ['possible-move', 'selected-square', 'in-check', 'piece-square', 'drop-square']

    highlights.forEach((cn) => {
        document.querySelectorAll(squareClass).forEach((el) => {
            el.classList.remove(cn);
        })
    });
}

const hl = (props) => {
    const {squareStyles} = props
    for (let [key, value] of Object.entries(squareStyles)) {
        const el = document.querySelector(".square-" + key)
        if (el)
            value.forEach((v) => el.classList.add(v))
    }
}

let board

const GGBoard = (props) => {
    let element = null;
    const orientation = useStoreState(state => state.game.orientation)

    useEffect(() => {
        const config = {
            draggable: true,
            position: props.position,
            orientation: orientation,
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
            board.orientation(orientation)
        hl(props)
    }, [orientation]);

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
            onDrop: props.onDrop,
            onSquareClick: props.onSquareClick,
            onMouseoverSquare: props.onMouseoverSquare,
            onMouseoutSquare: props.onMouseoutSquare,
            onDragStart: props.onDragStart,
            onDragMove: props.onDragMove,
            onSnapbackEnd: props.onSnapbackEnd
        })

    // modals
    const {promote, match} = useStoreState(state => state.game)
    const {update} = useStoreActions(actions => actions.game)
    const navigate = useNavigate()
    const closeMatch = () => {
        update({match: false})
        wsSend({Cmd: "cancel"})
        navigate('/')
    }

    // Render
    const _props = {style: {...props.style}}
    return (
        <>
            {promote? <Promote/> : null}
            {match? <MatchModal handleClose={closeMatch}/> : null}
            <div ref={el => element = el} {..._props} />
        </>
    )
}

export default GGBoard;
