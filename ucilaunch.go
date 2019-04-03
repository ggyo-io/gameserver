package main

import (
	"os"
)

type UciLauncher interface {
	name() string
	launch()
	moveRequest() chan MoveRequest
}

func exePresent(l UciLauncher) bool {
	if _, err := os.Stat(l.name()); os.IsNotExist(err) || err != nil {
		return false
	}
	return true
}
