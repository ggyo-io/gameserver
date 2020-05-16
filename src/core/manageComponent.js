import React from "react";
import { createStore, Provider, connect } from 'unistore/full/react';
import devtools from 'unistore/devtools';

const globalAggregator = {};
const globalStoreAggregator = (...args) => {
    const obj = {};
    obj[args[0]] = Object.assign({}, {store: args[1]}, {actionHandlers: args[2]});
    return obj;
};
const transitEvent = (effect, opt) => {
    if (!opt) return; /* if transit is not set */
    const {transit} = opt;
    const {type} = effect;
    if (!globalAggregator[transit]) return; /* if store not exist */
    const {store, actionHandlers} = globalAggregator[transit];
    const coeffects = Object.assign({}, effect, store, store.getState());
    return actionHandlers[type](coeffects);
};

export default function menageComponent({...args}) {
    const {initialState, view, actionHandlers, properties, name} = args;
    if (!name) return; /* Don't create store without uniq Id */
    let store = process.env.NODE_ENV === 'production' ?  createStore(initialState) : devtools(createStore(initialState));
    store.name = name;
    const defaults = {
        mapping: () =>  Object.assign({}, store, store.getState()),
        actions: () => ({
            dispatch: (type, payload, opt) => {
                /* opt - object give transit address to current store */
                const effect = {type: type, payload: payload};
                const coeffects = Object.assign({}, {effect: effect}, store, store.getState());
                /* If handler is outside store or doesn't exist use transit mode */
                return actionHandlers[type]? actionHandlers[type](coeffects): transitEvent(effect, opt);
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
    Object.assign(store, defaults.actions(), {properties: properties || {}});
    Object.assign(globalAggregator,  globalStoreAggregator(name, store, actionHandlers));
    const {mapping, actions} = defaults;
    const Container = connect(mapping, actions)(view);
    return <Provider store={store}>
                 <Container/>
            </Provider>
}