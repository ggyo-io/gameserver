package main

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
)

var (
	// key must be 16, 24 or 32 bytes long (AES-128, AES-192 or AES-256)
	key   = []byte("76e98a932d924ef78d0b6e6ba4456dc0")
	store = sessions.NewCookieStore(key)
)

/*
Test with this curl command:

curl -H "Content-Type: application/json" http://localhost:8383/

*/
func Index(w http.ResponseWriter, r *http.Request) {
	data := IndexData{
		UserName: "Anonnymous",
		IsAnnon:  true,
	}
	userName := getUserName(r)
	if userName != "" {
		data.UserName = userName
		data.IsAnnon = false
	}
	templates["index"].Execute(w, data)
}

func MakeMatch(w http.ResponseWriter, r *http.Request) {
	id := createGame(w, r)
	http.Redirect(w, r, "/game/"+id, 302)
}

func GameSelect(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if id == "" {
		w.WriteHeader(404)
		return
	}

	var game Game
	if db.Where("id = ?", id).First(&game).RecordNotFound() {
		w.WriteHeader(404)
		return
	}

	http.ServeFile(w, r, "static/chess.html")
}

func createGame(w http.ResponseWriter, r *http.Request) string {
	game := Game{}
	db.Create(&game)
	return game.ID
}

/*
Test with this curl command:

curl -H "Content-Type: application/json" -d '{"name":"New User"}' http://localhost:8383/move

*/
func MakeMove(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var userId string
	userId = vars["userId"]

	var user User
	db.Where("id = ?", userId).Take(&user)
	if user.ID != "" {
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(user); err != nil {
			panic(err)
		}
		return
	}

	// If we didn't find it, 404
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusNotFound)

}

/*
Test with this curl command:

curl -H "Content-Type: application/json" -d '{"name":"New User"}' http://localhost:8383/login

*/
func Login(w http.ResponseWriter, r *http.Request) {
	name := r.FormValue("email")
	pass := r.FormValue("password")
	redirectTarget := "/"
	if name != "" && pass != "" {
		var user User
		if db.Where("name = ?", name).First(&user).RecordNotFound() {
			db.Create(&User{Name: name, Password: pass})
		}
		setSession(name, w, r)
	}
	http.Redirect(w, r, redirectTarget, 302)
}

func Logout(w http.ResponseWriter, r *http.Request) {
	clearSession(w, r)
	http.Redirect(w, r, "/", 302)
}

func getUserName(r *http.Request) (userName string) {
	session, _ := store.Get(r, "cookie-name")

	// Check if user is authenticated
	userRef, ok := session.Values["user"]
	if !ok {
		return ""
	}
	return userRef.(string)
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
