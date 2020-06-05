import React from "react";
import Button from "react-bootstrap/Button";
import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useStoreActions, useStoreState} from "easy-peasy";
import {LinkContainer} from "react-router-bootstrap";


export const ChooseGame = () => {
    const myColor = useStoreState(state => state.game.myColor)
    const opponent = useStoreState(state => state.game.opponent)
    const timeControl = useStoreState(state => state.game.timeControl)
    const update = useStoreActions(actions => actions.game.update)
    const doColorChange = (v) => update({myColor: v})
    const doOpponentChange = (v) => update({opponent: v})
    const doTimeControlChange = (v) => {
        const pair = v.split('+')
        update({timeControl: {
            seconds: pair[0] * 60,
            increment: pair[1]
        }})
    }

    const playColor = () => myColor === 'any' ? 'white' : myColor

    const newGame = () =>
        update({
            history: [],
            browseIndex: 0,
            pieceSquare: '',
            dropSquare: '',
            result: '',
            orientation: playColor(),
            myColor: playColor(),
            top: {
                name: 'Lasker',
                elo: '3100',
                serverTime: timeControl.seconds,
            },
            bottom: {
                name: 'Nakamura',
                elo: '3200',
                serverTime: timeControl.seconds,
            },
            lastMoveTimestamp: Date.now(),
        })

    return <Container>
       <Row><h5>Time control</h5></Row>
        <Row>
        <ToggleButtonGroup
            size="lg" type="radio" name="timeControl"
            defaultValue={(timeControl.seconds / 60).toString() + '+' +
                           timeControl.increment.toString()}
            onChange={doTimeControlChange}
        >
            <ToggleButton value={'5+0'} variant="outline-secondary">5+0</ToggleButton>
            <ToggleButton value={'10+0'} variant="outline-secondary">10+0</ToggleButton>
            <ToggleButton value={'10+5'} variant="outline-secondary">10+5</ToggleButton>
            <ToggleButton value={'15+15'} variant="outline-secondary">15+15</ToggleButton>
        </ToggleButtonGroup>
        </Row>
        <p/>
        <Row><h5>Opponent</h5></Row>
        <Row>
        <ToggleButtonGroup
            size="lg" type="radio" name="opponent"
            defaultValue={opponent}
            onChange={doOpponentChange}
        >
            <ToggleButton value="human" variant="outline-secondary">Human</ToggleButton>
            <ToggleButton value="stockfish" variant="outline-secondary">Sotckfish</ToggleButton>
            <ToggleButton value="leela" variant="outline-secondary">Leela</ToggleButton>
        </ToggleButtonGroup>
        </Row>
        <p/>
        <Row><h5>Your color</h5></Row>
        <Row>
        <ToggleButtonGroup
            size="lg" type="radio" name="color"
            defaultValue={myColor}
            onChange={doColorChange}
        >
            <ToggleButton value='any' variant="outline-secondary">Any</ToggleButton>
            <ToggleButton value='white' variant="outline-secondary">White</ToggleButton>
            <ToggleButton value='black' variant="outline-secondary">Black</ToggleButton>
        </ToggleButtonGroup>
        </Row>
        <p/><br/>
        <Row className="justify-content-md-center">
            <Col sm={9}>
                <LinkContainer to="/playboard">
                    <Button
                        size="lg"
                        block
                        onClick={newGame}>PLAY
                    </Button>
                </LinkContainer>
            </Col>
        </Row>
    </Container>
}
