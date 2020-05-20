import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from '../home/home';
import { Signup } from '../signup/signup';
import { Layout } from '../../components/layout/layout';
import { NavigationBar } from '../../components/navigation-bar/navigation-bar';
import { Contact } from "../contacts/contact";
import { Playboard } from "../playboard/playboard";
import { Analysisboard } from "../analysisboard/analysisboard"
import { GGBoardPage } from "../ggboard"
import { GGroundPage } from "../gground"


const Routing = () => {
    return (
      <React.Fragment>
        <NavigationBar />
        <Layout>
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/playboard" component={Playboard} />
              <Route path="/analysisboard" component={Analysisboard} />
              <Route path="/ggboard" component={GGBoardPage} />
              <Route path="/gground" component={GGroundPage} />
              <Route path="/contact" component={Contact} />
              <Route path="/signup" component={Signup} />
            </Switch>
          </Router>
        </Layout>
      </React.Fragment>
    )
  };


export default Routing;
