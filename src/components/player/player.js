import React from "react";
import Card from "react-bootstrap/Card";

export function Player(props) {
    return (
        <Card>
            <Card.Body className="d-inline-flex bd-highlight p-2 rounded-sm align-items-center justify-content-center">
                <div role="user-data" className="p-2 bd-highlight">
                    <div className="d-flex">
                        <span className="mr-2" role="img">🕶</span>
                        <span role="user">Puta</span>
                    </div>
                    <div className="d-flex">
                        <span className="mr-2" role="img" aria-label="score">🏆</span>
                        <span role="value">1984</span>
                    </div>
                </div>
                <div role="clock" className="p-2 bd-highlight d-flex">
                    <span className="mr-2" role="img" aria-label="clock">⌛</span>
                    <span role="time">15:00</span>
                </div>
            </Card.Body>
        </Card>
    )
}

