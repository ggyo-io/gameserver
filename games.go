package main

func loadLoginData(user string, data *indexData) {
	var games []Game
	db.Where("white = ? OR black = ?", user, user).Order("created_at DESC").Limit(20).Find(&games)
	data.History = make([]historyGame, len(games))
	for i, game := range games {
		url := "?game=" + game.ID
		hg := historyGame{White: game.White, Black: game.Black, Time: game.CreatedAt.Unix(), URL: url,
			Outcome: game.Outcome, WhiteElo:game.WhiteElo, BlackElo:game.BlackElo}
		data.History[i] = hg
	}
}

func findGame(id string) *Game {
	if id == "" {
		return nil
	}
	var game Game
	if db.Where("id = ?", id).First(&game).RecordNotFound() {
		return nil
	}
	return &game
}


