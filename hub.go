package main

import (
	"log"
	"math"
	"time"
)

// Client represents a playing user registered to the hub
type Client interface {
	User() string
	ClientID() string
	Match() chan *Match
	Send() chan *Message
	Board() chan *Message
	Elo(string) int
	SetElo(int, string)
}

type registerRequest struct {
	request string
	player  Client
	foe     string
	color   string
	tc      string
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
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			for k, _ := range h.clients {
				h.sendQueuesStatus(k)
			}
		case rq := <-h.register:
			switch rq.request {
			case "connected":
				h.connect(rq)
			case "disconnected":
				h.disconnect(rq)
			case "match":
				h.match(rq)
			case "gameover":
				h.gameover(rq.board)
			case "reconnected":
				h.reconnect(rq)
			case "cancel":
				delete(h.clients, rq.player)
			}
		}
	}
}

func (h *Hub) reconnect(rq *registerRequest) {
	log.Printf("board reconnected %#v", rq)
	rq.player.Match() <- rq.match
}

func (h *Hub) connect(rq *registerRequest) {
	b := h.disconnected[rq.player.ClientID()]
	log.Printf("board user %s connected found board %#v", rq.player.User(), b)
	if b != nil {
		b.control <- rq.player
	}
}

func (h *Hub) disconnect(rq *registerRequest) {
	close(rq.player.Match())
	b := h.boards[rq.player]
	if b != nil {
		h.disconnected[rq.player.ClientID()] = b
	}
	delete(h.boards, rq.player)
	delete(h.clients, rq.player)
}

func (h *Hub) match(rq *registerRequest) {
	b := h.boards[rq.player]
	if b != nil {
		// reconnect
		b.control <- rq.player
		return
	}

	if rq.foe == "human" {
		h.matchHuman(rq)
	} else {
		h.matchUCI(rq)
	}
}

func (h *Hub) gameover(board *Board) {
	board.control <- nil
	h.removeBoardPlayer(board.white)
	h.removeBoardPlayer(board.black)
}

func (h *Hub) removeBoardPlayer(bp *boardPlayer) {
	delete(h.disconnected, bp.ClientID())
	delete(h.boards, bp.Client)
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

	tc := newTimeControl(rq.tc)
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
		log.Printf("Error: can not match color rq1 '%v' rq2 '%v'\n", rq1, rq2)
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

func (h *Hub) matchHuman(rq *registerRequest) {

	var matches []Client
	for k := range h.clients {
		if k != rq.player && matchColor(rq.color, h.clients[k].color) && rq.tc == h.clients[k].tc {
			matches = append(matches, k)
		}
	}
	// find the best match by elo diff
	var best Client
	if len(matches) > 0 {
		// make match range depend on # of connected players
		var eloRange float64 = 1000
		if len(h.boards)+len(h.clients) > 100 {
			eloRange = 200
		}

		for _, k := range matches {
			if h.betterMatch(rq, k, best, eloRange) {
				best = k
			}
		}
	}
	if best != nil {
		h.createGameHumans(rq, best)
	} else {
		// if no match found wait in queue
		h.clients[rq.player] = rq
		h.sendQueuesStatus(rq.player)
	}
	return
}

func (h *Hub) betterMatch(rq *registerRequest, contender Client, best Client, eloRange float64) bool {
	contenderRange := math.Abs(float64(rq.player.Elo(rq.tc) - contender.Elo(rq.tc)))
	bestRange := math.MaxFloat64
	if best != nil {
		bestRange = math.Abs(float64(rq.player.Elo(rq.tc) - best.Elo(rq.tc)))
	}
	if contenderRange <= eloRange && contenderRange < bestRange {
		return true
	}
	return false
}

func (h *Hub) createGameHumans(rq *registerRequest, k Client) {
	white, black := choosePlayersColors(rq, h.clients[k])
	tc := newTimeControl(rq.tc)
	board := newBoard(h.register, white, black, tc)
	cms := tc.time * 1000
	delete(h.clients, white)
	delete(h.clients, black)

	h.boards[white] = board
	h.boards[black] = board

	white.Match() <- &Match{ch: board.white.ch, color: "white", foe: black.User(), foeElo: black.Elo(tc.String()),
		gameID: board.game.ID, whiteClock: cms, blackClock: cms, tc: tc}
	black.Match() <- &Match{ch: board.black.ch, color: "black", foe: white.User(), foeElo: white.Elo(tc.String()),
		gameID: board.game.ID, whiteClock: cms, blackClock: cms, tc: tc}
	go board.run()
}

func (h *Hub) sendQueuesStatus(client Client) {
	client.Send() <- &Message{Cmd: "queues_status", Map: map[string]interface{}{
		"PlayersPlaying": len(h.boards),
		"PlayersInQueue": len(h.clients),
	}}
}
