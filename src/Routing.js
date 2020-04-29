import React from "react";
import {Home} from "./pages/home";
import {About} from "./pages/about";
import {Topics} from "./pages/topics";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
export const Routing = () => {
    return (
        <Router>
            <div>
                <ul className='list-unstyled'>
                    <li>
                        <Link to="/">Home...</Link>
                    </li>
                    <li>
                        <Link to="/about">About...</Link>
                    </li>
                    <li>
                        <Link to="/topics">Topics...</Link>
                    </li>
                </ul>

                <Switch>
                    <Route path="/about">
                        <About />
                    </Route>
                    <Route path="/topics">
                        <Topics />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}



