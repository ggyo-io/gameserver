import React from 'react';
import { Nav, Navbar, NavLink } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import './navigation-bar.scss'

export const NavigationBar = () => (
        <Navbar expand="lg" variant="dark">
            <LinkContainer to="/home"><Navbar.Brand><strong>Gg</strong>ameserver</Navbar.Brand></LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <LinkContainer to="/home"><NavLink>Home</NavLink></LinkContainer>
                    <LinkContainer to="/analysisboard"><NavLink>Analize</NavLink></LinkContainer>
                    <LinkContainer to="/about"><NavLink>About</NavLink></LinkContainer>
                    <LinkContainer to="/signup"><NavLink>Sign Up!</NavLink></LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
)
