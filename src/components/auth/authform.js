import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {Button, Card} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

const renderLinks = (links) => {
    return links.map(link => <LinkContainer key={link.to} to={link.to}><a>{link.name}</a></LinkContainer>)
}

export const AuthForm = ({name, onSubmit, children, links}) => {
    return <Container className="mt-5">
        <Row className="justify-content-center">
            <Card style={{width: '27rem'}}>
                <Card.Header>
                    <Card.Title><h2>{name}</h2></Card.Title>
                </Card.Header>
                <Card.Body>
                    <form className="mx-3" onSubmit={onSubmit}>
                        {children}
                        <div className="text-center mt-5 mb-2">
                            <Button style={{width: '70%', whiteSpace: 'nowrap'}}
                                    size="lg" variant="primary" type="submit">{name}</Button>
                        </div>
                    </form>
                </Card.Body>
                <Card.Footer>
                    <div className="d-flex justify-content-between">
                        {renderLinks(links)}
                    </div>
                </Card.Footer>
            </Card>
        </Row>
    </Container>
}
