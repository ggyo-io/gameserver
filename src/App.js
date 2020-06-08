import React, {useEffect} from "react";
import {createStore, StoreProvider} from "easy-peasy";
import Routing from "./pages/Routing/Routing";
import {gameModel} from "./model/gameModel";
import {wsConn} from "./components/ws/ws";

const store = createStore(gameModel)

export const App = () => {
    useEffect(()=>{
        wsConn.connect()

        // Specify how to clean up after this effect:
        return function cleanup() {
            wsConn.disconnect();
        };
    }, [])

    return (
        <StoreProvider store={store}>
            <Routing/>
        </StoreProvider>
    )
}
