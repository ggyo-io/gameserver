// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"log"

	"github.com/notnil/chess"
)

type RegisterRequest struct {
	player *Player
	foe    string
	color  string
}

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// open register requests
	clients map[*Player]RegisterRequest

	// Register requests from the clients.
	register chan RegisterRequest

	// Unregister requests from clients.
	unregister chan *Player

	robots map[string]UciLauncher
	//users  map[string]*WSPlayer
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
		clients:    make(map[*Player]RegisterRequest),
		robots:     make(map[string]UciLauncher),
		//users:      make(map[string]*WSPlayer),
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
			if rq.foe == "human" {
				h.matchWs(rq)
			} else {
				h.matchUCI(rq)
			}
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
			}
			client.sendToFoe(&Message{Cmd: "disconnect"})
			client.onUnregister()
		}
	}
}

func (h *Hub) matchUCI(rq RegisterRequest) {
	uciPlayer := NewUCIPlayer(h, rq.foe)
	go uciPlayer.writePump()
	go uciPlayer.readPump()

	var whitePlayer, blackPlayer *Player

	whitePlayer = rq.player
	blackPlayer = uciPlayer.Player

	if rq.color == "black" {
		whitePlayer = uciPlayer.Player
		blackPlayer = rq.player
	}

	game := Game{Active: true, White: whitePlayer.user, Black: blackPlayer.user}
	db.Create(&game)
	gameState := GameState{game: &game, chess: chess.NewGame(chess.UseNotation(chess.LongAlgebraicNotation{})), white: whitePlayer, black: blackPlayer}
	uciPlayer.gameState = &gameState
	rq.player.match <- &gameState
	if uciPlayer.Player == whitePlayer {
		uciPlayer.sendMessage(Message{Cmd: "move"})
	}
}

func matchColor(c1, c2 string) bool {
	if c1 == "any" || c2 == "any" {
		return true
	}

	if c1 != c2 {
		return true
	}

	return false
}

func choosePlayersColors(rq1, rq2 RegisterRequest) (white, black *Player) {
	if !matchColor(rq1.color, rq2.color) {
		log.Fatalf("can not match color rq1 '%v' rq2 '%v'\n", rq1, rq2)
		return nil, nil
	}
	if rq1.color == "any" {
		return rq2.player, rq1.player
	}
	if rq2.color == "any" {
		return rq1.player, rq2.player
	}
	if rq2.color == "white" {
		return rq2.player, rq1.player
	}
	return rq1.player, rq2.player
}

func (h *Hub) matchWs(rq RegisterRequest) {
	// _very_ naive matching
	if len(h.clients) > 0 {
		for k := range h.clients {
			if k != rq.player && matchColor(rq.color, h.clients[k].color) {
				log.Printf("Found match creating a game")
				white, black := choosePlayersColors(rq, h.clients[k])
				game := Game{Active: true, White: white.user, Black: black.user}
				db.Create(&game)
				gameState := GameState{game: &game, chess: chess.NewGame(chess.UseNotation(chess.LongAlgebraicNotation{})), white: white, black: black}
				delete(h.clients, k)
				rq.player.match <- &gameState
				k.match <- &gameState
				return
			}
		}
	} else {
		h.clients[rq.player] = rq
	}
}
