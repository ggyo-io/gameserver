package main

import (
	"net/http"

	"github.com/gorilla/mux"
)

func newRouter(hub *Hub) *mux.Router {
	router := mux.NewRouter().StrictSlash(true)
	/* templates */
	router.Methods("GET").Path("/v1").Handler(IndexHandler("tmpl/chess.html"))
	router.Methods("GET").Path("/").Handler(IndexHandler("tmpl/mockup.html"))

	/* static files */
	router.HandleFunc("/{path}.ico", pathHandler)
	router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	router.PathPrefix("/img/").Handler(http.FileServer(http.Dir("static")))

	/* web-socket */
	router.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})

	/* REST and other coded http requests */
	router.Methods("POST").Path("/login").HandlerFunc(login)
	router.Methods("POST").Path("/register").HandlerFunc(register)
	router.HandleFunc("/logout", logout)

	router.Methods("GET").Path("/history").HandlerFunc(history)
	router.Methods("GET").Path("/auth").HandlerFunc(checkauth)

	return router
}
