import React from "react";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "./chat.scss"

export const Chat = (props) => (
    <div className={"chat d-flex flex-column " + props.className}>
        <Card className="flex-fill chat-card">
            <Card.Header>Chat</Card.Header>
            <Card.Body>

            </Card.Body>
        </Card>
        <InputGroup className="mb-3">
            <FormControl
                placeholder="message"
                aria-label="message"
                aria-describedby="basic-addon"
            />
            <InputGroup.Append>
                <InputGroup.Text id="basic-addon">Send</InputGroup.Text>
            </InputGroup.Append>
        </InputGroup>
    </div>
)