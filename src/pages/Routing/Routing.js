import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import {Home} from '../home/home';
import {Layout} from '../../components/layout/layout';
import {NavigationBar} from '../../components/navigation-bar/navigation-bar';
import {Contact} from "../contacts/contact";
import {GamePage} from "../gamepage/gamePage";
import {AnalysisPage} from "../analysispage/analysisPage"
import {About} from "../about/about";
import {RandomPage} from "../random/randomPage";
import {Login} from "../auth/login";
import {Signup} from "../auth/signup";
import {ResetPassword} from "../auth/resetPassword";
import {NewPassword} from '../auth/newPassword';


const Routing = () => {
    return (
            <>
                <NavigationBar/>
                <Layout>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/playboard" component={GamePage}/>
                        <Route path="/random" component={RandomPage}/>
                        <Route path="/analysisboard" component={AnalysisPage}/>
                        <Route path="/contact" component={Contact}/>
                        <Route path="/about" component={About}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/signup" component={Signup}/>
                        <Route path="/reset" component={ResetPassword}/>
                        <Route path="/newpass" component={NewPassword}/>
                    </Switch>
                </Layout>
            </>
    )
};


export default Routing;
