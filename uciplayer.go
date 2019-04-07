package main

import (
	"errors"
	"log"
)

type UCIPlayer struct {
	*Player

	bestMove chan string
}

// readPump reads moves from this player and dispatches those to the foe
func (c *UCIPlayer) readPump() {
	for {
		message, err := c.makeMove()
		if err != nil {
			log.Printf("uciplayer '%s' readPump breaks the loop, makeMove error: '%v'\n", c.user, err)
			break
		}
		c.dispatch(message)
	}
	c.unregister()
}

func (c *UCIPlayer) dispatch(message *Message) {
	c.sendBoard(message)
}

func (c *UCIPlayer) makeMove() (*Message, error) {
	bm, ok := <-c.bestMove
	if !ok {
		log.Printf("uciPlayer '%s' in makeMove(), closed besMove channel'\n", c.user)
		return nil, errors.New("bestMove channel closed")
	}

	log.Printf("uciPlayer '%s' in makeMove() got bestMove '%s'\n", c.user, bm)
	msg := Message{Cmd: "move", Params: bm}

	return &msg, nil
}

func (c *UCIPlayer) writePump() {
	defer close(c.bestMove)
	for {
		select {
		case message, ok := <-c.send:
			log.Printf("uciPlayer '%s' got message from send channel: '%#v'\n", c.user, message)
			if !ok {
				log.Print("read send channel error")
				return
			}
			switch message.Cmd {
			case "move":
				moves := message.moves
				log.Printf("uciplayer '%s' moves '%s'\n", c.user, moves)
				mr := MoveRequest{moves: moves, bestMove: c.bestMove}
				c.hub.robots[c.user].moveRequest() <- mr

			case "outcome":
				log.Printf("uciplayer '%s' outcome '%s', return from writePump(), signal readPump to exit\n", c.user, message.Params)
				return

			case "disconnect":
				log.Printf("uciplayer '%s' got 'disconnect' (%s), return from writePump(), signal readPump to exit\n", c.user, message.Params)
				return

			case "offer":
				log.Printf("uciplayer '%s' ignore offer '%s'\n", c.user, message.Params)

			case "undo":
				c.sendBoard(&Message{Cmd: "accept_undo"})

			default:
				log.Printf("uciplayer '%s' got Unknown command '%s'\n", c.user, message.Cmd)
			}
		}
	}
}

func NewUCIPlayer(hub *Hub, user string) *UCIPlayer {
	player := &Player{hub: hub, user: user, send: make(chan *Message, 256), match: make(chan *Match)}
	client := &UCIPlayer{Player: player, bestMove: make(chan string)}
	return client
}
