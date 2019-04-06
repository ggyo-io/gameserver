package main

import (
	"errors"
	"log"

	"github.com/notnil/chess"
)

type BoardPlayer struct {
	client Client
	ch     chan *Message
}

func NewBoardPlayer(client Client) *BoardPlayer {
	return &BoardPlayer{client: client, ch: make(chan *Message, 256)}
}

func (bp *BoardPlayer) User() string {
	return bp.client.User()
}

type Board struct {
	game  *Game
	chess *chess.Game
	white *BoardPlayer
	black *BoardPlayer
}

func (b *Board) run() {
	for {
		select {
		case msg, ok := <-b.white.ch:
			if !ok {
				b.onClose(b.white)
			} else {
				b.onMessage(b.white, msg)
			}
		case msg, ok := <-b.black.ch:
			if !ok {
				b.onClose(b.black)
			} else {
				b.onMessage(b.black, msg)
			}
		}
		// both clients disconnected -> exit
		if b.white.ch == nil && b.black.ch == nil {
			return
		}
	}
	log.Print("Board exits")
}

func (b *Board) foe(bp *BoardPlayer) *BoardPlayer {
	if bp == b.white {
		return b.black
	}
	return b.white
}

func (b *Board) onMessage(bp *BoardPlayer, msg *Message) error {
	switch msg.Cmd {
	case "move":
		return b.move(bp, msg)
	case "outcome":
		return b.outcome(bp, msg)
	}
	return b.sendToFoe(bp, msg)
}

func (c *Board) move(bp *BoardPlayer, message *Message) error {
	chessGame := c.chess
	game := c.game

	// Pre move state assertions
	if game.Active == false {
		log.Printf("board '%s' is moving on game.Active = false game\n", bp.User())
	}
	if chessGame.Outcome() != chess.NoOutcome {
		log.Printf("board '%s' is moving on a game with an outcome '%s' method '%s'\n", bp.User(), chessGame.Outcome(), chessGame.Method())
	}

	// Apply the move, check if the move is legal
	if err := chessGame.MoveStr(message.Params); err != nil {
		log.Printf("Illegal move %s by %s, error: %s", message.Params, bp.User(), err)
	}

	// Check is game is over, GG
	log.Printf("board '%s' after Move command outcome '%s' method '%s'\n", bp.User(), chessGame.Outcome(), chessGame.Method())
	if chessGame.Outcome() != chess.NoOutcome {
		game.Active = false
	}

	// Record the move in DB
	game.State = chessGame.String()
	db.Save(game)
	message.moves = ""
	for _, move := range chessGame.Moves() {
		message.moves += " " + move.String()
	}
	return c.sendToFoe(bp, message)
}

func (c *Board) outcome(bp *BoardPlayer, message *Message) error {
	chessGame := c.chess
	switch message.Params {
	case "draw":
		chessGame.Draw(chess.DrawOffer)
	case "resign":
		if bp == c.black {
			chessGame.Resign(chess.Black)
		} else {
			chessGame.Resign(chess.White)
		}
	default:
		log.Printf("Unknown outcome command params %s\n", message)
	} // switch outcome command params

	game := c.game
	game.State = chessGame.String()
	game.Active = false
	db.Save(game)
	return c.sendToFoe(bp, message)
}

func (c *Board) onClose(bp *BoardPlayer) error {
	log.Printf("board onClose %s", bp)
	bp.ch = nil
	close(bp.client.Send())

	if c.game.Active {
		return c.sendToFoe(bp, &Message{Cmd: "disconnect"})
	}

	// game over let the board exit
	foe := c.foe(bp)
	foe.ch = nil
	return nil
}

func (c *Board) sendToFoe(bp *BoardPlayer, message *Message) error {
	foe := c.foe(bp)
	if foe == nil {
		return errors.New("c.sendToFoe error foe is nil")
	}

	if foe.ch == nil {
		return errors.New("c.sendToFoe foe is not connected channel is nil")
	}

	if SafeSendBytes(foe.client.Send(), message) {
		return errors.New("c.sendToFoe error send channel is closed")
	}
	return nil
}

// func (c *Board) sendState(bp *BoardPlayer) {
// 	position := c.gameState.chess.String()
// 	// need to remove trailing * cuz it look like diz: \n1.e2e4 d7d5 2.b1c3 c7c6  *
// 	position = strings.TrimSuffix(position, " *")
// 	position = strings.TrimSpace(position)
// 	msg := Message{Cmd: "resume", Color: c.color(), Params: position}
// 	c.sendMessage(msg)
// }
