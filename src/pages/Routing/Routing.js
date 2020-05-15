import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from '../home/home';
import { About } from '../about/about';
import { Signup } from '../signup/signup';
import { Layout } from '../../components/layout/layout';
import { NavigationBar } from '../../components/navigation-bar/navigation-bar';
import { Contact } from "../contacts/contact";
import { Playboard } from "../playboard/playboard";


class Routing extends Component {
  render() {
    return (
      <React.Fragment>
        <NavigationBar />
        <Layout>
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/playboard" component={Playboard} />
              <Route path="/contact" component={Contact} />
              <Route path="/signup" component={Signup} />
            </Switch>
          </Router>
        </Layout>
      </React.Fragment>
    );
  }
}

export default Routing;
