import React from "react";
import {Button, InputGroup, Card, Form} from "react-bootstrap";

const loadPgn = () => {

}

export const AnalysisPanel = (props) => {

    const {height} = props

    return (
        <Card style={{maxHeight: height}}>
            <Card.Header>Analize the game</Card.Header>
                <Card.Body>
                    <InputGroup>
                        <Form.Group controlId="analysisForm.ControlPGN">
                            <Form.Label>Paste in PGN</Form.Label>
                            <Form.Control as="textarea" rows="4" style={{padding:0, resize: "none"}}/>
                            <Button variant="primary" type="submit" onClick={loadPgn}>Load</Button>
                        </Form.Group>
                    </InputGroup>
            </Card.Body>
        </Card>
    )
}
