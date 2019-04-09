package main

import (
	"errors"
	"fmt"
	"log"
	"strconv"
	"strings"

	"github.com/notnil/chess"
)

type BoardPlayer struct {
	Client
	ch     chan *Message
	undood bool
}

func NewBoardPlayer(client Client) *BoardPlayer {
	return &BoardPlayer{Client: client, ch: make(chan *Message, 256)}
}

type Board struct {
	game       *Game
	chess      *chess.Game
	white      *BoardPlayer
	black      *BoardPlayer
	control    chan Client
	hubChannel chan *RegisterRequest
}

func NewBoard(hubChannel chan *RegisterRequest, white Client, black Client) *Board {
	game := Game{Active: true, White: white.User(), Black: black.User()}
	db.Create(&game)
	board := Board{
		game:       &game,
		chess:      chess.NewGame(chess.UseNotation(chess.LongAlgebraicNotation{})),
		white:      NewBoardPlayer(white),
		black:      NewBoardPlayer(black),
		control:    make(chan Client, 256),
		hubChannel: hubChannel,
	}
	return &board
}

func (b *Board) run() {
	for {
		var err error
		select {
		case client := <-b.control:
			if client == nil {
				log.Print("board exited!!!")
				return
			}
			match := b.reconnect(client)
			b.hubChannel <- &RegisterRequest{board: b, request: "reconnected", match: match, player: client}
		case msg, ok := <-b.white.ch:
			if !ok {
				err = b.onClose(b.white)
			} else {
				err = b.onMessage(b.white, msg)
			}
		case msg, ok := <-b.black.ch:
			if !ok {
				err = b.onClose(b.black)
			} else {
				err = b.onMessage(b.black, msg)
			}
		}
		if err != nil {
			log.Print(err)
		}
		// game over or both clients disconnected -> exit
		if b.white.ch == nil && b.black.ch == nil || b.game.Active == false {
			b.hubChannel <- &RegisterRequest{request: "gameover", board: b}
		}
	}
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
	case "undo":
		return b.undo(bp, msg)
	case "accept_undo":
		return b.accept_undo(bp, msg)
	}
	return b.sendToFoe(bp, msg)
}

func (b *Board) undo(bp *BoardPlayer, msg *Message) error {
	bp.undood = true
	return b.sendToFoe(bp, msg)
}

func (b *Board) accept_undo(bp *BoardPlayer, message *Message) error {
	foe := b.foe(bp)
	if !foe.undood {
		return errors.New(fmt.Sprintf("board %s accept_undo without %s undood", bp.User(), foe.User()))
	}
	pgn := b.chess.String()
	slice := strings.Split(pgn, " ")
	ln := len(slice)
	if ln < 3 {
		log.Print("board game too short to unde")
		return nil
	}
	undoMoves := 2
	if strings.Contains(slice[ln-2], ".") && b.black == bp ||
		!strings.Contains(slice[ln-2], ".") && b.white == bp {
		undoMoves = 1
	}
	newslice := append(slice[:ln-undoMoves-2], slice[ln-1:]...)
	newpgn := strings.Join(newslice, " ")
	log.Printf("board newpgn %s\n", newpgn)
	reader := strings.NewReader(newpgn)
	fpgn, err := chess.PGN(reader)
	if err != nil {
		log.Printf("board accept_undo failed to parse pgn %s", newpgn)
	}
	b.chess = chess.NewGame(fpgn, chess.UseNotation(chess.LongAlgebraicNotation{}))

	// Record the move in DB
	b.game.State = b.chess.String()
	db.Save(b.game)
	message.Params = strconv.Itoa(undoMoves)
	b.white.Send() <- message
	b.black.Send() <- message
	return nil
}

func (c *Board) move(bp *BoardPlayer, message *Message) error {
	chessGame := c.chess
	game := c.game

	log.Printf("pgn %s", chessGame)
	// Pre move state assertions
	if game.Active == false {
		return errors.New(fmt.Sprintf("board '%s' is moving on game.Active = false game\n", bp.User()))
	}
	if chessGame.Outcome() != chess.NoOutcome {
		return errors.New(fmt.Sprintf("board '%s' is moving on a game with an outcome '%s' method '%s'\n", bp.User(), chessGame.Outcome(), chessGame.Method()))
	}

	// Apply the move, check if the move is legal
	if err := chessGame.MoveStr(message.Params); err != nil {
		return errors.New(fmt.Sprintf("Illegal move %s by %s, error: %s", message.Params, bp.User(), err))
	}
	bp.undood = false

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
	if c.game.Active {
		return c.sendToFoe(bp, &Message{Cmd: "disconnect"})
	}

	// game over, let the board exit
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

	if SafeSendBytes(foe.Send(), message) {
		return errors.New("c.sendToFoe error send channel is closed")
	}
	return nil
}

func (c *Board) reconnect(client Client) *Match {
	color := "white"
	foe := c.black.User()
	var bp *BoardPlayer
	if client.User() == c.black.User() {
		color = "black"
		foe = c.white.User()
		c.black = NewBoardPlayer(client)
		bp = c.black
	} else {
		c.white = NewBoardPlayer(client)
		bp = c.white
	}
	c.sendToFoe(bp, &Message{Cmd: "reconnected"})

	position := c.chess.String()
	// need to remove trailing * cuz it look like diz: \n1.e2e4 d7d5 2.b1c3 c7c6  *
	position = strings.TrimSuffix(position, " *")
	position = strings.TrimSpace(position)
	match := &Match{ch: bp.ch, color: color, foe: foe, resume: true, position: position}
	return match
}
