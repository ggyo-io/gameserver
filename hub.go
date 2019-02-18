// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
    "log"
    "github.com/notnil/chess"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
    // Registered clients.
    clients map[*Player]bool

    // Register requests from the clients.
    register chan *Player

    // Unregister requests from clients.
    unregister chan *Player

    moveRequest chan MoveRequest
}

type GameState struct {
    game  *Game
    chess *chess.Game
    white *Player
    black *Player
}

func newHub() *Hub {
    h := &Hub{
        register:    make(chan *Player),
        unregister:  make(chan *Player),
        clients:     make(map[*Player]bool),
        moveRequest: make(chan MoveRequest),
    }
    go h.run()
    return h
}

func (h *Hub) run() {
    for {
        select {
        case client := <-h.register:
            // _very_ naive matching
            h.matchLeela(client)
        case client := <-h.unregister:
            if _, ok := h.clients[client]; ok {
                delete(h.clients, client)
            }
            close(client.send)
        }
    }
}

func (h *Hub) matchLeela(client *Player) {
    uciPlayer := NewUCIPlayer(h, "Leela via UCI")
    go uciPlayer.writePump()
    go uciPlayer.readPump()

    game := Game{White: client.user, Black: uciPlayer.user}
    db.Create(&game)
    gameState := GameState{game: &game, chess: chess.NewGame(chess.UseNotation(chess.LongAlgebraicNotation{})), white: client, black: uciPlayer.Player}
    uciPlayer.gameState = &gameState
    client.match <- &gameState
}

func (h *Hub) matchWs(client *Player) {
    // _very_ naive matching
    if len(h.clients) > 0 {
        for k := range h.clients {
            if k != client {
                delete(h.clients, k)
                log.Printf("Found match creating a game")
                game := Game{White: k.user, Black: client.user}
                db.Create(&game)
                gameState := GameState{game: &game, chess: chess.NewGame(), white: k, black: client}
                client.match <- &gameState
                k.match <- &gameState
                return
            }
        }
    } else {
        h.clients[client] = true
    }
}
