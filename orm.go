package main

import (
	"fmt"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var (
	db *gorm.DB
)

func InitDb() {
	var err error
	dbpass := os.Getenv("DB_PASS")
	connStr := "root@/test?charset=utf8&parseTime=True&loc=Local"
	if dbpass != "" {
		connStr = fmt.Sprintf("root:%s@/test?charset=utf8&parseTime=True&loc=Local", dbpass)
	}

	db, err = gorm.Open("mysql", connStr)
	if err != nil {
		println("ERRRR connecting")
		panic(err)
	}
	db.LogMode(true)

	// Migrate the schema
	db.AutoMigrate(&Game{})
	db.AutoMigrate(&User{})
}
