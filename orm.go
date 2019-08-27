package main

import (
	"fmt"
	"log"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var (
	db *gorm.DB
)

func InitDb() {
	userPass := "root"
	dbpass := os.Getenv("DB_PASS")
	if dbpass != "" {
		userPass = fmt.Sprintf("root:%s", dbpass)
	}
	// use k8s env vars to find mysql
	dbhost := os.Getenv("MYSQL_SERVICE_HOST")
	dbport := os.Getenv("MYSQL_SERVICE_PORT")
	dburl := "tcp(127.0.0.1:3306)"
	if dbhost != "" {
		dburl = fmt.Sprintf("tcp(%s:%s)", dbhost, dbport)
	}
	dbname := "chess"
	connStr := fmt.Sprintf("%s@%s/%s?charset=utf8&parseTime=True&loc=Local", userPass, dburl, dbname)
	var err error
	db, err = gorm.Open("mysql", connStr)
	if err != nil {
		log.Printf("Error connecting to db %s , try creating", connStr)
		nodbstr := fmt.Sprintf("%s@%s/?charset=utf8&parseTime=True&loc=Local", userPass, dburl)
		nodb, err := gorm.Open("mysql", nodbstr)
		if err != nil {
			panic(err)
		}
		defer nodb.Close()
		if err := nodb.Exec("CREATE DATABASE " + dbname).Error; err != nil {
			panic(err)
		}
		log.Printf("Created new db: %s", dbname)
		db, err = gorm.Open("mysql", connStr)
		if err != nil {
			panic(err)
		}
	}
	db.LogMode(true)
	InitSchema()
}

func InitSchema() {
	// Migrate the schema
	db.AutoMigrate(&Game{})
	db.AutoMigrate(&User{})
	db.AutoMigrate(&Rating{})
}
