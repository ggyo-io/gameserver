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
	Route{"GET", "/makematch", MakeMatch},
	Route{"GET", "/game/{id}", GameSelect},
	Route{"POST", "/move", MakeMove},
	Route{"POST", "/login", Login},
	Route{"GET", "/logout", Logout},
}
