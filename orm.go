package main

import (
	"encoding/json"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var (
	db *gorm.DB
)

func InitDb() {
	var err error
	db, err = gorm.Open("mysql", "root:@/test?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		println("ERRRR connecting")
		panic(err)
	}
	db.LogMode(true)

	// Migrate the schema
	db.AutoMigrate(&Recipe{})
	db.AutoMigrate(&Ingridient{})

	// Init some data
	// Create
	var r1 Recipe
	db.FirstOrCreate(&r1, Recipe{Name: "Steak", Description: "Fillet Mignion"})
	var r2 Recipe
	db.FirstOrCreate(&r2, Recipe{Name: "Noodles", Description: "Pad Thai"})

	var rs []Recipe
	db.Find(&rs)
	json.NewEncoder(os.Stdout).Encode(rs)

	// Delete - delete product
	//db.Delete(&product)
}
