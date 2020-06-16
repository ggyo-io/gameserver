import {useStoreActions, useStoreState} from "easy-peasy";
import {wsSend} from "../../../ws/ws";

export const actionHandlers = () => {

    const {dialogLabel} = useStoreState(state => state.game)
    const {setDialogLabel, update} = useStoreActions(actions => actions.game)

    return {
        yesClick: () => {
            if (dialogLabel === 'dialog_resign') {
                wsSend({
                    Cmd: "outcome",
                    Params: "resign"
                });
                update({result: "0-1", dialogLabel: ""})
            } else if (dialogLabel === 'dialog_draw') {
                wsSend({
                    Cmd: "offer",
                    Params: "draw"
                });
                setDialogLabel("")
            }
        },
        noClick: () => {
            setDialogLabel("")
        },
        dialogClick: (e) => {
            setDialogLabel(e.target.name)
        }
    }
}

