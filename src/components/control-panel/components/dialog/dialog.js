import React from "react";
import {Button, ButtonGroup, Card} from "react-bootstrap";
import {useStoreState} from "easy-peasy";
import {actionHandlers} from "./actionHandlers";
import {Confirm} from "./confirm";


export const Dialog = () => {
    const dialogLabel = useStoreState(state => state.game.dialogLabel)
    const actions = actionHandlers()

    return (
        <Card>
            <Card.Body>
                { !!dialogLabel && <Confirm dialog={dialogLabel}/> }
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
