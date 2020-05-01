import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import './navbar.css'

export const NavigationBar = () => (
    <styles>
        <Navbar expand="lg">
            <Navbar.Brand href="/"><b>gg</b>ameserver</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Item><Nav.Link href="/">Home</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="/about">About</Nav.Link></Nav.Item>
                    <Nav.Item><Nav.Link href="/contact">Contact</Nav.Link></Nav.Item>  
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    </styles>
)