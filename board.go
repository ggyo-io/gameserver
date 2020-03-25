package main

import (
	"errors"
	"fmt"
	"log"
	"strconv"
	"strings"

	"github.com/notnil/chess"
)

type boardPlayer struct {
	Client
	ch     chan *Message
	undood bool
}

func newBoardPlayer(client Client) *boardPlayer {
	return &boardPlayer{Client: client, ch: make(chan *Message, 256)}
}

// Board represents an activeq chess game, routes moves between players
// and enforces game rules and time control
type Board struct {
	game       *Game
	chess      *chess.Game
	clock      *chessClock
	white      *boardPlayer
	black      *boardPlayer
	control    chan Client
	hubChannel chan *registerRequest
}

func newBoard(hubChannel chan *registerRequest, white Client, black Client, tc timeControl) *Board {
	game := Game{Active: true, White: white.User(), Black: black.User(), Mode: tc.String()}

	if err := db.Create(&game).Error; err != nil {
		panic(err)
	}

	board := Board{
		game:       &game,
		chess:      chess.NewGame(chess.UseNotation(chess.LongAlgebraicNotation{})),
		clock:      newChessClock(&tc),
		white:      newBoardPlayer(white),
		black:      newBoardPlayer(black),
		control:    make(chan Client, 256),
		hubChannel: hubChannel,
	}
	return &board
}

func (b *Board) run() {

	b.clock.firstMoveFlag(b.clock.player)
	defer func() {
		b.clock.flag.Stop()
	}()

	for {
		var err error

		select {
		case to := <-b.clock.flag.timer.C:
			numMoves := len(b.chess.Moves())
			log.Printf("Flag on move #%v, timeout %v, clock %v", numMoves, to, b.clock)
			b.hubChannel <- &registerRequest{request: "gameover", board: b}
			b.onTimeOut(b.clock.flagReason)
			return

		case client := <-b.control:
			if client == nil {
				log.Print("board exited!!!")
				return
			}
			match := b.reconnect(client)
			b.hubChannel <- &registerRequest{board: b, request: "reconnected", match: match, player: client}
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
			b.hubChannel <- &registerRequest{request: "gameover", board: b}
		}
	}
}

func (b *Board) foe(bp *boardPlayer) *boardPlayer {
	if bp == b.white {
		return b.black
	}
	return b.white
}

func (b *Board) onMessage(bp *boardPlayer, msg *Message) error {
	switch msg.Cmd {
	case "move":
		return b.move(bp, msg)
	case "outcome":
		return b.outcome(bp, msg)
	case "undo":
		return b.undo(bp, msg)
	case "accept_undo":
		return b.acceptUndo(bp, msg)
	}
	return b.sendToFoe(bp, msg)
}

func (b *Board) undo(bp *boardPlayer, msg *Message) error {
	bp.undood = true
	return b.sendToFoe(bp, msg)
}

func (b *Board) acceptUndo(bp *boardPlayer, message *Message) error {
	foe := b.foe(bp)
	if !foe.undood {
		return fmt.Errorf("board %s acceptUndo without %s undood", bp.User(), foe.User())
	}
	pgn := b.chess.String()
	slice := strings.Split(pgn, " ")
	ln := len(slice)

	undoMoves := 2
	garbageLen := 0
	if slice[ln-1] == "*" { // should always be the last one
		garbageLen++
	}
	if slice[ln-2] == "" { // sometimes (even/odd) comes before '*'
		garbageLen++
	}
	if ln < (undoMoves + garbageLen) {
		log.Print("board game too short to undo")
		return nil
	}
	newslice := append(slice[:ln-undoMoves-garbageLen], slice[ln-1:]...)
	newpgn := strings.Join(newslice, " ")
	log.Printf("board newpgn %s\n", newpgn)
	reader := strings.NewReader(newpgn)
	fpgn, err := chess.PGN(reader)
	if err != nil {
		log.Printf("board accept_undo failed to parse pgn %s", newpgn)
	}
	b.chess = chess.NewGame(fpgn, chess.UseNotation(chess.LongAlgebraicNotation{}))

	// Record the move in DB
	b.recordGame()

	message.Params = strconv.Itoa(undoMoves)
	b.sendToFoe(bp, message)

	return nil
}

