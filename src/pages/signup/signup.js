import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {Login} from "../../components/auth/components/login/login";
import {Register} from "../../components/auth/components/register/register";
import {Reset} from "../../components/auth/components/reset/reset";

export function Signup(props) {
    return (
        <Container>
            <Row><h1>Authentication</h1></Row>
            <Row><Login /></Row>
            <Row ><Register /></Row>
            <Row><Reset /></Row>
        </Container>
    )
}