package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"

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

	rand.Seed(time.Now().UnixNano())

	port := 8383
	log.Printf("Listening on %d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), loggedRouter))

}
