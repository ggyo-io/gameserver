// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"log"

	"github.com/notnil/chess"
)

type Client interface {
	User() string
	Match() chan *Match
	Send() chan *Message
}

type RegisterRequest struct {
	player Client
	foe    string
	color  string
}

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	clients  map[Client]RegisterRequest // open register requests
	register chan RegisterRequest       // Register requests from the clients.
	robots   map[string]UciLauncher
	//users  map[string]*WSPlayer
}

func newHub(rs ...UciLauncher) *Hub {
	h := &Hub{
		register: make(chan RegisterRequest),
		clients:  make(map[Client]RegisterRequest),
		robots:   make(map[string]UciLauncher),
		//users:      make(map[string]*WSPlayer),
	}

	for _, r := range rs {
		if exePresent(r) {
			log.Printf("Starting %s\n", r.name())
			h.robots[r.name()] = r
			r.launch()
		} else {
			log.Printf("%s exe not found.\n", r.name())
		}
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
		}
	}
}

func (h *Hub) matchUCI(rq RegisterRequest) {
	if _, ok := h.robots[rq.foe]; !ok {
		rq.player.Match() <- nil
		return
	}
	uciPlayer := NewUCIPlayer(h, rq.foe)
	var whitePlayer, blackPlayer Client

	whitePlayer = rq.player
	blackPlayer = uciPlayer

	if rq.color == "black" {
		whitePlayer = uciPlayer
		blackPlayer = rq.player
	}

	game := Game{Active: true, White: whitePlayer.User(), Black: blackPlayer.User()}
	db.Create(&game)
	board := Board{game: &game, chess: chess.NewGame(chess.UseNotation(chess.LongAlgebraicNotation{})),
		white: NewBoardPlayer(whitePlayer), black: NewBoardPlayer(blackPlayer)}

	if uciPlayer == whitePlayer {
		uciPlayer.onMatch(&Match{ch: board.white.ch, color: "white", foe: rq.player.User(), gameID: game.ID})
		rq.player.Match() <- &Match{ch: board.black.ch, color: "black", foe: uciPlayer.User(), gameID: game.ID}
		uciPlayer.Send() <- &Message{Cmd: "move"}
	} else {
		uciPlayer.onMatch(&Match{ch: board.black.ch, color: "black", foe: rq.player.User(), gameID: game.ID})
		rq.player.Match() <- &Match{ch: board.white.ch, color: "white", foe: uciPlayer.User(), gameID: game.ID}
	}
	go uciPlayer.writePump()
	go uciPlayer.readPump()
	go board.run()

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

func choosePlayersColors(rq1, rq2 RegisterRequest) (white, black Client) {
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
				game := Game{Active: true, White: white.User(), Black: black.User()}
				db.Create(&game)
				board := Board{game: &game, chess: chess.NewGame(chess.UseNotation(chess.LongAlgebraicNotation{})),
					white: NewBoardPlayer(white), black: NewBoardPlayer(black)}
				delete(h.clients, white)
				delete(h.clients, black)
				white.Match() <- &Match{ch: board.white.ch, color: "white", foe: black.User(), gameID: game.ID}
				black.Match() <- &Match{ch: board.black.ch, color: "black", foe: white.User(), gameID: game.ID}
				go board.run()
				return
			}
		}
	} else {
		h.clients[rq.player] = rq
	}
}
