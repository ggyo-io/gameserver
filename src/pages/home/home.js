import React from "react";
import Button from "react-bootstrap/Button";
import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {History} from "../../components/history/history";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const Home = () => (
    <Container>
       <Row><h5>Time control</h5></Row>
        <Row>
        <ToggleButtonGroup size="lg" type="radio" name="time" defaultValue={[1]}>
            <ToggleButton value={1} variant="outline-secondary">5+0</ToggleButton>
            <ToggleButton value={2} variant="outline-secondary">10+0</ToggleButton>
            <ToggleButton value={3} variant="outline-secondary">10+5</ToggleButton>
            <ToggleButton value={4} variant="outline-secondary">15+15</ToggleButton>
        </ToggleButtonGroup>
        </Row>
        <p/>
        <Row><h5>Opponent</h5></Row>
        <Row>
        <ToggleButtonGroup size="lg" type="radio" name="time" defaultValue={["1"]}>
            <ToggleButton name="radio" value="1" variant="outline-secondary">Human</ToggleButton>
            <ToggleButton name="radio" value="2" variant="outline-secondary">Sotckfish</ToggleButton>
            <ToggleButton name="radio" value="3" variant="outline-secondary">Leela</ToggleButton>
        </ToggleButtonGroup>
        </Row>
        <p/><br/>
        <Row className="justify-content-md-center">
            <Col sm={9}>
            <Button
                size="lg"
                block
                onClick={() => console.log("play clicked")}
                href="/playboard">
                PLAY
            </Button></Col>

        </Row>
        {/*</div>*/}
        <p/><br/>
        <Row><h5>History</h5></Row>
        <Row><History/></Row>
    </Container>
)

