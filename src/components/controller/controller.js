import React from "react";
import {ButtonGroup, Card} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {Dialog} from "../dialog/dialog";
import {PGN} from "../pgn/pgn";

export function Controller() {
    return (
        <Card>
            <Card.Body className="d-flex flex-column">
                <PGN/>
                <Dialog/>
                <ButtonGroup size="sm">
                    <Button>Resign</Button>
                    <Button>Draw</Button>
                    <Button disabled>Abort</Button>
                </ButtonGroup>
            </Card.Body>
        </Card>
    )

}