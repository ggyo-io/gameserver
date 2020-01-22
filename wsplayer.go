// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"encoding/json"
	"errors"
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

// WSPlayer is a Player middleman between the websocket connection and the hub.
type WSPlayer struct {
	*Player

	// The websocket connection.
	conn *websocket.Conn
}

// readPump reads moves from this player and dispatches those to the foe
func (c *WSPlayer) readPump() {
	c.openConnection()
	for {
		message, err := c.makeMove()
		if err != nil {
			log.Printf("wsplayer '%s' readPump breaks the loop, makeMove error: '%v'\n", c.user, err)
			break
		}
		c.dispatch(message)

	}
	c.closeConnection()
	c.unregister()

	// Signal the hub to close the match channel
	rr := &registerRequest{player: c, request: "disconnected"}
	c.hub.register <- rr
}

// writePump pumps messages to the websocket connection.
//
// A goroutine running writePump is started for each connection. The
// application ensures that there is at most one writer to a connection by
// executing all writes from this goroutine.
func (c *WSPlayer) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
		log.Printf("wsplayer '%s' returns from writePump()\n", c.user)
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// Somebody closed the channel.
				log.Printf("wsplayer '%s' send channel closed\n", c.user)
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}

			if msgb, err := json.Marshal(message); err == nil {
				log.Printf("wsplayer '%s' pumping up the WS, message: %s\n", c.user, string(msgb))
				w.Write(msgb)
			}

			if err := w.Close(); err != nil {
				log.Printf("w.Close() error '%s'\n", c.user)
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		case match, ok := <-c.match:
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if match == nil {
				c.send <- &Message{Cmd: "nomatch"}
				continue
			}
			c.onMatch(match)

			whiteElo := getRank(c.User(), match.tc.String())
			blackElo := getRank(c.foe, match.tc.String())
			if c.color != "white" {
				whiteElo, blackElo = blackElo, whiteElo
			}

			c.send <- &Message{Cmd: "start", Color: c.color, User: c.foe, GameID: c.gameID, Params: match.position,
				WhiteClock: match.whiteClock, BlackClock: match.blackClock, WhiteElo: whiteElo, BlackElo: blackElo}
		}
	}
}

/* recieve messages from web socket and forward moves to the foe side */
func (c *WSPlayer) dispatch(message *Message) {
	if message.Cmd == "start" {
		log.Printf("wsplayer '%s' got start command, params '%s' request to register at hub\n", c.user, message.Params)
		rr := &registerRequest{player: c, foe: message.Params, color: message.Color, tc: message.TimeControl, request: "match"}
		c.hub.register <- rr
	} else if message.Cmd == "cancel" {
		c.hub.register <- &registerRequest{player:c, request:"cancel"}
	} else {
		c.sendBoard(message)
	}
}

func (c *WSPlayer) openConnection() {
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
}

func (c *WSPlayer) closeConnection() {
	c.conn.Close()
}

func (c *WSPlayer) makeMove() (*Message, error) {
	_, mb, err := c.conn.ReadMessage()
	if err != nil {
		if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
			log.Printf("error: %v", err)
		}
		return nil, errors.New("UnexpectedClose on WebSocket connection")
	}
	log.Printf("wsplayer '%s' in makeMove() got message '%s'\n", c.user, string(mb))
	var message Message
	if err := json.Unmarshal(mb, &message); err != nil {
		log.Print("ERROR: Unsupported message format")
		return nil, errors.New("Unmarshal")
	}

	return &message, nil
}

func newWSPlayer(hub *Hub, user string, conn *websocket.Conn) *WSPlayer {
	player := &Player{hub: hub, user: user, send: make(chan *Message, 256), match: make(chan *Match)}
	client := &WSPlayer{Player: player, conn: conn}
	return client
}

// serveWs handles websocket requests from the peer.
func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	user := getUserName(r)
	wcconnect(hub, user, conn)
}

func wcconnect(hub *Hub, user string, conn *websocket.Conn) {
	log.Printf("wsconnect %s\n", user)
	player := newWSPlayer(hub, user, conn)
	//if oldPlayer, ok := h.users[user]; ok {
	//	log.Printf("found existing player for user: %s", user)
	//	player = oldPlayer
	//	player.conn = conn
	//	player.sendState()
	//} else {
	//h.users[user] = player
	go player.writePump()
	//}
	go player.readPump()

	// Register with the hub
	rr := &registerRequest{player: player, request: "connected"}
	hub.register <- rr
}
