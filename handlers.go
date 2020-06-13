package main

import (
	"encoding/json"
	"fmt"
	uuid "github.com/satori/go.uuid"
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

type indexHandler struct {
	path string
}

// IndexHandler  with template path
func IndexHandler(p string) http.Handler {
	return &indexHandler{p}
}

func (i *indexHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	data := indexData{
		UserName: "",
		IsAnnon:  true,
		PGN:      "",
	}
	gameID := r.URL.Query().Get("game")
	if game := findGame(gameID); game != nil {
		data.PGN = game.State
	}
	user, _ := getUserName(r, true)
	if user != "" {
		data.UserName = user
		data.IsAnnon = false
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	// templates["index"].Execute(w, data)
	// Parse every time for now, gives refresh w/o restart
	template := template.Must(template.ParseFiles(i.path))
	err := template.Execute(w, data)
	if err != nil {
		log.Printf("Error parsing the template: %s\n", err)
	}
}

type credentials struct {
	Username string
	Password string
	Email    string
}

func register(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var c credentials
	err := decoder.Decode(&c)
	if err != nil {
		http.Error(w, "invalid input", http.StatusForbidden)
		return
	}
	name, pass, email := c.Username, c.Password, c.Email

	if name == "" || pass == "" || email == "" || !strings.Contains(email, "@") || !strings.Contains(email, ".") {
		http.Error(w, "invalid input", http.StatusForbidden)
		return
	}

	if existingUser := findUserByName(name); existingUser != nil {
		http.Error(w, "username taken", http.StatusForbidden)
		return
	}

	user := &User{Name: name, Password: shastr(pass), Email: email}
	if err := db.Create(user).Error; err != nil {
		log.Print("Error creating a user", err)
		http.Error(w, "registration failed", http.StatusForbidden)
	}
	// Success!
	setSession(name, w, r)
	w.WriteHeader(http.StatusOK)
}

func login(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var c credentials
	err := decoder.Decode(&c)
	if err != nil {
		http.Error(w, "invalid input", http.StatusUnauthorized)
		return
	}
	name, pass := c.Username, c.Password
	if name == "" || pass == "" {
		http.Error(w, "invalid input", http.StatusUnauthorized)
		return
	}
	if findUserByNameAndPass(name, pass) == nil {
		http.Error(w, "authentication failed", http.StatusUnauthorized)
		return
	}
	// Success!
	setSession(name, w, r)
	w.WriteHeader(http.StatusOK)
}

func logout(w http.ResponseWriter, r *http.Request) {
	clearSession(w, r)
	w.WriteHeader(http.StatusOK)
}

func getUserName(r *http.Request, verify bool) (userName string, clientId string) {
	session, _ := store.Get(r, "cookie-name")

	clientRef, _ := session.Values["client-id"]
	switch clientRef.(type) {
	case string:
		clientId = clientRef.(string)
	default:
		clientId = ""
	}

	// Check if user is authenticated
	userRef, _ := session.Values["user"]
	switch userRef.(type) {
	case string:
		name := userRef.(string)
		if verify {
			if findUserByName(name) != nil {
				return name, clientId
			}
		} else {
			return name, clientId
		}
	}
	return "", clientId
}

func setSession(userName string, w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "cookie-name")
	session.Values["user"] = userName
	clientId := fmt.Sprintf("%s-%s", userName, str(uuid.NewV4()))
	session.Values["client-id"] = clientId
	session.Save(r, w)
}

func clearSession(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "cookie-name")
	delete(session.Values, "user")
	session.Save(r, w)
}

func history(w http.ResponseWriter, r *http.Request) {
	user, _ := getUserName(r, true)
	if user == "" {
		w.WriteHeader(http.StatusForbidden)
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusOK)

	idxData := &indexData{}
	loadLoginData(user, idxData)
	if msgb, err := json.Marshal(idxData); err == nil {
		w.Write(msgb)
	} else {
		log.Print("ERROR marshaling game history json", err)
	}
}

func checkauth(w http.ResponseWriter, r *http.Request) {
	log.Print("check auth called")
	userName, clientId := getUserName(r, true)
	log.Printf("chackauth user [%s], client-id [%s]", userName, clientId)
	if clientId == "" {
		setSession(userName, w, r)
	}
	idxData := &indexData{UserName: userName}
	if msgb, err := json.Marshal(idxData); err == nil {
		w.Write(msgb)
	} else {
		log.Print("checkauth: ERROR marshaling indexData", err)
	}
}
