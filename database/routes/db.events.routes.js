const express = require('express');
const router = express.Router();

const { getAllEvents, createEvent, findEvent, validateEvent } = require('../controller/events.controller');

// Get all saved events
router.get('/all', async (req, res, next) => {
    await getAllEvents(req, res, next);
});

// Create new event with all event values passed in request 
router.post('/new',  validateEvent('createEvent'), async (req, res, next) => {
    await createEvent(req, res, next);
});

// Get a list of events for a query (given q and loc of a query)
router.get('/find', validateEvent('findEvent'), async (req, res, next) => {
    await findEvent(req, res, next);
});

module.exports = router;
