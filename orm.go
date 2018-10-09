package main

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var (
	db *gorm.DB
)

func InitDb() {
	var err error
	db, err = gorm.Open("mysql", "root@/test?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		println("ERRRR connecting")
		panic(err)
	}
	db.LogMode(true)

	// Migrate the schema
	db.AutoMigrate(&GameType{})
	db.AutoMigrate(&Game{})
	db.AutoMigrate(&Player{})
	db.AutoMigrate(&User{})

	// Init some data
	// Create
	var chess, chat, tictactoe, rubik GameType
	db.FirstOrCreate(&chess, GameType{Name: "Chess"})
	db.FirstOrCreate(&chat, GameType{Name: "Chat"})
	db.FirstOrCreate(&tictactoe, GameType{Name: "TicTacToe"})
	db.FirstOrCreate(&rubik, GameType{Name: "Rubik"})
}
