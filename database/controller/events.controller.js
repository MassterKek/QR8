const { selectAllEvents, insertEvent, selectEvent } = require('../db.methods');
const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const { parseDate } = require('../../scraper/scraper.utils');

// Return all events from EVENTS table
const getAllEvents = (request, response, next) => {
    try {
        selectAllEvents().then(results => response.status(200).json(results.rows));
    } catch (error) {
        return next(error);
    }
}

// Create new event with all values given
const createEvent = (request, response, next) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(422).json({ errors: errors.array() });
            return;
        }
        const { 
            title, description, date, address, venue, thumbnail, query_id
        } = request.body;
        const values = [title, description, parseDate(date.start_date), date.when, `${address[0]}, ${address[1]}`, venue.name, 
            venue.rating, venue.reviews, thumbnail, query_id];
        insertEvent(values).then(results => response.status(200).json(results.rows))
    } catch (error) {
        return next(error);
    }
}

// Return all events from EVENTS table with matching q and loc of a query
const findEvent = (request, response, next) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.status(422).json({ errors: errors.array() });
            return;
        }
        const { q, loc } = request.body;
        const q_lower = q.toLowerCase();
        const loc_lower = loc.toLowerCase();
        selectEvent([q_lower, loc_lower]).then(results => response.status(200).json(results.rows));
    } catch (error) {
        return next(error);
    }
}

const validateEvent = (method) => {
    switch (method) {
        case 'createEvent': {
         return [ 
            body('title', 'title is empty').exists(),
            body('description', 'description is empty').exists(),
            body('date', 'date is empty').exists(),
            body('date.start_date', 'date start is empty').exists(),
            body('date.when', 'date when is empty').exists(),
            body('address', 'address is empty').exists(),
            body('venue', 'venue is empty').exists(),
            body('venue.name', 'venue name is empty').exists(),
            body('venue.rating', 'venue rating is empty').exists(),
            body('venue.reviews', 'venue reviews is empty').exists(),
            body('thumbnail', 'thumbnail is empty').exists(),
            body('query_id', 'query_id is empty').exists(),
           ]   
        }
        case 'findEvent': {
         return [ 
            body('q', 'q is empty').exists(),
            body('loc', 'loc is empty').exists(),
           ]   
        }
    }
}

module.exports = { getAllEvents, createEvent, findEvent, validateEvent }
