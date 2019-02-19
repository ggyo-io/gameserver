package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
)

func main() {
	hub := newHub( &LeelaLauncher{make (chan MoveRequest) }, &StockfishLauncher{make (chan MoveRequest), &UciEngine{}} )
	router := NewRouter(hub)

	log.Printf("Starting hub\n")
	loggedRouter := handlers.LoggingHandler(os.Stdout, router)

	log.Printf("Initializing the database\n")
	InitDb()
	defer db.Close()

	port := 8383
	log.Printf("Listening on %d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), loggedRouter))
}
