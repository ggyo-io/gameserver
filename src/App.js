import React from "react";
import {createStore, StoreProvider} from "easy-peasy";
import Routing from "./pages/Routing/Routing";
import {gameModel} from "./components/model/gameModel";

const store = createStore(gameModel);

export const App = () => {
    return (
        <StoreProvider store={store}>
            <Routing/>
        </StoreProvider>
    )
}
