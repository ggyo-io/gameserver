package main

type leelaLauncher struct {
	mrChannel chan MoveRequest
}

func (l *leelaLauncher) name() string {
	return "lc0"
}

func (l *leelaLauncher) launch() {
	leelaStart(l)
}

func (l *leelaLauncher) moveRequest() chan MoveRequest {
	return l.mrChannel
}
