import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import './navigation-bar.scss'

export const NavigationBar = () => (
    <>
        <Navbar expand="lg" variant="dark">
            <Navbar.Brand href="/"><strong>Gg</strong>ameserver</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link  href="/">Home</Nav.Link>
                    <Nav.Link  href="/analysisboard">Analize</Nav.Link>
                    <Nav.Link  href="/ggboard">ChessboardJS</Nav.Link>
                    <Nav.Link  href="/gground">Chessground</Nav.Link>
                    <Nav.Link  href="/contact">Contact</Nav.Link>
                    <Nav.Link  href="/signup">Sign Up!</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    </>
)