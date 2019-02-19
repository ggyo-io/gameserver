package main


type LeelaLauncher struct {
    mrChannel chan MoveRequest
}

func (l *LeelaLauncher) name() string {
    return "lc0"
}

func (l *LeelaLauncher) launch() {
   leelaStart(l)
}

func (l* LeelaLauncher) moveRequest() chan MoveRequest {
    return l.mrChannel
}
