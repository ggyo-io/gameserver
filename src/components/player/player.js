import React from "react";
import "./player.scss"


export function Player(props) {
    return (
        <div className="user-card d-inline-flex bd-highlight p-2 rounded-sm align-items-center">
            <h1 role="clock" className="p-2 bd-highlight">
                <span className="mr-2" role="img" aria-label="clock">⌛</span>
                <span role="time">15:00</span>
            </h1>
            <div role="user-data" className="p-2 bd-highlight">
                <h5>
                    <span className="mr-2" role="img">🕶</span>
                    <span role="user">Puta</span>
                </h5>
                <h5>
                    <span className="mr-2" role="img" aria-label="score">🏆</span>
                    <span role="value">1984</span>
                </h5>
            </div>
        </div>
    )
}



