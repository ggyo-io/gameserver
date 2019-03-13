package main

import (
    "encoding/json"
    "log"
    "github.com/notnil/chess"
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

func (c *Player) color() string {
    color := "black"
    if c.gameState.white == c {
        color = "white"
    }
    return color
}

// readPump reads moves from this player and dispatches those to the foe
func (c *Player) readPump() {
    c.openConnection()
    for {
        message, err := c.makeMove()
        if err != nil {
            log.Printf("player '%s' readPump breaks the loop, makeMove reason: '%v'\n", c.user, err)
            break
        }
        c.dispatch(message)
    }
    c.closeConnection()
    c.hub.unregister <- c
}

/* recieve messages from player (web socket or uci) and forward moves to the foe side */
func (c *Player) dispatch(message *Message) {
    switch message.Cmd {
    case "start":
        log.Printf("player '%s' got start command, params '%s' request to register at hub\n", c.user, message.Params)
        rr := RegisterRequest{player: c, params: message.Params}
        c.hub.register <- rr
    case "move":
        chessGame := c.gameState.chess
        game := c.gameState.game

        // Pre move state assertions
        if game.Active == false {
            log.Fatalf("player '%s' is moving on game.Active = false game\n", c.user)
        }
        if chessGame.Outcome() != chess.NoOutcome {
            log.Fatalf("player '%s' is moving on a game with an outcome '%s' method '%s'\n", c.user, chessGame.Outcome(), chessGame.Method())
        }

        // Apply the move, check if the move is legal
        if err := chessGame.MoveStr(message.Params); err != nil {
            log.Fatal(err)
        }

        // Check is game is over, GG
        log.Printf("player '%s' after Move command outcome '%s' method '%s'\n", c.user, chessGame.Outcome(), chessGame.Method())
        if chessGame.Outcome() != chess.NoOutcome {
            game.Active = false
        }

        // Record the move in DB
        game.State = chessGame.String()
        db.Save(game)
        if msgb, err := json.Marshal(message); err == nil {
            log.Printf("player '%s' sends to '%s' message '%s'\n", c.user, c.foe().user, string(msgb))
            c.foe().send <- msgb
        }

    case "outcome":
        chessGame := c.gameState.chess
        switch message.Params {
        case "draw":
           chessGame.Draw(chess.DrawOffer)
        case "resign":
           if c.color() == "black" {
               chessGame.Resign(chess.Black)
           } else {
               chessGame.Resign(chess.White)
           }
       default:
            log.Printf("Unknown outcome command params %s\n", message)
        } // switch outcome command params

        game := c.gameState.game
        game.State = chessGame.String()
        game.Active = false
        db.Save(game)
        if msgb, err := json.Marshal(message); err == nil {
            log.Printf("player '%s' sends to '%s' message '%s'\n", c.user, c.foe().user, string(msgb))
            c.foe().send <- msgb
        }

    case "offer":
        if msgb, err := json.Marshal(message); err == nil {
            log.Printf("player '%s' sends an offer to '%s' message '%s'\n", c.user, c.foe().user, string(msgb))
            c.foe().send <- msgb
        }

    default:
        log.Printf("Unknown command %s\n", message)
    } // switch message command
}

func (c *Player) onUnregister() {
    close(c.send)
    close(c.match)
}

func (c *Player) openConnection() {
}

func (c *Player) closeConnection() {
}
