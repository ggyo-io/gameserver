import {constants} from "./constants";

const {dialogs} = constants;

export const actionHandlers = (actions) => {
    const {setDialogLabel} = actions
    return {
        yesClick: () => {
            setDialogLabel("")
        },
        noClick: () => {
            setDialogLabel("")
        },
        dialogClick: (e) => {
            //console.log()
            setDialogLabel(dialogs[e.target.name])
        }
    }
}

