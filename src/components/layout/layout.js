import React from 'react';
import { Container } from 'react-bootstrap';

export const Layout = (props) => (
    <Container className="pt-3">
        {props.children}
    </Container>
)