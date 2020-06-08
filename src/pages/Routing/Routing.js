import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import {Home} from '../home/home';
import {Signup} from '../signup/signup';
import {Layout} from '../../components/layout/layout';
import {NavigationBar} from '../../components/navigation-bar/navigation-bar';
import {Contact} from "../contacts/contact";
import {Playboard} from "../playboard/playboard";
import {Analysisboard} from "../analysisboard/analysisboard"
import {About} from "../about/about";
import {Randomboard} from "../random/randomboard";


const Routing = () => {
    return (
            <Router>
                <NavigationBar/>
                <Layout>
                    <Redirect from="/" to="/home"/>
                    <Switch>
                        <Route exact path="/home" component={Home}/>
                        <Route path="/playboard" component={Playboard}/>
                        <Route path="/random" component={Randomboard}/>
                        <Route path="/analysisboard" component={Analysisboard}/>
                        <Route path="/contact" component={Contact}/>
                        <Route path="/about" component={About}/>
                        <Route path="/signup" component={Signup}/>
                    </Switch>
                </Layout>
            </Router>
    )
};


export default Routing;
