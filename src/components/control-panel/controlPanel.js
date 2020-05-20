import React from "react";
import {Card} from "react-bootstrap";
import {Dialog} from "./components/dialog/dialog";
import {PGN} from "./components/pgn/pgn";

export const ControlPanel = (props) => (
    <Card style={{minWidth: 230}}>
        <Card.Body>
            <div className="d-flex flex-column flex-fill justify-content-around">
                <div className="box-item mb-2">
                    <PGN {...props}/>
                </div>
                <div className="box-item">
                    <Dialog/>
                </div>
            </div>
        </Card.Body>
    </Card>
)
