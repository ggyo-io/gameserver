
export function calcPosition(history, browseIndex, game) {
    if (history.length === 0 || browseIndex === 0)
        return "start"

    if (browseIndex === history.length && game.history().length === history.length)
        return game.fen()

    game.reset()
    for (let i = 0; i < browseIndex; i++)
        game.move(history[i])

    return game.fen()
}

