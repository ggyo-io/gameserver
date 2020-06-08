import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import {Home} from '../home/home';
import {Signup} from '../signup/signup';
import {Layout} from '../../components/layout/layout';
import {NavigationBar} from '../../components/navigation-bar/navigation-bar';
import {Contact} from "../contacts/contact";
import {GamePage} from "../gamepage/gamePage";
import {AnalysisPage} from "../analysispage/analysisPage"
import {About} from "../about/about";
import {RandomPage} from "../random/randomPage";


const Routing = () => {
    return (
            <Router>
                <NavigationBar/>
                <Layout>
                    <Redirect from="/" to="/home"/>
                    <Switch>
                        <Route exact path="/home" component={Home}/>
                        <Route path="/playboard" component={GamePage}/>
                        <Route path="/random" component={RandomPage}/>
                        <Route path="/analysisboard" component={AnalysisPage}/>
                        <Route path="/contact" component={Contact}/>
                        <Route path="/about" component={About}/>
                        <Route path="/signup" component={Signup}/>
                    </Switch>
                </Layout>
            </Router>
    )
};


export default Routing;
