import {useStoreActions, useStoreState} from "easy-peasy";
import {wsSend} from "../../../ws/ws";

export const actionHandlers = () => {

    const {dialogLabel} = useStoreState(state => state.game)
    const {setDialogLabel} = useStoreActions(actions => actions.game)

    return {
        yesClick: () => {
            if (dialogLabel === 'dialog_resign') {
                wsSend({
                    Cmd: "outcome",
                    Params: "resign"
                });
            } else if (dialogLabel === 'dialog_offer_draw') {
                wsSend({
                    Cmd: "offer",
                    Params: "draw"
                });
            } else if (dialogLabel === 'dialog_accept_draw') {
                wsSend({
                    Cmd: "outcome",
                    Params: "draw"
                })
            }
            setDialogLabel("")
        },
        noClick: () => {
            setDialogLabel("")
        },
        dialogClick: (e) => {
            setDialogLabel(e.target.name)
        }
    }
}

