import React from "react";
import {Pagination} from "react-bootstrap";

export function PGN(props) {

    const mvstrs = ['1. e2e4', '1. rf1', '2. d2d4',
        '2. e2e4', '3. rf1', '3. d2d4', '4. d2d4','4. e2e4',];
    const moves = mvstrs.map((move, index) => (
        <Pagination.Item key={move} active={index==mvstrs.length-1?true:false}>{move}</Pagination.Item>
    ))
    // moves[moves.length-1].props.active = true;

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