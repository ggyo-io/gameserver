package main

import (
	"encoding/json"
	"fmt"
	"log"
)

type UCIPlayer struct {
	*Player

	bestMove    chan string
}

func (c *UCIPlayer) makeMove() (*Message, error) {
    bm := <-c.bestMove
	fmt.Printf("got bestMove %s uciPlayer %v\n", bm, *c)
	msg := Message{Cmd: "move", Params: bm}
	fmt.Printf("moveMessage %s\n", msg)

	return &msg, nil;
}

func (c *UCIPlayer) writePump() {
	for {
		select {
		case mb, ok := <-c.send:
			log.Printf("message from send channel: %v", mb)
			if !ok {
				log.Fatal("read send channel error")
				return
			}
            var message Message
			if err := json.Unmarshal(mb, &message); err != nil {
			    log.Print("ERROR: Unsupported message format")
			    return
			}
	        switch message.Cmd {
	        case "move":
		        log.Printf("uciplayer got move command %v\n", message)
				mr := MoveRequest{pgn: message.MVH, bestMove: c.bestMove}
				c.hub.moveRequest <- mr

	        default:
		        log.Printf("Unknown command %s\n", message)
			}
		}
	}
}

func NewUCIPlayer(hub *Hub, user string) *UCIPlayer {
	player := &Player{hub: hub, user: user, send: make(chan []byte, 256), match: make(chan *GameState)}
	client := &UCIPlayer{Player: player, bestMove: make(chan string)}
	client.PlayerI = client

	return client
}
