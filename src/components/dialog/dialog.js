import React from "react";
import {Container, Row, Col, Button, Card, ButtonGroup} from "react-bootstrap";

export const Dialog = (props) => (
    <Card>
        <Card.Body>
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
            <div className="d-flex flex-column">
                <ButtonGroup size="sm">
                    <Button>Resign</Button>
                    <Button>Draw</Button>
                    <Button disabled>Abort</Button>
                </ButtonGroup>
            </div>
        </Card.Body>
    </Card>
)
