package main

import (
	"net/http"

	"github.com/gorilla/mux"
)

func newRouter(hub *Hub) *mux.Router {
	router := mux.NewRouter().StrictSlash(true)

	/* web-socket */
	router.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})

	/* REST and other coded http requests */
	router.Methods("POST").Path("/api/login").HandlerFunc(login)
	router.Methods("POST").Path("/api/register").HandlerFunc(register)
	router.Methods("POST").Path("/api/passwordReset").HandlerFunc(passwordReset)
	router.Methods("POST").Path("/api/newPassword").HandlerFunc(newPassword)
	router.HandleFunc("/api/logout", logout)
	router.Methods("GET").Path("/api/history").HandlerFunc(history)
	router.Methods("GET").Path("/api/auth").HandlerFunc(checkauth)
	router.Methods("GET").Path("/api/settings").HandlerFunc(getSettings)
	router.Methods("POST").Path("/api/settings").HandlerFunc(setSettings)

	/* Static content */
	spa := spaHandler{staticPath: "dist", indexPath: "index.html"}
	router.PathPrefix("/").Handler(spa)

	return router
}
