import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { Home } from './pages/home';
import { About } from './pages/about';
import { Layout } from './components/layout';
import { NavigationBar} from './components/navbar';
import {Contact} from "./pages/contact";
import {Play} from "./pages/play";



class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavigationBar />
        <Layout>
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/play" component={Play} />
              <Route path="/contact" component={Contact} />
            </Switch>
          </Router>
        </Layout>
      </React.Fragment>
    );
  }
}

export default App;
