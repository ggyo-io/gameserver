import React from 'react';
import {Route, Routes} from 'react-router-dom';
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
import {Settings} from "../settings/settings";


const Routing = () => {
    return (
            <>
                <NavigationBar/>
                <Layout>
                    <Routes>
                        <Route exact path="/" element={<Home/>}/>
                        <Route path="/playboard" element={<GamePage/>}/>
                        <Route path="/random" element={<RandomPage/>}/>
                        <Route path="/analysisboard" element={<AnalysisPage/>}/>
                        <Route path="/contact" element={<Contact/>}/>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/signup" element={<Signup/>}/>
                        <Route path="/reset" element={<ResetPassword/>}/>
                        <Route path="/newpass" element={<NewPassword/>}/>
                        <Route path="/settings" element={<Settings/>}/>
                    </Routes>
                </Layout>
            </>
    )
};


export default Routing;
