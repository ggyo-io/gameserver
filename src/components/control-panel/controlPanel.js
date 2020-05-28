import React from "react";
import {Card} from "react-bootstrap";
import {PGN} from "./components/pgn/pgn";
import {useStoreState} from "easy-peasy";
import {Result} from "./components/result/result";
import {Dialog} from "./components/dialog/dialog";

export const ControlPanel = (props) => {
    const mode = useStoreState(state => state.game.mode)
    const result = useStoreState(state => state.game.result)
    const modeView = mode === 'analysis' || result !== ''? <Result/> : <Dialog/>

    return (
        <Card style={{minWidth: 230}}>
            <Card.Body>
                <div className="d-flex flex-column flex-fill justify-content-around">
                    <div className="box-item mb-2">
                        <PGN size={props.size}/>
                    </div>
                    <div className="box-item">
                        {modeView}
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}

