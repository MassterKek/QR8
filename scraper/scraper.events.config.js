require('dotenv').config()

module.exports = {
    API_KEY: process.env.EVENTS_API_KEY,
    YADDRESS_URL: 'https://www.yaddress.net/api/address',
    ENGINE: 'google_events',
}
