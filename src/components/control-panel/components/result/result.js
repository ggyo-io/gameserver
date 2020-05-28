import React from "react";
import {Card} from "react-bootstrap";
import {useStoreState} from "easy-peasy";

export const Result = (props) => {
    const result = useStoreState(state => state.game.result)
    return (
        <Card>
            <Card.Header>Result</Card.Header>
            <Card.Body>{result}</Card.Body>
        </Card>
    )
}
