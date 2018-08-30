package main

import (
	"net/http"
)

type Route struct {
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

type Routes []Route

var routes = Routes{
	Route{"GET", "/", Index},
	Route{"GET", "/game", GameSelect},
	Route{"POST", "/move", MakeMove},
	Route{"GET", "/login", Login},
}
