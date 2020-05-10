import React from "react";
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
const moves = ['1. e2e4', '1. rf1', '2. d2d4',
    '2. e2e4', '3. rf1', '3. d2d4', '4. d2d4','4. e2e4','1. e2e4', '1. rf1', '2. d2d4',
    '2. e2e4', '3. rf1', '3. d2d4', '4. d2d4','4. e2e4',];

export const Moves = () => {
    return <ButtonGroup vertical>
            {
                moves.map((value, key) => <Button variant="outline-warning" size="sm" key={key}>{`${value}`}</Button>)
            }
        </ButtonGroup>
}