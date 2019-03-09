// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"log"

	"github.com/gorilla/websocket"
	"github.com/notnil/chess"
)

type RegisterRequest struct {
	player *Player
	params string
}

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Player]bool

	// Register requests from the clients.
	register chan RegisterRequest

	// Unregister requests from clients.
	unregister chan *Player

	robots map[string]UciLauncher
	users  map[string]*WSPlayer
}

type GameState struct {
	game  *Game
	chess *chess.Game
	white *Player
	black *Player
}

func newHub(rs ...UciLauncher) *Hub {
	h := &Hub{
		register:   make(chan RegisterRequest),
		unregister: make(chan *Player),
		clients:    make(map[*Player]bool),
		robots:     make(map[string]UciLauncher),
		users:      make(map[string]*WSPlayer),
	}

	for _, r := range rs {
		log.Printf("Starting %s\n", r.name())
		h.robots[r.name()] = r
		r.launch()
	}

	go h.run()
	return h
}

func (h *Hub) run() {
	for {
		select {
		case rq := <-h.register:
			if rq.params == "human" {
				h.matchWs(rq.player)
			} else {
				h.matchUCI(rq.player, rq.params)
			}
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
			}
			//close(client.send)
		}
	}
}

func (h *Hub) matchUCI(client *Player, robotName string) {
	uciPlayer := NewUCIPlayer(h, robotName)
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
				gameState := GameState{game: &game, chess: chess.NewGame(chess.UseNotation(chess.LongAlgebraicNotation{})), white: k, black: client}
				client.match <- &gameState
				k.match <- &gameState
				return
			}
		}
	} else {
		h.clients[client] = true
	}
}

func (h *Hub) WSConnect(user string, conn *websocket.Conn) {
	player := NewWSPlayer(h, user, conn)
	if oldPlayer, ok := h.users[user]; ok {
		log.Printf("found existing player for user: %s", user)
		player = oldPlayer
		player.conn = conn
		player.sendState()
	} else {
		h.users[user] = player
		go player.writePump()
	}
	go player.readPump()
}
