import React, {useEffect, useState} from "react";
import {Card} from "react-bootstrap";
import {useStoreState} from "easy-peasy";

export function Player(props) {

    const [time, setTime] = useState(0)

    // top or bottom
    const posish = props.posish;
    const {mode, browseIndex, gameTurn, browseTurn, lastMoveTimestamp, result} = useStoreState(state => state.game)
    const {name, elo, serverTime} = useStoreState(state => state.game[posish])

    const currentBrowseMove = (mode === 'analysis') && ( posish === browseTurn ) && (browseIndex !== 0)
    const shouldTick =  (posish === gameTurn && !result);
    const shouldMark = shouldTick || currentBrowseMove

    // timer
    useEffect(() => {
        if (shouldTick) {
            const interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - lastMoveTimestamp) / 1000)
                const clock = serverTime - elapsed
                setTime(clock > 0 ? clock : 0)
            }, 100)
            return () => clearInterval(interval)
        } else {
            if (serverTime !== undefined)
                setTime(serverTime)
        }
    }, [gameTurn, lastMoveTimestamp, serverTime, posish, result])

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
                    <span className={shouldMark ? "text-warning ml-2" : "ml-2" } role="img" aria-label="clock">{shouldMark ? '⌛' : ''}
                        <span className="ml-2 text-monospace" role="time">{timeMin}</span>
                    </span>
                </div>
            </Card.Body>
        </Card>
    )
}

