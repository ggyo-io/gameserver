package main

// Message travels between ws player via hub, should probably be refactored
type Message struct {
	Cmd         string
	User        string `json:",omitempty"`
	Params      string `json:",omitempty"`
	Color       string `json:",omitempty"`
	GameID      string `json:",omitempty"`
	WhiteClock  int64  `json:",omitempty"`
	BlackClock  int64  `json:",omitempty"`
	WhiteElo    int    `json:",omitempty"`
	BlackElo    int    `json:",omitempty"`
	TimeControl string `json:",omitempty"`
	Moves       string `json:"-"`
}
