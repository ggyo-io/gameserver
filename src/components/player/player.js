import React, {useEffect, useState} from "react";
import {Card} from "react-bootstrap";
import {useStoreState} from "easy-peasy";

export function Player(props) {

    const [time, setTime] = useState(15 * 60)

    // top or bottom
    const posish = props.posish;
    const {turn, lastMoveTimestamp, result} = useStoreState(state => state.game)
    const {name, elo, serverTime} = useStoreState(state => state.game[posish])

    // timer
    useEffect(() => {
        if (posish === turn && !result) {
            const interval = setInterval(() => {
                const elapsed = Math.round((Date.now() - lastMoveTimestamp) / 1000)
                const clock = serverTime - elapsed
                setTime(clock > 0 ? clock : 0)
            }, 100)
            return () => clearInterval(interval)
        }
    }, [turn, lastMoveTimestamp, serverTime, posish, result])

    // mm:ss
    const timeMin = Math.floor(time / 60) + ":" + ('0' + time % 60).substr(-2)

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

