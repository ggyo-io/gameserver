// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type Message struct {
	Cmd    string
	User   string
	Params string
	Color  string
}

// Client is a middleman between the websocket connection and the hub.
type Client struct {
	hub *Hub

	// The websocket connection.
	conn *websocket.Conn

	user string

	// Buffered channel of outbound messages.
	send chan []byte

	// Channel for when a match was found
	match chan *GameState

	gameState *GameState
}

func (c *Client) foe() *Client {
	if c.gameState.black == c {
		return c.gameState.white
	}
	return c.gameState.black
}

// readPump pumps messages from the websocket connection to the hub.
//
// The application runs readPump in a per-connection goroutine. The application
// ensures that there is at most one reader on a connection by executing all
// reads from this goroutine.
func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, mb, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		fmt.Printf("got message %q\n", mb)
		var message Message
		if err := json.Unmarshal(mb, &message); err != nil {
			log.Print("ERROR: Unsupported message format")
			continue
		}

		c.dispatch(&message)
	}
}

// writePump pumps messages from the hub to the websocket connection.
//
// A goroutine running writePump is started for each connection. The
// application ensures that there is at most one writer to a connection by
// executing all writes from this goroutine.
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued chat messages to the current websocket message.
			// n := len(c.send)
			// for i := 0; i < n; i++ {
			// 	w.Write(newline)
			// 	w.Write(<-c.send)
			// }

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		case gameState := <-c.match:
			c.gameState = gameState
			var msg Message
			if gameState.white == c {
				msg = Message{Cmd: "start", Color: "white", User: gameState.black.user}
			} else {
				msg = Message{Cmd: "start", Color: "black", User: gameState.white.user}
			}
			if msgb, err := json.Marshal(&msg); err == nil {
				c.send <- msgb
			}
		}
	}
}

// serveWs handles websocket requests from the peer.
func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	user := getUserName(r)
	if user == "" {
		w.WriteHeader(401)
		return
	}
	client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256), match: make(chan *GameState), user: user}

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump()
}

func (c *Client) dispatch(message *Message) {
	switch message.Cmd {
	case "start":
		c.hub.register <- c
		log.Printf("got start command %s\n", message.Params)
	case "move":
		game := c.gameState.game
		game.State = message.Params
		db.Save(game)
		if msgb, err := json.Marshal(message); err == nil {
			c.foe().send <- msgb
		}

		log.Printf("got move command %s\n", message.Params)
	default:
		log.Printf("Unknown command %s\n", message)
	}
}
