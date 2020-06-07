import React from "react";
import Modal from "react-bootstrap/Modal";

const MatchModal = () => {
    return (
        <Modal show={true}>
            <Modal.Header>Waiting for match...</Modal.Header>
            <Modal.Body>
                <div>Players playing:</div>
                <div>Players in queue:</div>
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn" data-dismiss="modal">Close</button>
            </Modal.Footer>
        </Modal>
    )

}

export default MatchModal
