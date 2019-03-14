package main

import (
	"net/http"

	"github.com/gorilla/mux"
)

func NewRouter(hub *Hub) *mux.Router {
	router := mux.NewRouter().StrictSlash(true)
	router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	router.PathPrefix("/img/").Handler(http.FileServer(http.Dir("static")))
	router.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/chess.html")
	})
	router.Methods("POST").Path("/login").HandlerFunc(Login)
	router.HandleFunc("/logout", Logout)
	return router
}
