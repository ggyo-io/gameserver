import {createStore, StoreProvider} from "easy-peasy";
import Routing from "./pages/Routing/Routing";
import {gameModel} from "./model/gameModel";
import React from "react";
import {WsReact} from "./components/ws/wsreact";

const store = createStore(gameModel)

export const App = () => {
    return (
        <StoreProvider store={store}>
            <WsReact/>
            <Routing/>
        </StoreProvider>
    )
}
