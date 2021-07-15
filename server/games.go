package main

func loadLoginData(user string, data *indexData) {
	var games []Game
	db.Where("white = ? OR black = ?", user, user).Order("created_at DESC").Limit(20).Find(&games)
	data.History = make([]historyGame, len(games))
	for i, game := range games {
		pgn := game.State
		hg := historyGame{White: game.White, Black: game.Black, Time: game.CreatedAt.Unix(), PGN: pgn,
			Outcome: game.Outcome, WhiteElo: game.WhiteElo, BlackElo: game.BlackElo}
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

// Record the game in DB
func (b *Board) recordGame() {
	//do not record empty games
	if len(b.chess.Moves()) == 0 {
		db.Delete(b.game)
		return
	}
	game := b.game
	game.State = b.chess.String()
	game.WhiteClock = b.clock.timeLeft[whiteColor].Milliseconds()
	game.BlackClock = b.clock.timeLeft[blackColor].Milliseconds()
	game.WhiteElo = b.white.Elo(b.game.Mode)
	game.BlackElo = b.black.Elo(b.game.Mode)
	game.Outcome = string(b.chess.Outcome())
	if err := db.Save(game).Error; err != nil {
		panic(err)
	}
}
