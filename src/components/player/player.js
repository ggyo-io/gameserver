import React, {useEffect, useState} from "react";
import {Button, Card, OverlayTrigger} from "react-bootstrap";
import {useStoreState} from "easy-peasy";
import {timeMin} from "../../utils/time";
import {useRegisterCmd} from "../ws/ws";
import Tooltip from "react-bootstrap/Tooltip";

export function Player(props) {

    const [time, setTime] = useState("00:00")

    // top or bottom
    const posish = props.posish;
    const {mode, browseIndex, gameTurn, browseTurn, lastMoveTimestamp, history, result,
        orientation, myColor, opponentOnline} = useStoreState(state => state.game)
    const {name, elo, serverTime} = useStoreState(state => state.game[posish])

    const currentBrowseMove = (mode === 'analysis') && ( posish === browseTurn ) && (browseIndex !== 0) && ((browseIndex !== history.length))
    const shouldTick = posish === gameTurn && !result
    const shouldMark = shouldTick || currentBrowseMove
    const isOpponent = orientation === myColor && posish === "top" || orientation !== myColor && posish === "bottom"
    const online = !isOpponent || opponentOnline

    console.log("player " + posish + " opponent = " + isOpponent + " online = " + online)


    // timer
    useEffect(() => {
        if (shouldTick) {
            const interval = setInterval(() => {
                const elapsed = Date.now() - lastMoveTimestamp
                const clock = serverTime - elapsed
                setTime(timeMin(clock > 0 ? clock : 0))
            }, 100)
            return () => clearInterval(interval)
        } else {
            if (serverTime !== undefined)
                setTime(timeMin(serverTime))
        }
    }, [gameTurn, lastMoveTimestamp, serverTime, posish, result])


    return (
        <Card>
            <Card.Body>
                <div className="d-flex justify-content-between">
                    <span className="mr-2" role="img">
                        <OverlayTrigger placement="bottom" overlay={
                            <Tooltip>
                                {online ? "Online" : "Disconnected"}
                            </Tooltip>
                        }>
                            <button className={"badge badge-pill " + (online ? "badge-success" : "badge-secondary")}>&nbsp;</button>
                        </OverlayTrigger>
                        <span className="ml-2" role="user">{name}</span>
                        <span className="ml-2" role="img" aria-label="score">🏆
                            <span className="ml-2" role="value">{elo}</span>
                        </span>
                    </span>
                    <span className={shouldMark ? "text-warning ml-2" : "ml-2" } role="img" aria-label="clock">{shouldMark ? '⌛' : ''}
                        <span className="ml-2 text-monospace" role="time">{time}</span>
                    </span>
                </div>
            </Card.Body>
        </Card>
    )
}

