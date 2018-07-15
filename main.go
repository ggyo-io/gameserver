package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	router := NewRouter()
	port := 8383
	fmt.Printf("Initializing the database\n")
	InitDb()
	defer db.Close()
	fmt.Printf("Listening on %d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), router))
}
