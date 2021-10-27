const { pool } = require('../db.config');
const { validationResult } = require('express-validator/check');
const { body } = require('express-validator/check');

// Return all events from EVENTS table
const getAllEvents = (request, response, next) => {
    try {
        pool.query('SELECT * FROM EVENTS').then(results => response.status(200).json(results.rows));
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
            title, description, date_start, date_when, address, venue_name,
            venue_rating, venue_reviews, thumbnail, query_id
        } = request.body;
    
        pool.query(
        `INSERT INTO EVENTS (
            title, description, date_start, date_when, address, venue_name,
            venue_rating, venue_reviews, thumbnail, query_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [title, description, date_start, date_when, address, venue_name, 
            venue_rating, venue_reviews, thumbnail, query_id]
        ).then(response.status(201).json({ status: 'success', message: 'Event created.' }))
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

        pool.query('SELECT * FROM EVENTS WHERE query_id = (SELECT ID FROM QUERY WHERE q = $1 AND loc = $2)', 
        [q_lower, loc_lower])
        .then(results => response.status(200).json(results.rows));
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
            body('date_start', 'date_start is empty').exists(),
            body('date_when', 'date_when is empty').exists(),
            body('address', 'address is empty').exists(),
            body('venue_name', 'venue_name is empty').exists(),
            body('venue_rating', 'venue_rating is empty').exists(),
            body('venue_reviews', 'venue_reviews is empty').exists(),
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
