package main

import (
	"crypto/sha256"
	"fmt"
	"github.com/gorilla/sessions"
)

var (
	// key must be 16, 24 or 32 bytes long (AES-128, AES-192 or AES-256)
	key   = []byte("76e98a932d924ef78d0b6e6ba4456dc0")
	store = sessions.NewCookieStore(key)
)

func shastr(str string) string {
	crypt := sha256.New()
	crypt.Write([]byte(str))
	hashedBytes := crypt.Sum(nil)
	return fmt.Sprintf("%x", hashedBytes)
}
