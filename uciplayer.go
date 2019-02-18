package main

import (
    "encoding/json"
    "log"
)

type UCIPlayer struct {
    *Player

    bestMove    chan string
}

func (c *UCIPlayer) makeMove() (*Message, error) {
    bm := <-c.bestMove
    log.Printf("uciPlayer '%s' in makeMove() got bestMove '%s'\n", c.user, bm)
    msg := Message{Cmd: "move", Params: bm}

    return &msg, nil;
}

func (c *UCIPlayer) writePump() {
    for {
        select {
        case mb, ok := <-c.send:
            log.Printf("uciplayer '%s' got message from send channel: '%s'\n", c.user, string(mb))
            if !ok {
                log.Fatal("read send channel error")
                return
            }
            var message Message
            if err := json.Unmarshal(mb, &message); err != nil {
                log.Printf("uciplayer '%s' ERROR: Unsupported message format '%s'\n", c.user, string(mb))
                return
            }
            switch message.Cmd {
            case "move":
                moves   := ""
                chess := c.gameState.chess
                for _, move := range chess.Moves() {
                    moves += " " + move.String()
                }
                log.Printf("uciplayer '%s' moves '%s'\n", c.user, moves)
                mr := MoveRequest{moves: moves, bestMove: c.bestMove}
                c.hub.moveRequest <- mr

            default:
                log.Printf("uciplayer '%s' got Unknown command '%s'\n", c.user, string(mb))
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
