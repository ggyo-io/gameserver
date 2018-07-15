package main

import (
	"encoding/hex"
	"time"

	"github.com/jinzhu/gorm"
	uuid "github.com/satori/go.uuid"
)

type Model struct {
	ID        string `sql:"primary_key; type:varchar(32)"`
	CreatedAt time.Time
	UpdatedAt time.Time
	//DeletedAt *time.Time `sql:"index"`
}

type Recipe struct {
	Model
	Name        string `sql:"index"`
	Description string
}

type Ingridient struct {
	Model
	Name string `sql:"index"`
}

func (model *Model) BeforeCreate(scope *gorm.Scope) error {
	return scope.SetColumn("ID", Str(uuid.NewV4()))
}

func Str(u uuid.UUID) string {
	buf := make([]byte, 32)
	hex.Encode(buf[0:32], u[0:16])
	return string(buf)
}