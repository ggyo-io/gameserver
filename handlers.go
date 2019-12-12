package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/mux"
)

func pathHandler(w http.ResponseWriter, r *http.Request) {
	pathVariables := mux.Vars(r)
	path, e := pathVariables["path"]
	if e != true {
		http.Error(w, "Can not find path mux variable", http.StatusInternalServerError)
		return
	}

	// check whether a file exists at the given path
	path = "static/" + path + ".ico"
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		// if we got an error (that wasn't that the file doesn't exist) stating the
		// file, return a 500 internal server error and stop
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// otherwise, use http.FileServer to serve the static dir
	http.FileServer(http.Dir("static")).ServeHTTP(w, r)
}

func index(w http.ResponseWriter, r *http.Request) {
	data := indexData{
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

func loadLoginData(user string, data *indexData) {
	var games []Game
	db.Where("white = ? OR black = ?", user, user).Order("created_at DESC").Limit(20).Find(&games)
	data.History = make([]historyGame, len(games))
	for i, game := range games {
		name := game.White + " vs. " + game.Black + " on " + game.CreatedAt.String()
		url := "?game=" + game.ID
		hg := historyGame{Name: name, URL: url}
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

func register(w http.ResponseWriter, r *http.Request) {
	name := r.FormValue("username")
	pass := r.FormValue("password")
	email := r.FormValue("email")
	if name == "" || pass == "" || email == "" || !strings.Contains(email, "@") || !strings.Contains(email, "."){
		http.Redirect(w, r, "/register?err=invalid input", 302)
		return
	}

	if existingUser := findUserByName(name); existingUser != nil {
		http.Redirect(w, r, "/signup?err=user taken", 302)
		return
	}

	user := &User{Name:name, Password:shastr(pass), Email:email}
	if err := db.Create(user).Error; err != nil {
		log.Print("Error creating a user", err)
		http.Redirect(w, r, "/signup?err=create failed", 302)
	}
	// Success!
	setSession(name, w, r)
	http.Redirect(w, r, "/", 302)

}

func login(w http.ResponseWriter, r *http.Request) {
	name := r.FormValue("username")
	pass := r.FormValue("password")
	if name == "" || pass == "" {
		http.Redirect(w, r, "/signin?err=invalid input", 302)
		return
	}
	if findUserByNameAndPass(name, pass) == nil {
		http.Redirect(w, r, "/signin?err=no such user", 302)
		return
	}
	// Success!
	setSession(name, w, r)
	http.Redirect(w, r, "/", 302)
}

func logout(w http.ResponseWriter, r *http.Request) {
	clearSession(w, r)
	http.Redirect(w, r, "/", 302)
}

func getUserName(r *http.Request) (userName string) {
	session, _ := store.Get(r, "cookie-name")

	// Check if user is authenticated
	userRef, _ := session.Values["user"]
	switch userRef.(type) {
	case string:
		name := userRef.(string)
		if findUserByName(name) != nil {
			return name
		}
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
