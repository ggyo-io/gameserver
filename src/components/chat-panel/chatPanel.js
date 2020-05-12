import React from "react";
import {Button, InputGroup, Card, FormControl} from "react-bootstrap";
import "./chat.scss"

export const ChatPanel = (props) => (
        <Card>
            <Card.Header>Chat</Card.Header>
            <Card.Body>

            </Card.Body>
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
        </Card>
)