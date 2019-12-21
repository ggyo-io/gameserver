package main

import (
	"encoding/hex"
	"time"

	"github.com/jinzhu/gorm"
	uuid "github.com/satori/go.uuid"
)

// Model is the base ORM entity
type Model struct {
	ID        string `sql:"primary_key; type:varchar(32)"`
	CreatedAt time.Time
	UpdatedAt time.Time
	//DeletedAt *time.Time `sql:"index"`
}

// Game represents an active or past chess game
type Game struct {
	Model
	State      string `sql:"size:4096"`
	Active     bool
	White      string
	Black      string
	Mode       string
	WhiteClock int64
	BlackClock int64
}

// User represents authenticated web ui users
type User struct {
	Model
	Name     string `sql:"index"`
	Email    string `sql:"index"`
	Password string
}

// Rating for ELO
type Rating struct {
	Model
	UserID string `sql:"index:idx_uid_mode"`
	Mode   string `sql:"index:idx_uid_mode"`
	Score  int
}

// BeforeCreate is a hook function called by gorm
func (model *Model) BeforeCreate(scope *gorm.Scope) error {
	id := uuid.NewV4()
	return scope.SetColumn("ID", str(id))
}

func str(u uuid.UUID) string {
	buf := make([]byte, 32)
	hex.Encode(buf[0:32], u[0:16])
	return string(buf)
}
