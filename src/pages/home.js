import React from "react";
import Button from "react-bootstrap/Button";
import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {History} from "../components/history";

export const Home = () => (
    <div>
        <h5>Time control</h5>
        <ToggleButtonGroup size="lg" type="radio" name="time" defaultValue={[1]}>
            <ToggleButton value={1} variant="outline-secondary">5+0</ToggleButton>
            <ToggleButton value={2} variant="outline-secondary">10+0</ToggleButton>
            <ToggleButton value={3} variant="outline-secondary">10+5</ToggleButton>
            <ToggleButton value={4} variant="outline-secondary">15+15</ToggleButton>
        </ToggleButtonGroup>
        <p/>
        <h5>Opponent</h5>
        <ToggleButtonGroup size="lg" type="radio" name="time" defaultValue={["1"]}>
            <ToggleButton name="radio" value="1" variant="outline-secondary">Human</ToggleButton>
            <ToggleButton name="radio" value="2" variant="outline-secondary">Sotckfish</ToggleButton>
            <ToggleButton name="radio" value="3" variant="outline-secondary">Leela</ToggleButton>
        </ToggleButtonGroup>
        <p/><br/>
        <Button
            variant="secondary"
            size="lg" block
            onClick={() => console.log("play clicked")}
            href="/play"
        >
            PLAY
        </Button>
        <p/><br/>
        <h5>History</h5>
        <History/>
    </div>

)

