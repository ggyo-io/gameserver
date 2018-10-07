package main

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/securecookie"
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

/*
Test with this curl command:

curl -H "Content-Type: application/json" -d '{"name":"New User"}' http://localhost:8383/game

*/

func GameSelect(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
	var games []Game
	db.Find(&games)

	if err := json.NewEncoder(w).Encode(games); err != nil {
		panic(err)
	}
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
	if err := json.NewEncoder(w).Encode(jsonErr{Code: http.StatusNotFound, Text: "Not Found"}); err != nil {
		panic(err)
	}

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
		setSession(name, w)
	}
	http.Redirect(w, r, redirectTarget, 302)
}

func Logout(w http.ResponseWriter, r *http.Request) {
	clearSession(w)
	http.Redirect(w, r, "/", 302)
}

// cookie handling

var cookieHandler = securecookie.New(securecookie.GenerateRandomKey(64), securecookie.GenerateRandomKey(32))

func getUserName(request *http.Request) (userName string) {
	if cookie, err := request.Cookie("session"); err == nil {
		cookieValue := make(map[string]string)
		if err = cookieHandler.Decode("session", cookie.Value, &cookieValue); err == nil {
			userName = cookieValue["name"]
		}
	}
	return userName
}

func setSession(userName string, response http.ResponseWriter) {
	value := map[string]string{
		"name": userName,
	}
	if encoded, err := cookieHandler.Encode("session", value); err == nil {
		cookie := &http.Cookie{
			Name:  "session",
			Value: encoded,
			Path:  "/",
		}
		http.SetCookie(response, cookie)
	}
}

func clearSession(response http.ResponseWriter) {
	cookie := &http.Cookie{
		Name:   "session",
		Value:  "",
		Path:   "/",
		MaxAge: -1,
	}
	http.SetCookie(response, cookie)
}
