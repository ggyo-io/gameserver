import {wsSend} from '../components/ws/ws'

export const playClick = (navigate, update, newGame, opponent, colorPreference, timeControl) => {
    console.log("Play click")
    if (opponent === 'random') {
        let color = colorPreference
        if (color === 'any') {
            color =  Math.random() > 0.5 ? "white" : "black"
        }
        newGame({
            Color: color,
            BlackElo: 1,
            WhiteElo: 1300,
            WhiteClock: timeControl.seconds * 1000,
            BlackClock: timeControl.seconds * 1000,
        })
        navigate('/random')
    } else {
        wsSend({
            Cmd: "start",
            Params: opponent,
            Color: colorPreference,
            TimeControl: timeControl.seconds.toString() + '+' +
                timeControl.increment.toString()
        });
        update({match: true})
        navigate('/playboard')
    }
}
