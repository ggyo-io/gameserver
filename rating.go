package main

import "github.com/notnil/chess"
import elogo "github.com/kortemy/elo-go"

func updateScores(whiteID string, blackID string, outcome chess.Outcome, mode string) (elogo.Outcome, elogo.Outcome) {
	whiteRank := getRank(whiteID, mode)
	blackRank := getRank(blackID, mode)
	elo := elogo.NewElo()
	eloScore := 0.5 // draw
	switch outcome {
	case chess.WhiteWon:
		eloScore = 1.0
	case chess.BlackWon:
		eloScore = 0.0
	}
	ow, ob := elo.Outcome(whiteRank, blackRank, eloScore)
	saveScore(whiteID, mode, ow)
	saveScore(blackID, mode, ob)
	return ow, ob

}

func saveScore(playerID string, mode string, outcome elogo.Outcome) {
	if err := db.Save(&Rating{UserID: playerID,
		Mode: mode, Score: outcome.Rating}).Error; err != nil {
		panic(err)
	}
}

func getRank(playerID string, mode string) int {
	var r Rating
	dbout := db.Order("created_at DESC").First(&r, "user_id=? AND mode=?", playerID, mode)
	if dbout.RecordNotFound() || dbout.Error != nil {
		return 1000
	}
	return r.Score
}
