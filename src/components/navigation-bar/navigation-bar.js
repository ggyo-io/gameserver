import React from 'react';
import { Nav, Navbar, NavLink } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import './navigation-bar.scss'
import {Link} from "react-router-dom";

export const NavigationBar = () => (
        <Navbar expand="lg" variant="dark">
            <Navbar.Brand><Link to="/"><strong>Gg</strong>ameserver</Link></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <LinkContainer to="/analysisboard"><NavLink>Analize</NavLink></LinkContainer>
                    <LinkContainer to="/about"><NavLink>About</NavLink></LinkContainer>
                    <LinkContainer to="/signup"><NavLink>Sign Up!</NavLink></LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
)
