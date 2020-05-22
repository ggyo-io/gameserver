import React from 'react';

import Routing from './pages/Routing/Routing';
import {action, createStore, StoreProvider} from "easy-peasy";


const store = createStore({
    todos: {
        items: ['Create store', 'Wrap application', 'Use store'],
        add: action((state, payload) => {

        })
    }
});

const App = () => (
    <StoreProvider store={store}>
        <Routing />
    </StoreProvider>
)

export default App
