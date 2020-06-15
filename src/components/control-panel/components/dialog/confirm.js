import React from "react";
import {Button} from "react-bootstrap";
import {actionHandlers} from "./actionHandlers";
import {constants} from "./constants";

export const Confirm = (props) => {
    const actions = actionHandlers()
    const { dialogs } = constants

    return <div className="d-flex flex-column alert alert-secondary">
        <h6 className="align-self-center mb-3">{dialogs[props.dialog]}</h6>
        <div className="d-inline-flex justify-content-around">
            <Button size="sm" onClick={actions.yesClick} variant="primary" name="yes">Yes</Button>
            <Button size="sm" onClick={actions.noClick} variant="secondary" name="no">No</Button>
        </div>
    </div>
}
