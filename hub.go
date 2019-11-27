package main

import (
	"log"
)

// Client represents a playing user registered to the hub
type Client interface {
	User() string
	Match() chan *Match
	Send() chan *Message
}

type registerRequest struct {
	request string
	player  Client
	foe     string
	color   string
	board   *Board
	match   *Match
}

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	clients      map[Client]*registerRequest // open register requests
	register     chan *registerRequest       // Register requests from the clients
	robots       map[string]uciLauncher
	disconnected map[string]*Board
	boards       map[Client]*Board
}

func newHub(rs ...uciLauncher) *Hub {
	h := &Hub{
		clients:      make(map[Client]*registerRequest),
		register:     make(chan *registerRequest),
		boards:       make(map[Client]*Board),
		robots:       make(map[string]uciLauncher),
		disconnected: make(map[string]*Board),
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
			switch rq.request {
			case "connected":
				b := h.disconnected[rq.player.User()]
				log.Printf("board user %s connected found board %#v", rq.player.User(), b)
				if b != nil {
					b.control <- rq.player
				}
			case "disconnected":
				close(rq.player.Match())
				b := h.boards[rq.player]
				if b != nil {
					h.disconnected[rq.player.User()] = b
				}
				delete(h.boards, rq.player)
			case "match":
				if rq.foe == "human" {
					h.matchWs(rq)
				} else {
					h.matchUCI(rq)
				}
			case "gameover":
				rq.board.control <- nil
				delete(h.disconnected, rq.board.white.User())
				delete(h.disconnected, rq.board.black.User())
			case "reconnected":
				log.Printf("board reconnected %#v", rq)
				rq.player.Match() <- rq.match
			}
		}
	}
}

func (h *Hub) matchUCI(rq *registerRequest) {
	if _, ok := h.robots[rq.foe]; !ok {
		rq.player.Match() <- nil
		return
	}
	uciPlayer := newUCIPlayer(h, rq.foe)
	var whitePlayer, blackPlayer Client

	whitePlayer = rq.player
	blackPlayer = uciPlayer

	if rq.color == "black" {
		whitePlayer = uciPlayer
		blackPlayer = rq.player
	}

	tc := timeControl{time: 15 * 60, increment: 15}
	board := newBoard(h.register, whitePlayer, blackPlayer, tc)
	cms := tc.time * 1000
	if uciPlayer == whitePlayer {
		uciPlayer.onMatch(&Match{ch: board.white.ch, color: "white", foe: rq.player.User(), gameID: board.game.ID, whiteClock: cms, blackClock: cms, tc: tc})
		rq.player.Match() <- &Match{ch: board.black.ch, color: "black", foe: uciPlayer.User(), gameID: board.game.ID, whiteClock: cms, blackClock: cms, tc: tc}
		uciPlayer.Send() <- &Message{Cmd: "move"}
	} else {
		uciPlayer.onMatch(&Match{ch: board.black.ch, color: "black", foe: rq.player.User(), gameID: board.game.ID, whiteClock: cms, blackClock: cms, tc: tc})
		rq.player.Match() <- &Match{ch: board.white.ch, color: "white", foe: uciPlayer.User(), gameID: board.game.ID, whiteClock: cms, blackClock: cms, tc: tc}
	}

	h.boards[rq.player] = board

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

func choosePlayersColors(rq1, rq2 *registerRequest) (white, black Client) {
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

func (h *Hub) matchWs(rq *registerRequest) {
	// _very_ naive matching
	if len(h.clients) > 0 {
		for k := range h.clients {
			if k != rq.player && matchColor(rq.color, h.clients[k].color) {
				log.Printf("Found match creating a game")
				white, black := choosePlayersColors(rq, h.clients[k])
				tc := timeControl{time: 15 * 60, increment: 15}
				board := newBoard(h.register, white, black, tc)
				cms := tc.time * 1000
				delete(h.clients, white)
				delete(h.clients, black)

				h.boards[white] = board
				h.boards[black] = board

				white.Match() <- &Match{ch: board.white.ch, color: "white", foe: black.User(), gameID: board.game.ID, whiteClock: cms, blackClock: cms, tc: tc}
				black.Match() <- &Match{ch: board.black.ch, color: "black", foe: white.User(), gameID: board.game.ID, whiteClock: cms, blackClock: cms, tc: tc}
				go board.run()
				return
			}
		}
	} else {
		h.clients[rq.player] = rq
	}
}
