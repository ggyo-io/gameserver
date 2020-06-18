package main

import (
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"
)

// timeControl is measured in seconds
type timeControl struct {
	time, increment int64
}

func (t *timeControl) String() string {
	return fmt.Sprintf("%d+%d", t.time, t.increment)
}

func newTimeControl(tc string) timeControl {
	t := timeControl{}
	a := strings.Split(tc, "+")

	t.time, _ = strconv.ParseInt(a[0], 10, 64)
	t.increment, _ = strconv.ParseInt(a[1], 10, 64)

	return t
}

const (
	whiteColor   = iota
	blackColor   = iota
	numOfPlayers = iota
)

type chessClock struct {
	timeLeft      [numOfPlayers]time.Duration
	increment     [numOfPlayers]time.Duration
	flag          *reusableTimer
	flagReason    string
	player        int
	lastMoveStart time.Time
	tc            timeControl
}

func (c *chessClock) String() string {
	return fmt.Sprintf("%v:%v %v (%v)", c.timeLeft[whiteColor], c.timeLeft[blackColor], playerColor(c.player), c.lastMoveStart)
}

func playerColor(p int) string {
	color := "White"
	if p == blackColor {
		color = "Black"
	}
	return color
}

func (c *chessClock) getClock(p int) int64 {
	r := c.timeLeft[c.player]
	if p == c.player {
		now := time.Now()
		r -= now.Sub(c.lastMoveStart)
	}
	return r.Milliseconds()

}
func (c *chessClock) onMove(numMoves int) time.Duration {
	now := time.Now()
	log.Printf("chessClock start onMove move %v clock %v now %v\n", numMoves, c, now)

	if numMoves >= 3 {
		c.timeLeft[c.player] -= now.Sub(c.lastMoveStart)
		c.timeLeft[c.player] += c.increment[c.player]
	}
	c.lastMoveStart = now

	nextPlayer := (c.player + 1) % numOfPlayers

	if numMoves >= 2 {
		c.flag.Reset(c.timeLeft[nextPlayer])
		c.flagReason = playerColor(nextPlayer) + " flag is down"
	} else { //} < 2
		// first two moves has to be done within 30 secs
		c.firstMoveFlag(nextPlayer)
	}
	d := c.timeLeft[c.player]
	c.player = nextPlayer
	log.Printf("chessClock end onMove move %v clock %v, lastClock %v\n", numMoves, c, d)
	return d
}

func (c *chessClock) firstMoveFlag(p int) {
	log.Printf("chessClock firstMoveFlag for player %v now %v\n", playerColor(p), time.Now())
	c.flag.Reset(30 * time.Second)
	c.flagReason = playerColor(p) + " first move timeout"
}

func newChessClock(tc *timeControl) *chessClock {
	cc := chessClock{}
	cc.timeLeft[whiteColor] = time.Second * time.Duration(tc.time)
	cc.timeLeft[blackColor] = cc.timeLeft[whiteColor]
	cc.increment[whiteColor] = time.Second * time.Duration(tc.increment)
	cc.increment[blackColor] = time.Second * time.Duration(tc.increment)
	cc.tc = *tc

	cc.player = whiteColor
	cc.flag = newReusableTimer()

	return &cc
}
