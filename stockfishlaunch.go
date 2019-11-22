package main

type stockfishLauncher struct {
	mrChannel chan MoveRequest
	p         *uciEngine
}

func (l *stockfishLauncher) name() string {
	return "stockfish"
}

func (l *stockfishLauncher) launch() {
	l.p.launch(l.name(), nil, "50", l.moveRequest())
}

func (l *stockfishLauncher) moveRequest() chan MoveRequest {
	return l.mrChannel
}
