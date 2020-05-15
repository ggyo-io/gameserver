import React from "react";
import { createStore, Provider, connect } from 'unistore/full/react';
import devtools from 'unistore/devtools';
let actionHandlersGlobal = {};

export default function menageComponent({...args}) {
    const {initialState, view, actionHandlers, properties} = args;
    actionHandlersGlobal = Object.assign({}, actionHandlersGlobal, actionHandlers);
    let store = process.env.NODE_ENV === 'production' ?  createStore(initialState) : devtools(createStore(initialState));
    const defaults = {
        mapping: () =>  Object.assign({}, store, store.getState()),
        actions: () => ({
            dispatch: (type, payload) => {
                const effect = {type: type, payload: payload};
                const coeffects = Object.assign({}, {effect: effect}, store, store.getState());
                return actionHandlersGlobal[type]? actionHandlersGlobal[type](coeffects): '';
            },
            click: (event) => {
                event.persist();
                const {_targetInst: {memoizedProps}} = event;
                const effect = {type: "GAME_BUTTON#CLICKED", payload: memoizedProps || {}, event: event};
                const coeffects = Object.assign({}, {effect: effect}, store, store.getState());
                return actionHandlers["GAME_BUTTON#CLICKED"]? actionHandlers["GAME_BUTTON#CLICKED"](coeffects): null;
            }
        })
    }
    store = Object.assign({}, store, defaults.actions(), properties);
    const {mapping, actions} = defaults;
    const Container = connect(mapping, actions)(view);
    return <Provider store={store}>
                 <Container/>
            </Provider>
}

//mapping:  (store) => Object.assign({}, store, store.getState())