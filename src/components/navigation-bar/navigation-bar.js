import React, {useEffect} from 'react';
import {Nav, Navbar, NavDropdown, NavLink} from 'react-bootstrap';
import {LinkContainer} from "react-router-bootstrap";
import './navigation-bar.scss'
import {Link} from "react-router-dom";
import {useStoreActions, useStoreState} from "easy-peasy";
import {registerCmd} from "../ws/ws";

export const NavigationBar = () => {
    const user = useStoreState(state => state.game.user);
    const setUser = useStoreActions(actions => actions.game.setUser);

    useEffect(() => {
        registerCmd("hello", (msg) => {
            if (msg.User)
                setUser(msg.User)
        })
    },[])

    const signout = () => {
        fetch("/api/logout")
            .then(()=>{setUser("")})
    }

    const signedIn = <NavDropdown title={"😎 " + user}>
        <LinkContainer to="/settings"><NavDropdown.Item>Settings</NavDropdown.Item></LinkContainer>
        <NavDropdown.Item onClick={signout}>Sign out</NavDropdown.Item>
    </NavDropdown>

    const signedOut = <LinkContainer to="/login"><NavLink>◨&nbsp;&nbsp;Sign in</NavLink></LinkContainer>


    return <Navbar expand="lg" variant="dark">
        <Navbar.Brand><Link to="/"><strong>Gg</strong>ameserver</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
                {/*<LinkContainer to="/analysisboard"><NavLink>Analize</NavLink></LinkContainer>*/}
                {/*<LinkContainer to="/about"><NavLink>About</NavLink></LinkContainer>*/}
                { user === '' ? signedOut : signedIn}
            </Nav>
        </Navbar.Collapse>
    </Navbar>
}
