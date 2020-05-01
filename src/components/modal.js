import React from "react";
import {Button} from "react-bootstrap";
import {Modal} from "react-bootstrap";
import {popover} from "./popover";
import {OverlayTrigger} from "react-bootstrap";
import { useState } from 'react';

const ExampleModal = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <OverlayTrigger tigger={['hover', 'focus']} placement="right" overlay={popover}>
                <Button variant="primary" onClick={handleShow}>
                    Launch demo modal
                </Button>
            </OverlayTrigger>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export {ExampleModal};