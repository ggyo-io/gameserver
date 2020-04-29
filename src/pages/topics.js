import React from "react";
import {Link, Route, Switch, useRouteMatch} from "react-router-dom";
import {Topic} from "../pages/topic";
const Topics = () => {
    const match = useRouteMatch();

    return (
        <div>
            <h2>Topics</h2>

            <ul className='list-unstyled'>
                <li>
                    <Link to={`${match.url}/components`}>Components</Link>
                </li>
                <li>
                    <Link to={`${match.url}/props-v-state`}>
                        Props v. State
                    </Link>
                </li>
            </ul>

            {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Routing> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
            <Switch>
                <Route path={`${match.path}/:topicId`}>
                    <Topic />
                </Route>
                <Route path={match.path}>
                    <h3>Please select a topic.</h3>
                </Route>
            </Switch>
        </div>
    );
}
export {Topics}