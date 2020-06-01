import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {useStoreActions, useStoreState} from "easy-peasy";

export const Promote = (props) => {

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

    let buttonStyle = {}
    if (props.width) {
        const width = props.width / 12.0
        buttonStyle = {width: width, height: width}
    }

    return (
        <Modal
            show={show}
            backdrop="static"
            size="sm"
            dialogClassName="modal-promo"
            centered
        >
                <div className="d-flex flex-row">
                    <Button size="sm" variant="secondary" onClick={() => handleClose('q')}>
                        <img alt="Queen" src={"img/chesspieces/wikisvg/" + color + "Q.svg"} style={buttonStyle}/>
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => handleClose('r')}>
                        <img alt="Rook" src={"img/chesspieces/wikisvg/" + color + "R.svg"} style={buttonStyle}/>
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => handleClose('b')}>
                        <img alt="Bishop" src={"img/chesspieces/wikisvg/" + color + "B.svg"} style={buttonStyle}/>
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => handleClose('n')}>
                        <img alt="Knight" src={"img/chesspieces/wikisvg/" + color + "N.svg"} style={buttonStyle}/>
                    </Button>
                </div>
        </Modal>
    )
}
