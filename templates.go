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
	URL  string
	Name string
}
