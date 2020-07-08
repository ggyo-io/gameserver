import React from 'react';
import {Nav, Navbar, NavDropdown, NavLink} from 'react-bootstrap';
import {LinkContainer} from "react-router-bootstrap";
import Badge from 'react-bootstrap/Badge';
import './navigation-bar.scss'
import {Link} from "react-router-dom";
import {useStoreActions, useStoreState} from "easy-peasy";
import {useRegisterCmd} from "../ws/ws";

export const NavigationBar = () => {
    const {user, serverConnection} = useStoreState(state => state.game)
    const setUser = useStoreActions(actions => actions.game.setUser);

    useRegisterCmd("hello", (msg) => {
        if (msg.User)
            setUser(msg.User)
    })


    const signout = () => {
        fetch("/api/logout")
            .then(() => {
                setUser("")
            })
    }

    const signedIn = <NavDropdown title={"😎 " + user}>
        <LinkContainer to="/settings"><NavDropdown.Item>Settings</NavDropdown.Item></LinkContainer>
        <NavDropdown.Item onClick={signout}>Sign out</NavDropdown.Item>
    </NavDropdown>

    const signedOut = <LinkContainer to="/login"><NavLink>◨&nbsp;&nbsp;Sign in</NavLink></LinkContainer>


    return <Navbar expand="lg" variant="dark">
        <Navbar.Brand><Link className="text-decoration-none" to="/"><strong>GgYo</strong></Link>&nbsp;&nbsp;<Badge pill variant={serverConnection.bg}>{serverConnection.text}</Badge></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
                {/*<LinkContainer to="/analysisboard"><NavLink>Analize</NavLink></LinkContainer>*/}
                {<LinkContainer to="/about"><NavLink>About</NavLink></LinkContainer>}
                {user === '' ? signedOut : signedIn}
            </Nav>
        </Navbar.Collapse>
    </Navbar>
}
