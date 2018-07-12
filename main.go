package main

import (
	"log"
        "fmt"
        "net/http"
)

func main() {

	router := NewRouter()
        port := 8383
        fmt.Printf("Listening on %d", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), router))
}
