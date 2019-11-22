package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
)

func main() {
	hub := newHub(&leelaLauncher{make(chan MoveRequest)}, &stockfishLauncher{make(chan MoveRequest), &uciEngine{}})
	router := newRouter(hub)

	log.Printf("Starting hub\n")
	loggedRouter := handlers.LoggingHandler(os.Stdout, router)

	log.Printf("Initializing the database\n")
	initDb()
	defer db.Close()

	port := 8383
	log.Printf("Listening on %d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), loggedRouter))
}
