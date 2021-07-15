/* based on https://github.com/Uriopass/LCPlay.git */

package main

import (
	"compress/gzip"
	"crypto/rand"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	//	"time"
)

var networksDir = "networks"

var httpClient *http.Client

// HOSTNAME lczeero server URL
const HOSTNAME = "http://testserver.lczero.org"

var curNetID uint = 0

func getExtraParams() map[string]string {
	randToken := -17
	randBytes := make([]byte, 2)
	_, err := rand.Reader.Read(randBytes)
	if err == nil {
		randToken = int(randBytes[0])<<8 | int(randBytes[1])
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
	err := downloadNetwork(httpClient, HOSTNAME, path, sha)
	if err != nil {
		return "", false, err
	}
	return path, true, nil
}

func readNetworkSha() string {
	files, err := ioutil.ReadDir(networksDir)
	if err != nil {
		log.Printf("Can not read dir %v, error %v\n", networksDir, err)
		return ""
	}
	sort.Slice(files, func(i, j int) bool {
		return files[i].ModTime().Unix() < files[j].ModTime().Unix()
	})
	if len(files) > 0 {
		sha := files[0].Name()
		log.Printf("found network sha %v\n", sha)
		return sha
	}
	log.Printf("dir %v is empty\n", networksDir)
	return ""
}

func updateNetwork() (bool, string) {
	ng, err := nextGame(httpClient, HOSTNAME, getExtraParams())
	log.Println(ng, err)
	if err != nil {
		log.Printf("nextGame error %v\n", err)
		return false, ""
	}

	if ng.Type == "train" {
		_, newNet, err := getNetwork(ng.Sha)
		if err != nil {
			log.Printf("getNetwork error %v\n", err)
			return false, ""
		}
		curNetID = ng.NetworkID
		return newNet, ng.Sha
	}
	return false, ""
}

func launchLc0(p *uciEngine, l uciLauncher, sha string) {
	path := filepath.Join(networksDir, sha)
	weights := fmt.Sprintf("--weights=%s", path)
	args := make([]string, 1)
	args[0] = weights
	p.launch(l.name(), args, "50", l.moveRequest())
}

func leelaStart(l uciLauncher) {
	httpClient = &http.Client{}

	go func() {
		var p *uciEngine = nil

		sha := readNetworkSha()
		if sha != "" {
			p = &uciEngine{}
			launchLc0(p, l, sha)
		} else {
			log.Printf("Can not find last local lc0 weights network\n")
		}

		/*
			for {
				new_net, net_sha := updateNetwork()
				log.Printf("updateNetwork: new %v sha '%v'\n", new_net, net_sha)
				if (new_net || p == nil) && net_sha != "" {
					if p != nil {
						mr := MoveRequest{moves: "", bestMove: nil}
						l.moveRequest() <- mr
						p.Input.Close()
					}
					p = &UciEngine{}
					launchLc0(p, l, net_sha)

					//defer *p.Input.Close()
				}
				time.Sleep(12000 * time.Second)
			}
		*/
	}()
}

type nextGameResponse struct {
	Type         string
	TrainingID   uint
	NetworkID    uint
	Sha          string
	CandidateSha string
	Params       string
	Flip         bool
	MatchGameID  uint
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

func nextGame(httpClient *http.Client, hostname string, params map[string]string) (nextGameResponse, error) {
	resp := nextGameResponse{}
	err := postParams(httpClient, hostname+"/next_game", params, &resp)

	if len(resp.Sha) == 0 {
		return resp, errors.New("Server gave back empty SHA")
	}

	return resp, err
}

func downloadNetwork(httpClient *http.Client, hostname string, networkPath string, sha string) error {
	uri := hostname + fmt.Sprintf("/get_network?sha=%s", sha)
	r, err := httpClient.Get(uri)
	if err != nil {
		return err
	}
	defer r.Body.Close()

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
