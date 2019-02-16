package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
)

func main() {
	hub := newHub()
	router := NewRouter(hub)
	fmt.Printf("Starting hub\n")
	loggedRouter := handlers.LoggingHandler(os.Stdout, router)
	fmt.Printf("Starting leela\n")
	leelaStart(hub.moveRequest)

	port := 8383
	fmt.Printf("Initializing the database\n")
	InitDb()
	defer db.Close()
	fmt.Printf("Listening on %d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), loggedRouter))
}
