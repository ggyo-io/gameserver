import React, { useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { useStoreActions } from 'easy-peasy'
import Chess from '../ggboard/chess.js/chess'


const textareaStyle = {
    padding: 0,
    resize: "none",
    backgroundColor: "#535960",
    color: "white",
    borderWidth: 0
}

const game = new Chess()

export const AnalysisPanel = (props) => {
    const [state, setState] = useState({ textArea: "" })
    const update = useStoreActions(actions => actions.game.update)

    const onClick = () => {
        if (game.load_pgn(state.textArea, { sloppy: true })) {
            update({
                position: 'start',
                history: game.history({ verbose: true }),
                browseIndex: 0,
                pieceSquare: '',
            })
            setState({ textArea: '' });
        }

    };

    const onChange = (e) => {
        setState({ textArea: e.target.value });
    }

    return <Card style={{ maxHeight: props.height }}>
        <Card.Header>Analize the game</Card.Header>
        <Card.Body>
            <InputGroup>
                <Form.Group controlId="analysisForm.ControlPGN">
                    <Form.Label>Paste in PGN</Form.Label>
                    <Form.Control style={textareaStyle} as="textarea" value={state.textArea} rows="4" onChange={onChange} />
                    <Button variant="primary" name="submitButton" type="submit" onClick={onClick}>Load</Button>
                </Form.Group>
            </InputGroup>
        </Card.Body>
    </Card>;
}
