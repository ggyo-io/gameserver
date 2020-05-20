import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from '../home/home';
import { Signup } from '../signup/signup';
import { Layout } from '../../components/layout/layout';
import { NavigationBar } from '../../components/navigation-bar/navigation-bar';
import { Contact } from "../contacts/contact";
import { Playboard } from "../playboard/playboard";
import { Analysisboard } from "../analysisboard/analysisboard"
import WithMoveValidation from "../../components/board/modes/WithMoveValidation";
import PlayRandomMoveEngine from "../../components/board/modes/PlayRandomMoveEngine";


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
              <Route path="/contact" component={Contact} />
              <Route path="/signup" component={Signup} />
              <Route path="/wmvalid" component={WithMoveValidation} />
              <Route path="/vsrandom" component={PlayRandomMoveEngine} />
            </Switch>
          </Router>
        </Layout>
      </React.Fragment>
    )
  };


export default Routing;
