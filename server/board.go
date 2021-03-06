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
		chess:      chess.NewGame(chess.UseNotation(chess.LongAlgebraicNotationClock{})),
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
		log.Print("board exited!!!")
	}()

	for {
		var err error

		select {
		case ato := <-b.clock.whiteAbandoned.timer.C:
			log.Printf("White abandoned timeout %v, clock %v", ato, b.clock)
			b.abandoned(false)
			return

		case ato := <-b.clock.blackAbandoned.timer.C:
			log.Printf("Black abandoned timeout %v, clock %v", ato, b.clock)
			b.abandoned(true)
			return

		case to := <-b.clock.flag.timer.C:
			numMoves := len(b.chess.Moves())
			log.Printf("Flag on move #%v, timeout %v, clock %v", numMoves, to, b.clock)
			b.onTimeOut(b.clock.flagReason, b.clock.player)
			return

		case client := <-b.control:
			if client == nil {
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

	// update the time control
	numMoves := len(b.chess.Moves()) + 1
	clk := b.clock.onMove(numMoves)

	// Apply the move, check if the move is legal
	if err := chessGame.MoveStr(message.Params + chess.ClkString(clk)); err != nil {
		return fmt.Errorf("Illegal move %s by %s, error: %s", message.Params, bp.User(), err)
	}
	bp.undood = false

	// Check is game is over, GG
	log.Printf("board '%s' after Move command outcome '%s' method '%s'\n", bp.User(), chessGame.Outcome(), chessGame.Method())
	// Record the move in DB
	b.recordGame()

	message.Moves = ""
	for _, move := range chessGame.Moves() {
		message.Moves += " " + move.String()
	}
	message.WhiteClock, message.BlackClock = b.whiteTime(), b.blackTime()
	bp.Send() <- &Message{Cmd: "clock", WhiteClock: b.whiteTime(), BlackClock: b.blackTime()}
	err := b.sendToFoe(bp, message)

	if chessGame.Outcome() != chess.NoOutcome {
		return b.gameOver(b.outcomeMsg(chessGame.Method()))
	}
	return err

}

func (b *Board) whiteTime() int64 {
	numMoves := len(b.chess.Moves())
	whiteClock := b.clock.timeLeft[whiteColor].Milliseconds()
	if numMoves < 1 {
		whiteClock = FirstMoveTimeout.Milliseconds()
	}
	return whiteClock
}

func (b *Board) blackTime() int64 {
	numMoves := len(b.chess.Moves())
	blackClock := b.clock.timeLeft[blackColor].Milliseconds()
	if numMoves < 2 {
		blackClock = FirstMoveTimeout.Milliseconds()
	}
	return blackClock
}

func (b *Board) updateScores() {
	whiteElo, blackElo := updateScores(b.white.User(), b.black.User(), b.chess.Outcome(), b.game.Mode)
	b.white.SetElo(whiteElo.Rating, b.game.Mode)
	b.black.SetElo(blackElo.Rating, b.game.Mode)
}

func (b *Board) outcome(bp *boardPlayer, message *Message) error {
	switch message.Params {
	case "draw":
		b.chess.Draw(chess.DrawOffer)
	case "resign":
		b.resign(bp == b.black)
	default:
		log.Printf("Unknown outcome command params %v\n", message)
	} // switch outcome command params

	var reason interface{} = b.chess.Method()
	return b.gameOver(b.outcomeMsg(reason))
}

func (b *Board) resign(black bool) {
	if black {
		b.chess.Resign(chess.Black)
	} else {
		b.chess.Resign(chess.White)
	}
}

func (b *Board) outcomeMsg(reason interface{}) *Message {
	return &Message{Cmd: "outcome", Map: map[string]interface{}{
		"Result": b.chess.Outcome(),
		"Reason": reason,
	}}
}

func (b *Board) sendBoth(message *Message) error {
	b.white.Send() <- message
	b.black.Send() <- message
	return nil
}

func (b *Board) onTimeOut(desc string, player int) error {
	if !b.game.Active {
		return nil
	}
	b.resign(player == blackColor)
	return b.gameOver(b.outcomeMsg(desc))
}

func (b *Board) gameOver(m *Message) error {
	err := b.sendBoth(m)
	b.game.Active = false
	b.updateScores()
	b.chess.AddTagPair("Method", b.chess.Method().String())
	b.recordGame()
	b.hubChannel <- &registerRequest{request: "gameover", board: b}
	b.white.ch = nil
	b.black.ch = nil
	return err
}

func (b *Board) onClose(bp *boardPlayer) error {
	log.Printf("board onClose %s", bp.User())
	bp.ch = nil
	if b.game.Active {
		if bp == b.white {
			b.clock.whiteAbandoned.Reset(AbandonTimeout)
		} else {
			b.clock.blackAbandoned.Reset(AbandonTimeout)
		}
		return b.sendToFoe(bp, &Message{Cmd: "disconnect"})
	}
	return nil
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
	if client.ClientID() == b.black.ClientID() {
		color = "black"
		foe = b.white.User()
		b.black = newBoardPlayer(client)
		bp = b.black
		b.clock.blackAbandoned.Stop()
	} else {
		b.white = newBoardPlayer(client)
		bp = b.white
		b.clock.whiteAbandoned.Stop()
	}
	b.sendToFoe(bp, &Message{Cmd: "reconnected"})

	position := b.chess.String()
	// need to remove trailing * cuz it look like diz: \n1.e2e4 d7d5 2.b1c3 c7c6  *
	position = strings.TrimSuffix(position, " *")
	position = strings.TrimSpace(position)
	match := b.makeMatchPosition(bp, color, foe, position)
	return match
}

func (b *Board) makeMatchPosition(bp *boardPlayer, color string, foe string, position string) *Match {
	return &Match{ch: bp.ch, color: color, foe: foe, foeElo: bp.Elo(b.clock.tc.String()), position: position,
		whiteClock: b.whiteTime(), blackClock: b.blackTime(), tc: b.clock.tc}
}

func (b *Board) makeNewMatch(color string) *Match {
	ch := b.white.ch
	foe := b.black.User()
	foeElo := b.black.Elo(b.clock.tc.String())
	if color == "black" {
		ch = b.black.ch
		foe = b.white.User()
		foeElo = b.white.Elo(b.clock.tc.String())
	}
	return &Match{ch: ch, color: color, foe: foe, foeElo: foeElo, gameID: b.game.ID,
		whiteClock: b.whiteTime(), blackClock: b.blackTime(), tc: b.clock.tc}
}

func (b *Board) abandoned(black bool) {
	b.resign(black)
	color := "White"
	if black {
		color = "Black"
	}
	err := b.gameOver(b.outcomeMsg(fmt.Sprintf("%s abandoned", color)))
	if err != nil {
		log.Printf("ERROR calling gameOver: %s\n", err)
	}
}
