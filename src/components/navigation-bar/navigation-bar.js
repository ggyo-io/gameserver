import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import './navigation-bar.scss'

export const NavigationBar = () => (
    <>
        <Navbar expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/"><strong>G</strong>ameserver</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar"/>
            <Navbar.Collapse className="justify-content-end">
                <Nav className="ml-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/about">About</Nav.Link>
                    <Nav.Link href="/contact">Contact</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    </>
)