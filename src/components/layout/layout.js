import React from 'react';
import { Container } from 'react-bootstrap';

export const Layout = (props) => (
    <Container className="pt-4">
        {props.children}
    </Container>
)