package main

import (
	"log"
)

// Player is a base for UCI and WS players
type Player struct {
	hub    *Hub
	user   string
	color  string
	foe    string
	gameID string
	send   chan *Message // Buffered channel of outbound messages
	match  chan *Match   // Channel for when a match was found
	board  chan *Message
}

// Match upon game start or resume
type Match struct {
	ch         chan *Message
	color      string
	foe        string
	foeElo     int
	gameID     string
	position   string
	whiteClock int64
	blackClock int64
	tc         timeControl
}

// Send implements Client's interface
func (c *Player) Send() chan *Message {
	return c.send
}

// User implements Client's interface
func (c *Player) User() string {
	return c.user
}

// Match implements Client's interface
func (c *Player) Match() chan *Match {
	return c.match
}

/* see https://go101.org/article/channel-closing.html */
func safeSendBytes(ch chan *Message, value *Message) (closed bool) {
	defer func() {
		if recover() != nil {
			closed = true
		}
	}()

	ch <- value  // panic if ch is closed
	return false // <=> closed = false; return
}

func (c *Player) onMatch(match *Match) {
	c.board = match.ch
	c.color = match.color
	c.foe = match.foe
	c.gameID = match.gameID
}

func (c *Player) sendBoard(msg *Message) {
	if c.board == nil {
		log.Printf("player '%s' ignore '%s' command, board == nil\n", c.user, msg.Cmd)
		return
	}
	c.board <- msg
}

func (c *Player) unregister() {
	if c.board != nil {
		close(c.board)
	}
}
