import React from "react";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

export function PGN(props) {

    const moves = ['1. e2e4', '1. rf1', '2. d2d4',
        '2. e2e4', '3. rf1', '3. d2d4', '4. d2d4','4. e2e4',].map((move) => (
        <ToggleButton value={move} variant="outline-secondary" >{move}</ToggleButton>
    ))

    return (
        <ToggleButtonGroup name="PGN">
            <ToggleButton value="back" variant="outline-secondary" >←</ToggleButton>
            {moves}
            <ToggleButton value="forward" variant="outline-secondary" >→</ToggleButton>
        </ToggleButtonGroup>
    )
}