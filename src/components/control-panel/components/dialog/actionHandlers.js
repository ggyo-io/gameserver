import {constants} from "./constants";

const {dialogs} = constants;

export const actionHandlers = {
    "ttt": ({effect, setState}) => {
        const {payload} = effect;
        setState(payload);
    },
    "GAME_BUTTON#CLICKED": ({effect, setState, dispatch}) => {
        const {payload} = effect;
        const {name} = payload;
        if (name.startsWith('dialog_'))
            setState({currentLabel: dialogs[name]});
        else if (name === 'no')
            setState({currentLabel: null});
        else if (name === 'yes') {
            dispatch('TEST_ACTION', {dialog: name});
            setState({currentLabel: null});
        }
    }
}