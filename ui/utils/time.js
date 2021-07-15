export const adjustTime = (t) => Math.floor(t/1000)

// mm:ss
export const timeMin = (t) =>
    t <= 0 ?"00:00" : Math.floor(adjustTime(t) / 60) + ":" + ('0' + adjustTime(t) % 60).substr(-2)

export const clock2millis = (c) => {
    const a = c.split(':')
    let multiplier = 1
    let secs = 0
    let digit
    while (digit = a.pop()) {
        secs += parseInt(digit) * multiplier
        multiplier *= 60
    }
    return secs * 1000
}
