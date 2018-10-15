// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import "log"

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan *Message

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client
}

type GameState struct {
	game  *Game
	white *Client
	black *Client
}

func newHub() *Hub {
	return &Hub{
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			// _very_ naive matching
			h.match(client)
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		}
	}
}

func (h *Hub) match(client *Client) {
	// _very_ naive matching
	if len(h.clients) > 0 {
		for k := range h.clients {
			if k != client {
				delete(h.clients, k)
				log.Printf("Found match creating a game")
				game := Game{White: k.user, Black: client.user}
				db.Create(&game)
				gameState := GameState{game: &game, white: k, black: client}
				client.match <- &gameState
				k.match <- &gameState
				return
			}
		}
	} else {
		h.clients[client] = true
	}
}
