/* based on https://github.com/Uriopass/LCPlay.git */

package main

import (
    "bufio"
    "io"
    "log"
    "os/exec"
    "strings"
)

type MoveRequest struct {
    moves    string
    bestMove chan string
}

type UciEngine struct {
    Name     string
    Cmd      *exec.Cmd
    Input    io.WriteCloser
    replyChannel chan chan string
}

func (c *UciEngine) openInput() {
    var err error
    c.Input, err = c.Cmd.StdinPipe()
    if err != nil {
        log.Fatal(err)
    }
}

/* see https://go101.org/article/channel-closing.html */
func SafeSendString(ch chan string, value string) (closed bool) {
    defer func() {
        if recover() != nil {
            closed = true
        }
    }()

    ch <- value  // panic if ch is closed
    return false // <=> closed = false; return
}

func (c *UciEngine) launch(name string, args []string, playouts string, moveRequest chan MoveRequest) {
    c.Name = name
    c.replyChannel = make(chan chan string, 256)
    path := "./" + name
    c.Cmd = exec.Command(path, args...)

    log.Printf("path '%s' args: %v\n", path, c.Cmd.Args)

    stdout, err := c.Cmd.StdoutPipe()
    if err != nil {
        log.Fatal(err)
    }

    stderr, err := c.Cmd.StderrPipe()
    if err != nil {
        log.Fatal(err)
    }

    go func() {
        stdoutScanner := bufio.NewScanner(stdout)
        for stdoutScanner.Scan() {
            line := stdoutScanner.Text()
            log.Printf("%s stdout '%s'\n", name, line)
            if strings.HasPrefix(line, "bestmove ") {
                replyCh := <-c.replyChannel
                move := strings.Split(line, " ")[1]
                if SafeSendString(replyCh,  move) {
                     log.Printf("%s reply channel was closed for move '%s'\n", name, move);
                }
            }
        }
    }()

    go func() {
        stderrScanner := bufio.NewScanner(stderr)
        for stderrScanner.Scan() {
            log.Printf("%s stderr '%s'\n", name, stderrScanner.Text())
        }
    }()

    c.openInput()

    err = c.Cmd.Start()
    if err != nil {
        log.Fatal(err)
    }

    io.WriteString(c.Input, "uci\n")
    go func() {
        for mr := range moveRequest {
            replyChannel := mr.bestMove
            if (replyChannel == nil) {
                log.Printf("%s Got null reply channel, exiting\n", name)
                break
            }
            c.replyChannel <- replyChannel

            uciCmd := "position startpos"
            if len(mr.moves) > 1 {
                uciCmd += " moves " + mr.moves
            }

            log.Printf("%s is sending UCI cmd: '%s'\n", name, uciCmd)
            io.WriteString(c.Input, uciCmd + " \n")
            log.Printf("%s is sending UCI CMD 'go nodes " + playouts + "'\n", name)
            io.WriteString(c.Input, "go nodes " + playouts + " \n")
        }
        c.Cmd.Process.Kill()
    }()
}
