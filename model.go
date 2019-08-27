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

type Game struct {
	Model
	State  string `sql:"size:4096"`
	Active bool
	White  string
	Black  string
	Mode   string
}

type User struct {
	Model
	Name     string `sql:"index"`
	Password string
}

type Rating struct {
	Model
	UserID	string `sql:"index:idx_uid_mode"`
	Mode 	string `sql:"index:idx_uid_mode"`
	Score   int
}

func (model *Model) BeforeCreate(scope *gorm.Scope) error {
	id := uuid.NewV4()
	return scope.SetColumn("ID", Str(id))
}

func Str(u uuid.UUID) string {
	buf := make([]byte, 32)
	hex.Encode(buf[0:32], u[0:16])
	return string(buf)
}
