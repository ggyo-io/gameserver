package main

import (
	"fmt"
	"log"
	"net/http"
	"net/mail"
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

	to := mail.Address{"Alexander Indenbaum", "alexander.indenbaum@gmail.com"}
	subj := "ggyo startup"
	body := "GG YO server is Starting.\n Good Luck!"
	SendEmail(to, subj, body)

	port := 8383
	log.Printf("Listening on %d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), loggedRouter))

}
