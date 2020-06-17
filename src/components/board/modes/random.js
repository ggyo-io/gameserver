import Chess from "../../ggboard/chess.js/chess"
import React, {useEffect} from "react";
import {useStoreActions, useStoreState} from "easy-peasy";
import {Gameboard} from "../components/gameboard";
import {turnColor} from "../../../utils/turns";

const game = new Chess()

export const Random = (props) => {

    // Store state
    const {myColor, timeControl} =
        useStoreState(state => state.game)

    // Actions
    const {onMove, update, newGame} =
        useStoreActions(actions => actions.game)

    //
    // Local game vs. random
    const updateResult = () => {
        if (!game.game_over()) return
        let result = ''
        if (game.in_draw())
            result = '1/2-1/2'
        else if (turnColor(game.history().length) == 'white')
            result = '0-1'
        else
            result = '1-0'

        update({result: {outcome: result}})
    }

    const moveMade = () => {
        onMove({
            history: game.history({verbose: true}),
            localTime: true
        })
        updateResult()
    }

    const timer = () => setTimeout(() => makeRandomMove(), 200)

    const makeRandomMove = () => {
        let possibleMoves = game.moves()

        // exit if the game is over
        if (game.game_over() === true ||
            game.in_draw() === true ||
            possibleMoves.length === 0)
            return

        let randomIndex = Math.floor(Math.random() * possibleMoves.length)
        game.move(possibleMoves[randomIndex])
        moveMade()
    }

    const onMakeMove = (move) => {
        moveMade()
        timer()
    }

    useEffect(() => {
        newGame({
            Color: myColor === 'any' ? 'white' : myColor,
            BlackElo: 1,
            WhiteElo: 1300,
            WhiteClock: timeControl.seconds * 1000,
            BlackClock: timeControl.seconds * 1000,
        })
        if (myColor === 'black') timer()
    }, []);

    return (
        <Gameboard
            onMakeMove={onMakeMove}
            style={props.style}
            game={game}
        />
    )
}
