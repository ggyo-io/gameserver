import React from "react";
import Button from "react-bootstrap/Button";
import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useStoreActions, useStoreState} from "easy-peasy";
import {useHistory} from "react-router-dom";
import {playClick} from "../../utils/playClick";


export const ChooseGame = () => {
    const routerHistory = useHistory()
    const {colorPreference, opponent, timeControl} = useStoreState(state => state.game)
    const {update} = useStoreActions(actions => actions.game)

    const doClickPlay = () => playClick(routerHistory, update, opponent, colorPreference, timeControl)
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
            <ToggleButtonGroup size="lg" type="radio" name="opponent" defaultValue={opponent} onChange={doOpponentChange}>
                <ToggleButton value="human" variant="outline-secondary">Human</ToggleButton>
                <ToggleButton value="random" variant="outline-secondary">Random</ToggleButton>
                <ToggleButton value="stockfish" variant="outline-secondary">Sotckfish</ToggleButton>
                <ToggleButton value="lc0" variant="outline-secondary">Leela</ToggleButton>
            </ToggleButtonGroup>
        </Row>
        <p/>
        <Row><h5>Your color</h5></Row>
        <Row>
            <ToggleButtonGroup size="lg" type="radio" name="color" defaultValue={colorPreference} onChange={doColorChange}>
                <ToggleButton value='any' variant="outline-secondary">Any</ToggleButton>
                <ToggleButton value='white' variant="outline-secondary">White</ToggleButton>
                <ToggleButton value='black' variant="outline-secondary">Black</ToggleButton>
            </ToggleButtonGroup>
        </Row>
        <p/><br/>
        <Row className="justify-content-md-center">
            <Col sm={9}>
                <Button size="lg" block onClick={doClickPlay}>PLAY</Button>
            </Col>
        </Row>
    </Container>
    </>
}
