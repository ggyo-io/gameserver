import React, {useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import {useStoreActions, useStoreState} from "easy-peasy";

const pieces = ['q', 'r', 'b', 'k']

export const Promote = (props) => {

    const onPromote = useStoreState(state => state.game.onPromote);
    const history = useStoreState(state => state.game.history);
    const [selection, setSelection] = useState(0)

    let color = 'w'
    if (history.length % 2 !== 0)
        color = 'b'

    const update = useStoreActions(actions => actions.game.update);

    const onSelect = (idx) => {
        const piece = pieces[idx]
        update({promote: false});
        onPromote(piece)
    }

    let buttonStyle = {}
    if (props.width) {
        const width = props.width / 12.0
        buttonStyle = {width: width, height: width}
    }

    const reactToKeys = (e) => {
        const left = 37;
        const right = 39;
        const enter = 13;

        if (e.keyCode === left) {
            setSelection(s => (s - 1) % 4)
        } else if (e.keyCode === right) {
            setSelection(s => (s + 1) % 4)
        } else if (e.keyCode === enter) {
            onSelect(selection)
        }
    }

    useEffect(() => {
        const keyHandler = (e) => reactToKeys(e);
        window.addEventListener('keydown', keyHandler);
        return () => {
            window.removeEventListener('keydown', keyHandler);
        };
    })


    return (
        <Modal
            show={true}
            backdrop="static"
            size="sm"
            dialogClassName="modal-promo"
            centered
        >
            <div className="d-flex flex-row">
                <PieceButton piece="Q" color={color} idx={0} selection={selection} buttonStyle={buttonStyle} onClick={onSelect} />
                <PieceButton piece="R" color={color} idx={1} selection={selection} buttonStyle={buttonStyle} onClick={onSelect} />
                <PieceButton piece="B" color={color} idx={2} selection={selection} buttonStyle={buttonStyle} onClick={onSelect} />
                <PieceButton piece="N" color={color} idx={3} selection={selection} buttonStyle={buttonStyle} onClick={onSelect} />
            </div>
        </Modal>
    )
}

const PieceButton = ({piece, color, idx, selection, buttonStyle, onClick}) => {
    return (
        <img className={"btn btn-secondary btn-sm " + (idx === selection ? "active" : "")}
             alt={piece}
             src={"img/chesspieces/wikisvg/" + color + piece + ".svg"}
             style={buttonStyle}
             onClick={() => onClick(idx)}
        />
    )
}
