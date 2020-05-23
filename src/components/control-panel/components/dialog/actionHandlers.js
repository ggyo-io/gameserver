import {constants} from "./constants";
import {useStoreActions} from "easy-peasy";

const {dialogs} = constants;

export const actionHandlers = () => {

    const {setDialogLabel} = useStoreActions(actions => actions.game)

    return {
        yesClick: () => {
            setDialogLabel("")
        },
        noClick: () => {
            setDialogLabel("")
        },
        dialogClick: (e) => {
            setDialogLabel(dialogs[e.target.name])
        }
    }
}

