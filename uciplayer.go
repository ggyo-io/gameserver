package main

import (
    "encoding/json"
    "log"
    "errors"
)

type UCIPlayer struct {
    *Player

    bestMove    chan string
}

func (c *UCIPlayer) makeMove() (*Message, error) {
    bm, ok := <-c.bestMove
    if !ok {
         log.Printf("uciPlayer '%s' in makeMove(), closed besMove channel'\n", c.user)
         return nil, errors.New("bestMove channel closed");
    }

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
                c.hub.robots[c.user].moveRequest() <- mr

            case "outcome":
                log.Printf("uciplayer '%s' outcome '%s', return from writePump(), signal readPump to exit\n", c.user, message.Params)
                close(c.bestMove)
                return

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
