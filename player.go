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

// readPump reads moves from this player and dispatches those to the foe
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
        log.Printf("player '%s' got start command, params '%s' request to register at hub\n", c.user, message.Params)
        rr := RegisterRequest{player: c, params: message.Params}
        c.hub.register <- rr
    case "move":
        chess := c.gameState.chess
        if err := chess.MoveStr(message.Params); err != nil {
            log.Fatal(err)
        }
        game := c.gameState.game
        game.State = chess.String()
        db.Save(game)
        if msgb, err := json.Marshal(message); err == nil {
            log.Printf("player '%s' sends to '%s' message '%s'\n", c.user, c.foe().user, string(msgb))
            c.foe().send <- msgb
        }
    default:
        log.Printf("Unknown command %s\n", message)
    }
}

func (c *Player) openConnection() {
}

func (c *Player) closeConnection() {
}
