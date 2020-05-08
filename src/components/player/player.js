import React from "react";
import Card from "react-bootstrap/Card";

export function Player(props) {
    return (
        <Card>
            <Card.Body className="user-card d-inline-flex bd-highlight p-2 rounded-sm align-items-center">
                <h1 role="clock" className="p-2 bd-highlight d-flex  flex-row">
                    <span className="mr-2" role="img" aria-label="clock">⌛</span>
                    <span role="time">15:00</span>
                </h1>
                <div role="user-data" className="p-2 bd-highlight">
                    <h5 className="d-flex flex-row">
                        <span className="mr-2" role="img">🕶</span>
                        <span role="user">Puta</span>
                    </h5>
                    <h5 className="d-flex flex-row">
                        <span className="mr-2" role="img" aria-label="score">🏆</span>
                        <span role="value">1984</span>
                    </h5>
                </div>
            </Card.Body>
        </Card>
    )
}

