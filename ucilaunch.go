package main

type UciLauncher interface {
    name() string
    launch()
    moveRequest() chan MoveRequest
}
