import React from "react";
import {Card} from "react-bootstrap";

export function Player(props) {
    return (
        <Card>
            <Card.Body>
                <div className="d-flex justify-content-between">
                    <span className="mr-2" role="img">🕶
                        <span className="ml-2" role="user">Puta</span>
                        <span className="ml-2" role="img" aria-label="score">🏆
                            <span className="ml-2" role="value">1984</span>
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

