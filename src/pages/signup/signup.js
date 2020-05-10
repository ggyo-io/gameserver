import React from "react";
import {Card, Form} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
export function Signup(props) {
    return (
        <Card>
            <Card.Title>Sign Up</Card.Title>
            <Card.Body>
                <Form>
                    <InputGroup></InputGroup>
                </Form>
            </Card.Body>
        </Card>
    )
}