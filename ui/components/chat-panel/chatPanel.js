import React, {useState} from "react";
import {Button, InputGroup, Card, FormControl} from "react-bootstrap";
import "./chat.scss"
import {useStoreActions, useStoreState} from "easy-peasy";
import {wsSend} from "../ws/ws";

export const ChatPanel = () => {
    const [message, setMessage] = useState('')
    const {chatMessages, oponentName} = useStoreState(state => state.game)
    const addChatMessage = useStoreActions(actions => actions.game.addChatMessage)
    const onSubmit = () => {
        setMessage('')
        wsSend({
            Cmd: 'chat',
            Params: message
        })
        addChatMessage({message:message})
    };
    const handleKeyPress = (target) => {
        if(target.charCode === 13){
            onSubmit()
        }
    }
    const renderMessages = (msgs) => (
        msgs.map(msg => <div key={msg.message}>{msg.oponent ? <><strong>{oponentName}:</strong>  {msg.message}</> : msg.message}</div>)
    )


    return (
        <Card style={{minWidth: '10rem'}}>
            <Card.Header>Chat with {oponentName}</Card.Header>
            <Card.Body>
                {renderMessages(chatMessages)}
            </Card.Body>
            <InputGroup>
                <FormControl
                    placeholder="message"
                    aria-label="message"
                    aria-describedby="basic-addon"
                    onChange={(e)=>setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    value={message}
                />
                <InputGroup.Append>
                    <Button variant="secondary" onClick={onSubmit}>Send</Button>
                </InputGroup.Append>
            </InputGroup>
        </Card>
    )
}
