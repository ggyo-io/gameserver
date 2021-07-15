package main

import (
	"os"
)

type uciLauncher interface {
	name() string
	launch()
	moveRequest() chan MoveRequest
}

func exePresent(l uciLauncher) bool {
	if _, err := os.Stat(l.name()); os.IsNotExist(err) || err != nil {
		return false
	}
	return true
}
