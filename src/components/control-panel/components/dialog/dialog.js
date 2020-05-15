import React from "react";
import {Button, Card, ButtonGroup} from "react-bootstrap";
import createComponent from 'core/manageComponent';
import {actionHandlers} from "./actionHandlers";


const view = (props) => {
console.info(props)
const {currentLabel, click} = props;
    return <Card>
        <Card.Body>
            {currentLabel ?
                <div className="d-flex flex-column alert alert-secondary">
                    <h6 className="align-self-center mb-3">{currentLabel}</h6>
                    <div className="d-inline-flex justify-content-around">
                        <Button size="sm" onClick={click} variant="primary" name="yes">Yes</Button>
                        <Button size="sm" onClick={click} variant="secondary" name="no">No</Button>
                    </div>
                </div>
                : null
            }
            <div className="d-flex flex-column">
                <ButtonGroup size="sm">
                    <Button name="dialog_resign" onClick={click} >Resign</Button>
                    <Button name="dialog_draw" onClick={click}>Draw</Button>
                    <Button name="dialog_abort" onClick={click}>Abort</Button>
                </ButtonGroup>
            </div>
        </Card.Body>
    </Card>
}

export const Dialog = () =>  createComponent({
    view,
    actionHandlers,
    initialState: {
        currentLabel: null,
        currentTime: 'time'
    }
});
