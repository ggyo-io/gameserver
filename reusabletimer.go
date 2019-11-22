package main

import (
	"time"
)

type reusableTimer struct {
	timer  *time.Timer
	active bool
}

func (t *reusableTimer) Stop() {
	if t.active == true {
		if !t.timer.Stop() {
			<-t.timer.C
		}
		t.active = false
	}
}

func (t *reusableTimer) Reset(d time.Duration) {
	t.Stop()
	t.timer.Reset(d)
	t.active = true
}

func newReusableTimer() *reusableTimer {
	t := reusableTimer{timer: time.NewTimer(time.Hour), active: true}
	t.Stop()
	return &t
}
