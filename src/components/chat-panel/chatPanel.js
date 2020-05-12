import React from "react";
import {Button, InputGroup, Card, FormControl} from "react-bootstrap";
import "./chat.scss"

export const ChatPanel = (props) => (
    <div className={"chat d-flex flex-column " + props.className}>
        <Card className="flex-fill chat-card">
            <Card.Header>Chat</Card.Header>
            <Card.Body>

            </Card.Body>
        </Card>
        <InputGroup>
            <FormControl
                placeholder="message"
                aria-label="message"
                aria-describedby="basic-addon"
            />
            <InputGroup.Append>
                <Button variant="secondary">Send</Button>
            </InputGroup.Append>
        </InputGroup>
    </div>
)