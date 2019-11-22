package main

import (
	"net/http"

	"github.com/gorilla/mux"
)

func newRouter(hub *Hub) *mux.Router {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", index)

	router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	router.PathPrefix("/img/").Handler(http.FileServer(http.Dir("static")))
	router.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})
	router.Methods("POST").Path("/login").HandlerFunc(login)
	router.HandleFunc("/logout", logout)
	return router
}
