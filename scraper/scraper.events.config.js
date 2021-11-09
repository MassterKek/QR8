require('dotenv').config()

module.exports = {
    API_KEY: process.env.EVENTS_API_KEY,
    ENGINE: 'google_events',
}
