package main

import (
	"encoding/json"
	"errors"
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
	dispatch(message *Message) error
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
	if c.gameState == nil {
		return nil
	}
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
	log.Printf("in readPump")
	c.openConnection()
	for {
		message, err := c.makeMove()
		if err != nil {
			log.Printf("player '%s' readPump breaks the loop, makeMove error: '%v'\n", c.user, err)
			break
		}
		if c.user == "" {
			c.sendMessage(Message{Cmd: "must_login"})
		} else {
			err = c.dispatch(message)
		}
		if err != nil {
			log.Printf("player '%s' readPump breaks the loop, dispatch error: '%v'\n", c.user, err)
			break
		}
	}
	c.closeConnection()
	c.hub.unregister <- c
}

/* see https://go101.org/article/channel-closing.html */
func SafeSendBytes(ch chan []byte, value []byte) (closed bool) {
	defer func() {
		if recover() != nil {
			closed = true
		}
	}()

	ch <- value  // panic if ch is closed
	return false // <=> closed = false; return
}

func (c *Player) sendToFoe(message *Message) bool {
	if foe := c.foe(); foe == nil {
		return true
	}

	if msgb, err := json.Marshal(message); err == nil {
		log.Printf("player '%s' sends to '%s' message '%s'\n", c.user, c.foe().user, string(msgb))
		return SafeSendBytes(c.foe().send, msgb)
	}

	return true // json.Marshal error
}

/* recieve messages from player (web socket or uci) and forward moves to the foe side */
func (c *Player) dispatch(message *Message) error {

	if message.Cmd == "start" {
		log.Printf("player '%s' got start command, params '%s' request to register at hub\n", c.user, message.Params)
		rr := RegisterRequest{player: c, foe: message.Params, color: message.Color}
		c.hub.register <- rr
		return nil
	}

	if c.gameState == nil {
		log.Printf("player '%s' ignore '%s' command, gameState == nil\n", c.user, message.Cmd)
		return nil
	}

	switch message.Cmd {
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
		if c.sendToFoe(message) {
			return errors.New("c.sendToFoe error")
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
		if c.sendToFoe(message) {
			return errors.New("c.sendToFoe error")
		}
	case "offer":
		if c.sendToFoe(message) {
			return errors.New("c.sendToFoe error")
		}
	default:
		log.Printf("Unknown command %s\n", message)
	} // switch message command

	return nil
}

func (c *Player) onUnregister() {
	close(c.send)
	close(c.match)
}

func (c *Player) openConnection() {
	log.Printf("func (c *Player) openConnection()")
}

func (c *Player) closeConnection() {
}

func (c *Player) sendMessage(msg Message) {
	log.Printf("in sendMessage")
	if msgb, err := json.Marshal(&msg); err == nil {
		log.Printf("sendMessage: %s\n", msgb)
		c.send <- msgb
	} else {
		log.Printf("ERROR marshalling message: %s\n", err)
	}
}
