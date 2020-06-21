import {wsSend} from '../components/ws/ws'

export const playClick = (routerHistory, update, opponent, colorPreference, timeControl) => {
    console.log("Play click")
    if (opponent === 'random') {
        let color = colorPreference
        if (color === 'any') {
            color =  Math.random() > 0.5 ? "white" : "black"
        }
        update({myColor: color})
        routerHistory.push('/random')
    } else {
        wsSend({
            Cmd: "start",
            Params: opponent,
            Color: colorPreference,
            TimeControl: timeControl.seconds.toString() + '+' +
                timeControl.increment.toString()
        });
        update({match: true})
        routerHistory.push('/playboard')
    }
}