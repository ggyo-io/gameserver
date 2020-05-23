import React from "react";
import {Button, ButtonGroup, Card} from "react-bootstrap";
import {useStoreState} from "easy-peasy";
import {actionHandlers} from "./actionHandlers";


export const Dialog = () => {
    const dialogLabel = useStoreState(state => state.game.dialogLabel)
    const actions = actionHandlers()

    return (
        <Card>
            <Card.Body>
                {dialogLabel ?
                    <div className="d-flex flex-column alert alert-secondary">
                        <h6 className="align-self-center mb-3">{dialogLabel}</h6>
                        <div className="d-inline-flex justify-content-around">
                            <Button size="sm" onClick={actions.yesClick} variant="primary" name="yes">Yes</Button>
                            <Button size="sm" onClick={actions.noClick} variant="secondary" name="no">No</Button>
                        </div>
                    </div>
                    : null
                }
                <div className="d-flex flex-column">
                        <ButtonGroup size="sm">
                        <Button name="dialog_resign" onClick={actions.dialogClick}>Resign</Button>
                        <Button name="dialog_draw" onClick={actions.dialogClick}>Draw</Button>
                    </ButtonGroup>
                </div>
            </Card.Body>
        </Card>
    )
};
