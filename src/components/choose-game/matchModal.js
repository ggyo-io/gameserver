import React, {useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {Spinner} from "react-bootstrap";
import {useRegisterCmd} from "../ws/ws";

const MatchModal = (props) => {
    const handleClose = props.handleClose
    const [playing, setPlaying] = useState(0)
    const [queueing, setQueueing] = useState(0)
    const onQueuesStatus = (msg) => {
        setPlaying(msg.Map.PlayersPlaying)
        setQueueing(msg.Map.PlayersInQueue)
    }
    useRegisterCmd('queues_status', onQueuesStatus)

    return (
        <Modal show={true} centered onHide={handleClose} backdrop="static">
            <Modal.Header><h2>Waiting for match...</h2></Modal.Header>
            <Modal.Body className="text-center">
                <h4 className="text-center">Players playing: {playing}</h4>
                <h4 className="text-center mb-4">Players in queue: {queueing}</h4>
                <Spinner animation="border"/>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )

}

export default MatchModal
