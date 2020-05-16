import {constants} from "./constants";

const {dialogs} = constants;

export const actionHandlers = {
    "ttt": ({effect, setState}) => {
        const {payload} = effect;
        setState(payload);
    },
    "GAME_BUTTON#CLICKED": ({effect, setState, getState, dispatch}) => {
        const {payload} = effect;
        const {name} = payload;
        if (name.startsWith('dialog_'))
            setState({currentLabel: dialogs[name]});
        else if (name === 'no')
            setState({currentLabel: null});
        else if (name === 'yes') {
            const {currentLabel} = getState();
            effect['confirmation'] = currentLabel;
            dispatch('TEST_ACTION', {dialog: {name, currentLabel}, effect}, {transit: 'controlPanel'});
            setState({currentLabel: null});
        }
    }
}