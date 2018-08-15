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
	Name        string `sql:"index"`
	Description string
	GameModel   string
}

type Player struct {
	Model
	Name        string `sql:"index"`
	PlayerModel string
}

type User struct {
	Model
	Name string `sql:"index"`
}

func (model *Model) BeforeCreate(scope *gorm.Scope) error {
	uuid, _ := uuid.NewV4();
	return scope.SetColumn("ID", Str(uuid))
}

func Str(u uuid.UUID) string {
	buf := make([]byte, 32)
	hex.Encode(buf[0:32], u[0:16])
	return string(buf)
}
