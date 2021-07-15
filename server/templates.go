package main

type indexData struct {
	UserName string
	IsAnnon  bool
	ShowGame bool
	PGN      string
	History  []historyGame
}

type historyGame struct {
	PGN      string
	Time     int64
	Name     string
	White    string
	Black    string
	Outcome  string
	WhiteElo int
	BlackElo int
}
