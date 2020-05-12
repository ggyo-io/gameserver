import React from "react";
import {ButtonGroup, Card, Button} from "react-bootstrap";
import {Dialog} from "../dialog/dialog";
import {PGN} from "../pgn/pgn";

export const ControlPanel = (props) => (
        <Card>
            <Card.Body>
                <div className="d-flex flex-column flex-fill justify-content-around">
                    <div className="box-item mb-2">
                        <PGN size={props.size}/>
                    </div>
                    <div className="box-item align-self-end">
                        <Dialog/>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );