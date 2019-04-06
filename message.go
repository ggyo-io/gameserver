package main

type Message struct {
	Cmd    string
	User   string `json:",omitempty"`
	Params string `json:",omitempty"`
	Color  string `json:",omitempty"`
	moves  string `json:"-"`
}

