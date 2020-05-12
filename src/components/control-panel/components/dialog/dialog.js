import React from "react";
import {Button, Card, ButtonGroup} from "react-bootstrap";

export const Dialog = (props) => (
    <Card>
        <Card.Body>
            <div className="d-flex flex-column alert alert-secondary">
                <h6 className="align-self-center mb-3">Accept Draw?</h6>
                <div className="d-inline-flex justify-content-around">
                    <Button size="sm" variant="primary">Yes</Button>
                    <Button size="sm" variant="secondary">No</Button>
                </div>
            </div>
            <div className="d-flex flex-column">
                <ButtonGroup size="sm">
                    <Button>Resign</Button>
                    <Button>Draw</Button>
                    <Button>Abort</Button>
                </ButtonGroup>
            </div>
        </Card.Body>
    </Card>
)
