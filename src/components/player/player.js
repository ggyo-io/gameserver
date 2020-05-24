import React from "react";
import {Card} from "react-bootstrap";
import {useStoreState} from "easy-peasy";

export function Player(props) {

    // top or bottom
    const {name, elo} = useStoreState(state => state.game[props.posish])

    return (
        <Card>
            <Card.Body>
                <div className="d-flex justify-content-between">
                    <span className="mr-2" role="img">🕶
                        <span className="ml-2" role="user">{name}</span>
                        <span className="ml-2" role="img" aria-label="score">🏆
                            <span className="ml-2" role="value">{elo}</span>
                        </span>
                    </span>
                    <span className="mr-2" role="img" aria-label="clock">⌛
                        <span className="ml-2" role="time">15:00</span>
                    </span>
                </div>
            </Card.Body>
        </Card>
    )
}

