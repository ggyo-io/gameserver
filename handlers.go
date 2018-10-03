package main

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"

	"github.com/gorilla/mux"
)

/*
Test with this curl command:

curl -H "Content-Type: application/json" http://localhost:8383/

*/
func Index(w http.ResponseWriter, r *http.Request) {
	data := IndexData{
		UserName: "Anonnymous",
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
	var user User
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, 1048576))
	if err != nil {
		panic(err)
	}
	if err := r.Body.Close(); err != nil {
		panic(err)
	}
	if err := json.Unmarshal(body, &user); err != nil {
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		w.WriteHeader(422) // unprocessable entity
		if err := json.NewEncoder(w).Encode(err); err != nil {
			panic(err)
		}
	}

	db.Create(&user)
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode("ok"); err != nil {
		panic(err)
	}
}
