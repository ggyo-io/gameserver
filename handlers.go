package main

import (
	"html/template"
	"log"
	"net/http"

	"github.com/gorilla/sessions"
)

var (
	// key must be 16, 24 or 32 bytes long (AES-128, AES-192 or AES-256)
	key   = []byte("76e98a932d924ef78d0b6e6ba4456dc0")
	store = sessions.NewCookieStore(key)
)

func Index(w http.ResponseWriter, r *http.Request) {
	data := IndexData{
		UserName: "",
		IsAnnon:  true,
		PGN:      "",
	}
	gameID := r.URL.Query().Get("game")
	if game := findGame(gameID); game != nil {
		data.PGN = game.State
	}
	user := getUserName(r)
	if user != "" {
		data.UserName = user
		data.IsAnnon = false
		loadLoginData(user, &data)
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	// templates["index"].Execute(w, data)
	// Parse every time for now, gives refresh w/o restart
	template := template.Must(template.ParseFiles("tmpl/chess.html"))
	err := template.Execute(w, data)
	if err != nil {
		log.Printf("Error parsing the template: %s\n", err)
	}
}

func loadLoginData(user string, data *IndexData) {
	var games []Game
	db.Where("white = ? OR black = ?", user, user).Order("created_at DESC").Limit(20).Find(&games)
	data.History = make([]HistoryGame, len(games))
	for i, game := range games {
		name := game.White + " vs. " + game.Black + " on " + game.CreatedAt.String()
		url := "?game=" + game.ID
		hg := HistoryGame{Name: name, URL: url}
		data.History[i] = hg
	}
}

func findGame(id string) *Game {
	if id == "" {
		return nil
	}
	var game Game
	if db.Where("id = ?", id).First(&game).RecordNotFound() {
		return nil
	}
	return &game
}

func Login(w http.ResponseWriter, r *http.Request) {
	name := r.FormValue("email")
	pass := r.FormValue("password")
	if name != "" && pass != "" {
		var user User
		if db.Where("name = ?", name).First(&user).RecordNotFound() {
			user = User{Name: name, Password: pass}
			db.Create(&user)
		}
		setSession(name, w, r)
	}
	http.Redirect(w, r, "/", 302)
}

func Logout(w http.ResponseWriter, r *http.Request) {
	clearSession(w, r)
	http.Redirect(w, r, "/", 302)
}

func getUserName(r *http.Request) (userName string) {
	session, _ := store.Get(r, "cookie-name")

	// Check if user is authenticated
	userRef, _ := session.Values["user"]
	switch userRef.(type) {
	case string:
		var user User
		name := userRef.(string)
		if db.Where("name = ?", name).First(&user).RecordNotFound() {
			return ""
		}
		return name
	}
	return ""
}

func setSession(userName string, w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "cookie-name")
	session.Values["user"] = userName
	session.Save(r, w)
}

func clearSession(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "cookie-name")
	delete(session.Values, "user")
	session.Save(r, w)
}
