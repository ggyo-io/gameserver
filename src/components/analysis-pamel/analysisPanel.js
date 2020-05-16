import React from "react";
import {Button, InputGroup, Card, Form} from "react-bootstrap";

const loadPgn = () => {

}

export const AnalysisPanel = (props) => {

    return (
        <Card>
            <Card.Header>Analize the game</Card.Header>
                <Card.Body>
                    <InputGroup>
                        <Form.Group controlId="analysisForm.ControlPGN">
                            <Form.Label>Paste in PGN</Form.Label>
                            <Form.Control as="textarea" rows="25" />
                            <Button variant="primary" type="submit" onClick={loadPgn}>Load</Button>
                        </Form.Group>
                    </InputGroup>
            </Card.Body>
        </Card>
    )
}