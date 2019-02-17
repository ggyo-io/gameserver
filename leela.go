/* based on https://github.com/Uriopass/LCPlay.git */

package main

import (
    "bufio"
    "fmt"
    "io"
    "log"
    "net/http"
    "os"
    "sort"
    "os/exec"
    "path/filepath"
    "strings"
    "time"
    "strconv"
    "net/url"
    "io/ioutil"
    "errors"
    "compress/gzip"
    "encoding/json"
    "crypto/rand"
)

var networksDir = "networks"

type MoveRequest struct {
    pgn      string
    bestMove chan string
}

var httpClient *http.Client
var HOSTNAME = "http://testserver.lczero.org"

type CmdWrapper struct {
    Cmd      *exec.Cmd
    Pgn      string
    Input    io.WriteCloser
    replyChannel chan chan string
}

func (c *CmdWrapper) openInput() {
    var err error
    c.Input, err = c.Cmd.StdinPipe()
    if err != nil {
        log.Fatal(err)
    }
}

var curNetId uint = 0

func (c *CmdWrapper) launch(networkPath string, args []string, playouts string, moveRequest chan MoveRequest) {
    c.replyChannel = make(chan chan string, 256)
    weights := fmt.Sprintf("--weights=%s", networkPath)
    c.Cmd = exec.Command("./lc0", weights)
    c.Cmd.Args = append(c.Cmd.Args, args...)

    log.Printf("Args: %v\n", c.Cmd.Args)

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
            log.Printf("leela[%v] '%s'\n", playouts, line)
            if strings.HasPrefix(line, "bestmove ") {
                replyCh := <-c.replyChannel
                replyCh <- strings.Split(line, " ")[1]
            }
        }
    }()

    go func() {
        stderrScanner := bufio.NewScanner(stderr)
        for stderrScanner.Scan() {
            log.Printf("%s\n", stderrScanner.Text())
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
                log.Printf("Got null reply channel, exiting\n")
                break
            }
            c.replyChannel <- replyChannel

            uciCmd := "position startpos"
            if len(mr.pgn) > 1 {
                uciCmd += " moves " + mr.pgn
            }

            log.Printf("Sending UCI cmd: '%s'\n", uciCmd)
            io.WriteString(c.Input, uciCmd + " \n")
            log.Println("go nodes " + playouts)
            io.WriteString(c.Input, "go nodes " + playouts + " \n")
        }
        c.Cmd.Process.Kill()
    }()
}

func getExtraParams() map[string]string {
    randToken := -17
    randBytes := make([]byte, 2)
    _, err := rand.Reader.Read(randBytes)
    if err == nil {
        randToken = int(randBytes[0]) << 8 | int(randBytes[1])
    }
    return map[string]string{
        "user":     "iwontupload",
        "password": "hunter2",
        "version":  "22",
        "token":    strconv.Itoa(randToken),
    }
}

func getNetwork(sha string) (string, bool, error) {
    // Sha already exists?
    path := filepath.Join(networksDir, sha)
    if stat, err := os.Stat(path); err == nil {
        if stat.Size() != 0 {
            return path, false, nil
        }
    }
    os.MkdirAll(networksDir, os.ModePerm)

    fmt.Printf("Downloading network...\n")
    // Otherwise, let's download it
    err := DownloadNetwork(httpClient, HOSTNAME, path, sha)
    if err != nil {
        return "", false, err
    }
    return path, true, nil
}

func readNetworkSha() string {
    files, err := ioutil.ReadDir(networksDir)
    if (err != nil) {
        log.Printf("Can not read dir %v, error %v\n", networksDir, err)
        return ""
    }
    sort.Slice(files, func(i,j int) bool {
        return files[i].ModTime().Unix() < files[j].ModTime().Unix()
    })
    if (len(files) > 0) {
       sha := files[0].Name()
       log.Printf("found network sha %v\n", sha)
       return sha
    }
    log.Printf("dir %v is empty\n", networksDir)
    return ""
}

func updateNetwork() (bool, string) {
    nextGame, err := NextGame(httpClient, HOSTNAME, getExtraParams())
    log.Println(nextGame, err)
    if err != nil {
        log.Printf("NextGame error %v\n", err)
        return false, ""
    }

    if nextGame.Type == "train" {
        networkPath, newNet, err := getNetwork(nextGame.Sha)
        if err != nil {
            log.Printf("getNetwork error %v\n", err)
            return false, ""
        }
        curNetId = nextGame.NetworkId
        return newNet, networkPath
    }
    return false, ""
}

func leelaStart(moveRequest chan MoveRequest) {
    httpClient = &http.Client{}

    go func() {
        var p *CmdWrapper = nil

        sha := readNetworkSha()
        if sha != "" {
            path := filepath.Join(networksDir, sha)
            p = &CmdWrapper{}
            p.launch(path, nil, "50", moveRequest)
        } else {
            log.Printf("Can not find last local lc0 weights network\n")
        }

        for {
            new_net, net_name := updateNetwork()
            log.Printf("updateNetwork: new_net %v net_name %v\n", new_net, net_name)
            if (new_net || p == nil) && net_name != "" {
                if p != nil {
                    mr := MoveRequest{pgn: "", bestMove: nil}
                    moveRequest <- mr
                }
                p = &CmdWrapper{}
                p.launch(net_name, nil, "50", moveRequest)

                defer p.Input.Close()
            }
            time.Sleep(12000 * time.Second)
        }
    }()
}

type NextGameResponse struct {
    Type         string
    TrainingId   uint
    NetworkId    uint
    Sha          string
    CandidateSha string
    Params       string
    Flip         bool
    MatchGameId  uint
}

func postParams(httpClient *http.Client, uri string, data map[string]string, target interface{}) error {
    var encoded string
    if data != nil {
        values := url.Values{}
        for key, val := range data {
            values.Set(key, val)
        }
        encoded = values.Encode()
    }
    r, err := httpClient.Post(uri, "application/x-www-form-urlencoded", strings.NewReader(encoded))
    if err != nil {
        return err
    }
    defer r.Body.Close()
    b, _ := ioutil.ReadAll(r.Body)
    if target != nil {
        err = json.Unmarshal(b, target)
        if err != nil {
            log.Printf("Bad JSON from %s -- %s\n", uri, string(b))
        }
    }
    return err
}

func NextGame(httpClient *http.Client, hostname string, params map[string]string) (NextGameResponse, error) {
    resp := NextGameResponse{}
    err := postParams(httpClient, hostname+"/next_game", params, &resp)

    if len(resp.Sha) == 0 {
        return resp, errors.New("Server gave back empty SHA")
    }

    return resp, err
}

func DownloadNetwork(httpClient *http.Client, hostname string, networkPath string, sha string) error {
    uri := hostname + fmt.Sprintf("/get_network?sha=%s", sha)
    r, err := httpClient.Get(uri)
    defer r.Body.Close()
    if err != nil {
        return err
    }

    out, err := os.Create(networkPath)
    defer out.Close()
    if err != nil {
        return err
    }

    // Copy while decompressing
    zr, err := gzip.NewReader(r.Body)
    if err != nil {
        log.Fatal(err)
    }

    _, err = io.Copy(out, zr)
    return err
}
