import React from "react";
import "./player.css"


export function Player(props) {
    const className = "player " + props.position;
    return (
        <div className={className}>
            <div className="clock"><span role="img" aria-label="glass watch">⌛</span> 15:00</div>
            <div className="name">🕶&nbsp;Puta</div>
            <div className="elo"><span role="img" aria-label="score">🏆</span>&nbsp;1984</div>
        </div>
    )
}



