import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {useStoreActions, useStoreState} from "easy-peasy";

export const Promote = () => {

    const show = useStoreState(state => state.game.promote);
    const onPromote = useStoreState(state => state.game.onPromote);
    const history = useStoreState(state => state.game.history);

    let color = 'w'
    if (history.length % 2 !== 0)
        color = 'b'

    const update = useStoreActions(actions => actions.game.update);
    const handleClose = (promo) => {
        update({
            promote: false,
        });
        onPromote(promo)
    }

    return (
        <Modal backdrop="static" show={show} onHide={handleClose} size="sm" centered>
            <Modal.Body>
                <div className="d-flex flex-row">
                    <Button size="sm" variant="secondary" onClick={() => handleClose('q')}>
                        <img alt="Queen" src={"img/chesspieces/wikisvg/" + color + "Q.svg"}/>
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => handleClose('r')}>
                        <img alt="Rook" src={"img/chesspieces/wikisvg/" + color + "R.svg"}/>
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => handleClose('b')}>
                        <img alt="Bishop" src={"img/chesspieces/wikisvg/" + color + "B.svg"}/>
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => handleClose('n')}>
                        <img alt="Knight" src={"img/chesspieces/wikisvg/" + color + "N.svg"}/>
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}
