import React from "react";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import {Pagination} from "react-bootstrap";

export function PGN(props) {

    const moves = ['1. e2e4', '1. rf1', '2. d2d4',
        '2. e2e4', '3. rf1', '3. d2d4', '4. d2d4','4. e2e4',].map((move) => (
        <Pagination.Item key={move} variant="outline-secondary" >{move}</Pagination.Item>
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