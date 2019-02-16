package main

import (
    "encoding/json"
    "log"
)

type PlayerI interface {
    readPump()
    writePump()
    foe() *Player
    openConnection()
    closeConnection()
    makeMove() (*Message, error)
    dispatch(message *Message)
}

type Player struct {
    PlayerI

    hub *Hub

    user string

    // Buffered channel of outbound messages.
    send chan []byte

    // Channel for when a match was found
    match chan *GameState

    gameState *GameState
}

func (c *Player) foe() *Player {
    if c.gameState.black == c {
        return c.gameState.white
    }
    return c.gameState.black
}

// readPump pumps messages from the websocket connection to the hub.
//
// The application runs readPump in a per-connection goroutine. The application
// ensures that there is at most one reader on a connection by executing all
// reads from this goroutine.
func (c *Player) readPump() {
    c.openConnection()
    for {
        message, err := c.makeMove()
        if err != nil {
            log.Println(err)
            break
        }
        c.dispatch(message)
    }
    c.closeConnection()
    c.hub.unregister <- c
}

func (c *Player) dispatch(message *Message) {
    switch message.Cmd {
    case "start":
        c.hub.register <- c
        log.Printf("got start command %s\n", message.Params)
    case "move":
        game := c.gameState.game
        game.State = message.Params
        db.Save(game)
        if msgb, err := json.Marshal(message); err == nil {
            c.foe().send <- msgb
        }

        log.Printf("got move command %s\n", message.Params)
    default:
        log.Printf("Unknown command %s\n", message)
    }
}

func (c *Player) openConnection() {
}

func (c *Player) closeConnection() {
}