func (b *Board) move(bp *boardPlayer, message *Message) error {
	chessGame := b.chess
	game := b.game

	log.Printf("pgn %s", chessGame)

	// Pre move state assertions
	if game.Active == false {
		return fmt.Errorf("board '%s' is moving on game.Active = false game", bp.User())
	}
	if chessGame.Outcome() != chess.NoOutcome {
		return fmt.Errorf("board '%s' is moving on a game with an outcome '%s' method '%s'", bp.User(), chessGame.Outcome(), chessGame.Method())
	}

	// Apply the move, check if the move is legal
	if err := chessGame.MoveStr(message.Params); err != nil {
		return fmt.Errorf("Illegal move %s by %s, error: %s", message.Params, bp.User(), err)
	}
	bp.undood = false

	// update the time control
	numMoves := len(b.chess.Moves())
	b.clock.onMove(numMoves)
	message.WhiteClock = b.clock.timeLeft[whiteColor].Milliseconds()
	message.BlackClock = b.clock.timeLeft[blackColor].Milliseconds()

	// Check is game is over, GG
	log.Printf("board '%s' after Move command outcome '%s' method '%s'\n", bp.User(), chessGame.Outcome(), chessGame.Method())
	if chessGame.Outcome() != chess.NoOutcome {
		game.Active = false
		b.updateScores()
	}

	// Record the move in DB
	b.recordGame()

	message.Moves = ""
	for _, move := range chessGame.Moves() {
		message.Moves += " " + move.String()
	}
	return b.sendToFoe(bp, message)
}

func (b *Board) updateScores() {
	whiteElo, blackElo := updateScores(b.white.User(), b.black.User(), b.chess.Outcome(), b.game.Mode)
	b.white.SetElo(whiteElo.Rating, b.game.Mode)
	b.black.SetElo(blackElo.Rating, b.game.Mode)
}

func (b *Board) outcome(bp *boardPlayer, message *Message) error {
	chessGame := b.chess
	switch message.Params {
	case "draw":
		chessGame.Draw(chess.DrawOffer)
	case "resign":
		if bp == b.black {
			chessGame.Resign(chess.Black)
		} else {
			chessGame.Resign(chess.White)
		}
	default:
		chessGame.Method()
		log.Printf("Unknown outcome command params %v\n", message)
	} // switch outcome command params

	b.game.Active = false
	b.updateScores()
	b.recordGame()

	return b.sendToFoe(bp, message)
}

func (b *Board) onTimeOut(p string) error {
	if b.game.Active {
		m := &Message{Cmd: "outcome", Params: p}
		b.sendToFoe(b.white, m)
		b.sendToFoe(b.black, m)
	}
	b.white.ch = nil
	b.black.ch = nil
	return nil
}

func (b *Board) onClose(bp *boardPlayer) error {
	log.Printf("board onClose %s", bp.User())
	bp.ch = nil
	if b.game.Active {
		return b.sendToFoe(bp, &Message{Cmd: "disconnect"})
	}

	// game over, let the board exit
	foe := b.foe(bp)
	foe.ch = nil
	return nil
}

// Record the game in DB
func (b *Board) recordGame() {
	game := b.game
	game.State = b.chess.String()
	game.WhiteClock = b.clock.timeLeft[whiteColor].Milliseconds()
	game.BlackClock = b.clock.timeLeft[blackColor].Milliseconds()
	game.Outcome = string(b.chess.Outcome())
	if err := db.Save(game).Error; err != nil {
		panic(err)
	}
}

func (b *Board) sendToFoe(bp *boardPlayer, message *Message) error {
	foe := b.foe(bp)
	if foe == nil {
		return errors.New("c.sendToFoe error foe is nil")
	}

	if foe.ch == nil {
		return errors.New("c.sendToFoe foe is not connected channel is nil")
	}

	if safeSendBytes(foe.Send(), message) {
		return errors.New("c.sendToFoe error send channel is closed")
	}
	return nil
}

func (b *Board) reconnect(client Client) *Match {
	color := "white"
	foe := b.black.User()
	var bp *boardPlayer
	if client.User() == b.black.User() {
		color = "black"
		foe = b.white.User()
		b.black = newBoardPlayer(client)
		bp = b.black
	} else {
		b.white = newBoardPlayer(client)
		bp = b.white
	}
	b.sendToFoe(bp, &Message{Cmd: "reconnected"})

	position := b.chess.String()
	// need to remove trailing * cuz it look like diz: \n1.e2e4 d7d5 2.b1c3 c7c6  *
	position = strings.TrimSuffix(position, " *")
	position = strings.TrimSpace(position)
	match := &Match{ch: bp.ch, color: color, foe: foe, foeElo: bp.Elo(b.clock.tc.String()), position: position,
		whiteClock: b.clock.getClock(whiteColor), blackClock: b.clock.getClock(blackColor), tc: b.clock.tc}
	return match
}
