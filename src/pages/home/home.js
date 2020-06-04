import React from "react";
import {History} from "../../components/history/history";
import {ChooseGame} from "../../components/choose-game";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export const Home = () => (
    <Container>
       <Row><h1>Choose game</h1></Row>
        <Row><ChooseGame/></Row>
        <div className="mb-lg-4"/>
        <Row><h1>History</h1></Row>
        <Row><History/></Row>
    </Container>
)

