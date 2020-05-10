import React from "react";
import {Pagination} from "react-bootstrap";
import "./pgn.scss"

export function PGN(props) {

    const mvstrs = ['1. e2e4', '1. rf1', '2. d2d4',
        '2. e2e4', '3. rf1', '3. d2d4', '4. d2d4','4. e2e4',];
    const moves = mvstrs.map((move, index) => (
        <Pagination.Item className="pgn-item" key={move} active={index==mvstrs.length-1?true:false}>{move}</Pagination.Item>
    ))

    return (
        <Pagination name="PGN">
            <Pagination.First />
            <Pagination.Prev />
            {moves}
            <Pagination.Next />
            <Pagination.Last />
        </Pagination>
    )
}