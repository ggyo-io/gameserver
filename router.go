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
		handler = Logger(handler)
		router.Methods(route.Method).Path(route.Pattern).Handler(handler)
	}
	staticHandler := Logger(http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	router.PathPrefix("/static/").Handler(staticHandler)
	return router
}
