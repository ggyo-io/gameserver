package main

import (
	"net/http"

	"github.com/gorilla/mux"
)

func NewRouter() *mux.Router {
	router := mux.NewRouter().StrictSlash(true)
	for _, route := range routes {
		var handler http.Handler
		handler = route.HandlerFunc
		handler = Logger(handler, route.Name)
		router.Methods(route.Method).Path(route.Pattern).Name(route.Name).Handler(handler)
	}
	staticHandler := Logger(http.StripPrefix("/static/", http.FileServer(http.Dir("static"))), "static")
	router.PathPrefix("/static/").Handler(staticHandler)
	return router
}
