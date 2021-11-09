const express = require("express");
const router = express.Router();

const { updateAllSavedQueries, findEventsForQuery, validateFetch } = require('../controller/scraper.events.controller');

/* Fetch events data from the API
 * IMPORTANT:
 * 1. Deletes all existing events
 * 2. Makes an api call for every query present in QUERY table
 * 3. Fetched data is cached by API for 1 hr and while cached doesn't affect rate limit
*/
router.post('/fetch_all', async (req, res, next) => {
    updateAllSavedQueries(req, res, next);
});

/* Fetch single event data from the API
 * Does not delete existing events
 * Requires q and loc request parameters
*/
router.post('/fetch_one', validateFetch('findEventsForQuery'), async (req, res, next) => {
    findEventsForQuery(req, res, next);
});

module.exports = router;
