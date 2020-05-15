import React from "react";
import { Card, Button, Form } from "react-bootstrap";

export const Reset = (props) => {
    return (

<Card>
    <Card.Body>
        <Card.Title>Reset Password</Card.Title>
        
        <Form>
            <Form.Group controlId="formResetcEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">Submit</Button>
        </Form>
        
    </Card.Body>
</Card>
        
)}