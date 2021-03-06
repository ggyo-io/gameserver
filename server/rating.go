package main

import (
	"errors"
	"github.com/notnil/chess"
	"github.com/kortemy/elo-go"
	"log"
)

const InitialScore = 1000

func updateScores(whiteID string, blackID string, outcome chess.Outcome, mode string) (*elogo.Outcome, *elogo.Outcome) {
	whiteRank, e1 := getRank(whiteID, mode)
	blackRank, e2 := getRank(blackID, mode)
	if e1 != nil || e2 != nil {
		log.Print("ERROR reading player's score", e1, e2)
		return &elogo.Outcome{Rating: whiteRank.Score}, &elogo.Outcome{Rating: blackRank.Score}
	}
	elo := elogo.NewElo()
	eloScore := 0.5 // draw
	switch outcome {
	case chess.WhiteWon:
		eloScore = 1.0
	case chess.BlackWon:
		eloScore = 0.0
	}
	ow, ob := elo.Outcome(whiteRank.Score, blackRank.Score, eloScore)
	whiteRank.Score = ow.Rating
	blackRank.Score = ob.Rating
	if err := db.Save(whiteRank).Error; err != nil {
		log.Print("ERROR saving white rank", err)
	}
	if err := db.Save(blackRank).Error; err != nil {
		log.Print("ERROR saving black rank", err)
	}
	return &ow, &ob

}

func getRank(playerID string, mode string) (*Rating, error) {
	r := &Rating{Score: InitialScore, UserID: playerID, Mode: mode}
	if playerID == "" {
		return r, errors.New("NO_SCORE player id is empty")
	}
	dbout := db.Order("created_at DESC").First(&r, "user_id=? AND mode=?", playerID, mode)
	if dbout.RecordNotFound() {
		return r, nil
	}
	return r, dbout.Error
}

func getRanks(playerID string) []Rating {
	var ranks []Rating
	if playerID == "" {
		return ranks
	}
	db.Order("updated_at DESC").Where("user_id=?", playerID).Find(&ranks)
	return ranks
}
