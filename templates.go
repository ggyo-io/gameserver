package main

import (
	"html/template"
)

var templates map[string]*template.Template

func init() {
	templates = make(map[string]*template.Template)
	templates["index"] = template.Must(template.ParseFiles("tmpl/chess.html"))
}

type indexData struct {
	UserName string
	IsAnnon  bool
	ShowGame bool
	PGN      string
	History  []historyGame
}

type historyGame struct {
	URL     string
	Time    int64
	Name    string
	White   string
	Black   string
	Outcome string
	WhiteElo int
	BlackElo int
}
