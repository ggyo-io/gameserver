import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

export const Dialog = (props) => (
    <div className="alert alert-dismissible alert-secondary">
        <Container>
            <Row className="mb-3">
                <button type="button" className="close" data-dismiss="alert">&times;</button>
                <strong>Accept Draw?</strong>
            </Row>
            <Row>
                <Col className="d-flex flex-row justify-content-end">
                    <Button size="sm" className="mr-1">Yes</Button>
                    <Button size="sm">No</Button>
                </Col>
            </Row>
        </Container>
    </div>
)
