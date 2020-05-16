import React from "react";
import {Card} from "react-bootstrap";
import {Dialog} from "./components/dialog/dialog";
import {PGN} from "./components/pgn/pgn";
import createComponent from "core/manageComponent";
import {actionHandlers} from "./actionHandlers";


const view = (props) => {
   const {properties} = props;
    return <Card>
        <Card.Body>
            <div className="d-flex flex-column flex-fill justify-content-around">
                <div className="box-item mb-2">
                    <PGN size={properties.size}/>
                </div>
                <div className="box-item">
                    <Dialog/>
                </div>
            </div>
        </Card.Body>
    </Card>
};

export const ControlPanel = (properties) =>  createComponent({
    view,
    name: 'controlPanel',
    actionHandlers,
    properties,
    initialState: {
      testState: null
    }
});