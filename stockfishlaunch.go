package main

type StockfishLauncher struct {
    mrChannel chan MoveRequest
    p         *UciEngine
}

func (l *StockfishLauncher) name() string {
    return "stockfish"
}

func (l *StockfishLauncher) launch() {
   l.p.launch(l.name(), nil, "50", l.moveRequest())
}

func (l* StockfishLauncher) moveRequest() chan MoveRequest {
    return l.mrChannel
}
