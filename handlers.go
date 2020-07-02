package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/mail"
	"os"
	"path/filepath"
	"strings"

	uuid "github.com/satori/go.uuid"
)

type credentials struct {
	Username string
	Password string
	Email    string
}

func passwordReset(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var c credentials
	err := decoder.Decode(&c)
	if err != nil {
		http.Error(w, "invalid input", http.StatusForbidden)
		return
	}

	user := findUserByName(c.Username)
	if user == nil {
		http.Error(w, "unknown username", http.StatusForbidden)
		return
	}

	user.Token = randSeq(64)
	log.Printf("resetPassword token %s user %s email %s\n", user.Token, user.Name, user.Email)

	if err := db.Save(user).Error; err != nil {
		panic(err)
	}

	to := mail.Address{user.Name, user.Email}
	subj := "GG Yo password reset"
	body := fmt.Sprintf("Hello %s,\n\nClick on the link bellow to reset your password\nhttp://ggyo.io/resetPassword?token=%s\n\n\tGG Yo bot\n",
		user.Name, user.Token)

	SendEmail(to, subj, body)

	w.WriteHeader(http.StatusOK)
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
	userName, clientId := getUserName(r, true)
	log.Printf("chackauth user [%s], client-id [%s]", userName, clientId)
	if clientId == "" {
		setSession(userName, w, r)
	}
	w.WriteHeader(http.StatusOK)
}

// spaHandler implements the http.Handler interface, so we can use it
// to respond to HTTP requests. The path to the static directory and
// path to the index file within that static directory are used to
// serve the SPA in the given static directory.
type spaHandler struct {
	staticPath string
	indexPath  string
}

// ServeHTTP inspects the URL path to locate a file within the static dir
// on the SPA handler. If a file is found, it will be served. If not, the
// file located at the index path on the SPA handler will be served. This
// is suitable behavior for serving an SPA (single page application).
func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// get the absolute path to prevent directory traversal
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		// if we failed to get the absolute path respond with a 400 bad request
		// and stop
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// prepend the path with the path to the static directory
	path = filepath.Join(h.staticPath, path)

	// check whether a file exists at the given path
	_, err = os.Stat(path)
	if os.IsNotExist(err) {
		// file does not exist, serve index.html
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	} else if err != nil {
		// if we got an error (that wasn't that the file doesn't exist) stating the
		// file, return a 500 internal server error and stop
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// otherwise, use http.FileServer to serve the static dir
	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
}
