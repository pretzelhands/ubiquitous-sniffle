const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const dateToRelativeTime = (dateString) => {
    // Z (Zulu) ensures that JavaScript is aware of this being a UTC time.
    // SQLite datetimes come without a timezone marker, which is
    // interpreted by JS as this being server local time, which may differ.
    const date = new Date(`${dateString}Z`)
    return timeAgo.format(date)
}

const randomIntInRange = (min, max) => Math.floor(
        Math.random() * (max - min) + min
)


module.exports = {
    randomIntInRange,
    dateToRelativeTime
}
