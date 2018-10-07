package main

import (
	"html/template"
)

var templates map[string]*template.Template

func init() {
	templates = make(map[string]*template.Template)
	templates["index"] = template.Must(template.ParseFiles("tmpl/home.html"))
}

type IndexData struct {
	UserName string
	IsAnnon  bool
}
