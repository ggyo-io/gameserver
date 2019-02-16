package main

import (
	"net/http"

	"github.com/gorilla/mux"
)

func NewRouter(hub* Hub) *mux.Router {
	router := mux.NewRouter().StrictSlash(true)

	// Normal handlers
	router.HandleFunc("/", Index)

	router.Methods("POST").Path("/login").HandlerFunc(Login)
	router.HandleFunc("/logout", Logout)

	// Static pages handler
	staticHandler := http.StripPrefix("/static/", http.FileServer(http.Dir("static")))
	router.PathPrefix("/static/").Handler(staticHandler)
	router.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})
	return router
}
