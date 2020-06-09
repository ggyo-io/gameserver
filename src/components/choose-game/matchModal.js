import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {Spinner} from "react-bootstrap";

const MatchModal = (props) => {

    const handleClose = props.handleClose
    let playing = 20000
    let queueing = 42
    return (
        <Modal show={true} centered onHide={handleClose}>
            <Modal.Header><h2>Waiting for match...</h2></Modal.Header>
            <Modal.Body className="text-center">
                <h4 className="text-center">Players playing: {playing}</h4>
                <h4 className="text-center mb-4">Players in queue: {queueing}</h4>
                <Spinner animation="border"/>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    )

}

export default MatchModal
