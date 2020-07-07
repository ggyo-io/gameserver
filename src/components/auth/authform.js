import React from "react";
import {Button, Card} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import Alert from "react-bootstrap/Alert";

const renderLinks = (links) => {
    return links.map(link => <LinkContainer key={link.to} to={link.to}><a>{link.name}</a></LinkContainer>)
}

export const AuthForm = ({name, onSubmit, children, links, srvErr, srvInfo}) => {
    return <div className="container mt-5" style={{maxWidth: '33rem', minWidth: '20rem'}}>
        <div className="row justify-content-center">
            <div className="col-10">
                <Card style={{maxWidth: '100%'}}>
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
            </div>
        </div>
        {srvErr && <div className="row justify-content-center">
            <div className="col-10">
                <Alert style={{width: '100%'}} variant="danger">
                    <strong>Server error: </strong>
                    {srvErr}
                </Alert>
            </div>
        </div>}
        {srvInfo && <div className="row justify-content-center">
            <div className="col-10">
                <Alert style={{width: '100%'}} variant="info">
                    <strong>{srvInfo}</strong>
                </Alert>
            </div>
        </div>}
    </div>
}
