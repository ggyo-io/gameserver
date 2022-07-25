import React from "react";
import Button from "react-bootstrap/Button";
import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useStoreActions, useStoreState} from "easy-peasy";
import {useNavigate} from "react-router-dom";
import {playClick} from "../../utils/playClick";


export const ChooseGame = () => {
    const navigate = useNavigate()
    const {colorPreference, opponent, timeControl} = useStoreState(state => state.game)
    const {update, newGame} = useStoreActions(actions => actions.game)

    const doClickPlay = () => playClick(navigate, update, newGame, opponent, colorPreference, timeControl)
    const doColorChange = (v) => update({colorPreference: v})
    const doOpponentChange = (v) => update({opponent: v})
    const doTimeControlChange = (v) => {
        const pair = v.split('+')
        update({
            timeControl: {
                seconds: pair[0] * 60,
                increment: pair[1]
            }
        })
    }

    return <>
        <Container>
        <Row><h5>Time control</h5></Row>
        <Row>
            <ToggleButtonGroup
                size="lg" type="radio" name="timeControl"
                value={(timeControl.seconds / 60).toString() + '+' +
                timeControl.increment.toString()}
                onChange={doTimeControlChange}
            >
                <ToggleButton id="time-5-0" value={'5+0'} variant="outline-secondary">5+0</ToggleButton>
                <ToggleButton id="time-10-0" value={'10+0'} variant="outline-secondary">10+0</ToggleButton>
                <ToggleButton id="time-10-5" value={'10+5'} variant="outline-secondary">10+5</ToggleButton>
                <ToggleButton id="time-15-15" value={'15+15'} variant="outline-secondary">15+15</ToggleButton>
            </ToggleButtonGroup>
        </Row>
        <p/>
        <Row><h5>Opponent</h5></Row>
        <Row>
            <ToggleButtonGroup size="lg" type="radio" name="opponent" value={opponent} onChange={doOpponentChange}>
                <ToggleButton id="opponent-human" value="human" variant="outline-secondary">Human</ToggleButton>
                <ToggleButton id="opponent-random" value="random" variant="outline-secondary">Random</ToggleButton>
                <ToggleButton id="opponent-stockfish" value="stockfish" variant="outline-secondary">Sotckfish</ToggleButton>
                <ToggleButton id="opponent-lc0" value="lc0" variant="outline-secondary">Leela</ToggleButton>
            </ToggleButtonGroup>
        </Row>
        <p/>
        <Row><h5>Your color</h5></Row>
        <Row>
            <ToggleButtonGroup size="lg" type="radio" name="color" value={colorPreference} onChange={doColorChange}>
                <ToggleButton id="color-any"   value='any' variant="outline-secondary">Any</ToggleButton>
                <ToggleButton id="color-white" value='white' variant="outline-secondary">White</ToggleButton>
                <ToggleButton id="color-black" value='black' variant="outline-secondary">Black</ToggleButton>
            </ToggleButtonGroup>
        </Row>
        <p/><br/>
        <Row className="justify-content-md-center">
            <Col sm={9}>
                <Button size="lg" block="true" onClick={doClickPlay}>PLAY</Button>
            </Col>
        </Row>
    </Container>
    </>
}
