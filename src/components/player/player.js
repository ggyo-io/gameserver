import React, {useEffect} from "react";
import {Card} from "react-bootstrap";
import {useStoreActions, useStoreState} from "easy-peasy";

export function Player(props) {

    const setTime = useStoreActions(actions => actions.game.setTime)

    // top or bottom
    const posish = props.posish;
    const {turn, turnStart, startTurnClock} = useStoreState(state => state.game)
    const {name, elo, time} = useStoreState(state => state.game[posish])

    // timer
    if (turn === posish) {
        useEffect(() => {
            setInterval(() => {
                const elapsed = Math.round((Date.now() - turnStart) / 1000)
                const clock = startTurnClock - elapsed
                setTime({player: posish, time: clock})
            }, 100)
        })
    }

    // mm:ss
    const timeMin = Math.round(time / 60) + ":" + ('0' + time % 60).substr(-2)



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
                        <span className="ml-2" role="time">{timeMin}</span>
                    </span>
                </div>
            </Card.Body>
        </Card>
    )
}

