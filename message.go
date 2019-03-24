package main

type Message struct {
	Cmd    string
	User   string
	Params string
	Color  string
}

type LoginData struct {
	History []HistoryGame `json:"history"`
}
type HistoryGame struct {
	URL  string `json:"url"`
	Name string `json:"name"`
}
