import {createStore, StoreProvider} from "easy-peasy";
import Routing from "./pages/Routing/Routing";
import {gameModel} from "./model/gameModel";
import React from "react";
import {WsReact} from "./components/ws/wsreact";
import {BrowserRouter as Router} from "react-router-dom";

const store = createStore(gameModel)

export const App = () => {
    return (
        <StoreProvider store={store}>
            <Router>
                <WsReact/>
                <Routing/>
            </Router>
        </StoreProvider>
    )
}
