import React from "react";
import { Card, Button, Form } from "react-bootstrap";

export const Register = (props) => {
    return (

<Card>
    <Card.Body>
        <Card.Title>Register</Card.Title>
        
        <Form>
            <Form.Group controlId="formRegistercEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
            </Form.Group>

            <Form.Group controlId="formRegisterPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Form.Group controlId="formRegisterPasswordRepeat">
                <Form.Label>Repeat Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            
            <Button variant="primary" type="submit">Submit</Button>
        </Form>
        
    </Card.Body>
</Card>
        
)}