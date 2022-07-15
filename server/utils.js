const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const dateToRelativeTime = (dateString) => {
    const date = new Date(dateString)
    return timeAgo.format(date)
}

const randomIntInRange = (min, max) => Math.floor(
        Math.random() * (max - min) + min
)


module.exports = {
    randomIntInRange,
    dateToRelativeTime
}
