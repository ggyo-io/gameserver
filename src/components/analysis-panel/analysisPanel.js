import React, {useState} from "react";
import {Button, Card, Form, InputGroup} from "react-bootstrap";
import {useHistory} from "react-router-dom"


const textareaStyle = {
    padding: 0,
    resize: "none",
    backgroundColor: "#535960",
    color: "white",
    borderWidth: 0
}


export const AnalysisPanel = (props) => {
    const [state, setState] = useState({textArea: ""})
    const history = useHistory()

    const onClick = () => {
        history.push('/analysisboard', {game: {pgn: state.textArea}})
    };

    const onChange = (e) => {
        setState({textArea: e.target.value});
    }

    return <Card style={{maxHeight: props.height}}>
        <Card.Header>Analize the game</Card.Header>
        <Card.Body>
            <InputGroup>
                <Form.Group controlId="analysisForm.ControlPGN">
                    <Form.Label>Paste in PGN</Form.Label>
                    <Form.Control style={textareaStyle} as="textarea" rows="4" onChange={onChange}/>
                    <Button variant="primary" name="submitButton" type="submit" onClick={onClick}>Load</Button>
                </Form.Group>
            </InputGroup>
        </Card.Body>
    </Card>;
}
