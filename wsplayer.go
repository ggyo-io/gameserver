// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strings"
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

// Client is a middleman between the websocket connection and the hub.
type WSPlayer struct {
	*Player

	// The websocket connection.
	conn *websocket.Conn
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

// writePump pumps messages from the hub to the websocket connection.
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
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			log.Printf("pumping up the WS, message: %s\n", string(message))
			w.Write(message)

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		case gameState, ok := <-c.match:
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			c.gameState = gameState
			msg := Message{Cmd: "start", Color: c.color(), User: c.foe().User(), Params: c.gameState.game.ID}
			c.sendMessage(msg)
		}
	}
}

func (c *WSPlayer) sendState() {
	position := c.gameState.chess.String()
	// need to remove trailing * cuz it look like diz: \n1.e2e4 d7d5 2.b1c3 c7c6  *
	position = strings.TrimSuffix(position, " *")
	position = strings.TrimSpace(position)
	msg := Message{Cmd: "resume", Color: c.color(), Params: position}
	c.sendMessage(msg)
}

func NewWSPlayer(hub *Hub, user string, conn *websocket.Conn) *WSPlayer {
	player := &Player{hub: hub, user: user, send: make(chan []byte, 256), match: make(chan *GameState)}
	client := &WSPlayer{Player: player, conn: conn}
	client.PlayerI = client

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
	WSConnect(hub, user, conn)
}

func WSConnect(hub *Hub, user string, conn *websocket.Conn) {
	log.Printf("wsconnect %s\n", user)
	player := NewWSPlayer(hub, user, conn)
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
	data := loadLoginData(user)
	player.sendMessage(Message{Cmd: "login", User: player.user, Params: data})
}

func loadLoginData(user string) string {
	var games []Game
	db.Where("white = ? OR black = ?", user, user).Order("created_at DESC").Limit(100).Find(&games)
	ld := LoginData{make([]HistoryGame, len(games))}
	for i, game := range games {
		name := game.White + " vs. " + game.Black + " on " + game.CreatedAt.String()
		url := "?game=" + game.ID
		hg := HistoryGame{Name: name, URL: url}
		ld.History[i] = hg
	}

	msgb, err := json.Marshal(ld)
	if err != nil {
		log.Println(err)
		return ""
	}
	return string(msgb)
}
