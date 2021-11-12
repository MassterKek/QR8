require('dotenv').config()

module.exports = {
    API_KEY: process.env.EVENTS_API_KEY,
    YADDRESS_URL: 'https://www.yaddress.net/api/address',
    COVID_DATA_URL: 'https://localcoviddata.com/covid19/v1/locations?zipCode=',
    ENGINE: 'google_events',
    EVENT_RESULTS: 20,
}
