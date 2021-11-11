require('dotenv').config();
const constants = require('../scraper.events.config');
const SerpApi = require('google-search-results-nodejs');
const { selectAllQueries, truncateEvents, insertEvent, selectQuery, selectEventsByQueryId, insertQuery, insertCovidData } = require('../../database/db.methods');
const { isValidResponse, getValues, getCovidValues, parseAddress } = require('../scraper.utils');
const { validationResult } = require('express-validator');
const { body } = require('express-validator');
const axios = require('axios');

/* IMPORTANT
 * Fetch events for every saved query using Google Events Search API
 * This endpoint is used manually by calling it from curl or postman
 * Used to populate DB with events data
*/
const updateAllSavedQueries = (request, response, next) => {
    selectAllQueries()
    .then(results => {
        const search = new SerpApi.GoogleSearch(process.env.EVENTS_API_KEY);
        truncateEvents();
        Array.prototype.forEach.call(results.rows, (query) => {
            const params = {
                'q': query.q,
                'location': query.loc,
                'engine': constants.ENGINE,
            };
            search.json(params, (data) => searchAllCallback(data, query.id));
        });
        response.status(200).json({ status: 'success', message: 'events fetched' });
    }).catch((error) => {
        response.status(400).json({ error: error.message });
    });
};

// Saves every received event for scecific query_id in database
const searchAllCallback = function(data, query_id) {
    try {
        if (data.search_metadata.status == 'Success') {
            Array.prototype.forEach.call(data.events_results, (event) => {
                if (isValidResponse(event)) {
                    const values = getValues(event, query_id);
                    insertEvent(values).then((events) => {
                        if (events.rows.length > 0) {
                            const address = parseAddress(values[4]);
                            getCovidDataForEvent(events.rows[0].id, address);
                        }
                    });
                }
            });
        }
    } catch (error) {
        throw error;
    };
};

// Get extended address information for event and get covid data for event using it's zipcode
const getCovidDataForEvent = async (event_id, eventAddress) => {
    axios({
        method: 'get',
        url: constants.YADDRESS_URL,
        params: {'AddressLine1': `${eventAddress[0]}`, 'AddressLine2': `${eventAddress[1]}, ${eventAddress[2]}`},
        headers: {'Accept': 'application/json'}
    }).then((res) => {
        if (res && res.data) {
            const values = getCovidValues(res.data, 10, event_id);
            insertCovidData(values);
        }
    }).catch((error) => {
        console.log(error.message);
    })
}

/* IMPORTANT
 * Return events for the query provided by the user 
 * Requires 2 string parameters: q (query, such as "halloween"), loc (location, such as "boston, ma")
 * This endpoint should be used by the front end to get events for users query
 * Checks if database already contains results for specific q and loc
 * If it does, simply returns those events as a list of json objects
 * If not, save new query, fetch events for this query from API, save events, return events
*/
const findEventsForQuery = (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(422).json({ errors: errors.array() });
        return;
    }
    const { q, loc } = request.body;
    const q_lower = q.toLowerCase();
    const loc_lower = loc.toLowerCase();
    selectQuery([ q_lower, loc_lower ])
    .then(queries => {
        if (queries.rows.length > 0) {
            const query_id = queries.rows[0].id;
            returnExistingEvents(response, query_id);
        } else {
            response.status(200).json([]);
            //fetchAndReturnNewEvents(response, q_lower, loc);
        }
    }).catch((error) => {
        console.log(error);
        response.status(400).json({ error: error.message });
    });
};

// returns existing events as a list of json objects
const returnExistingEvents = (response, query_id) => {
    selectEventsByQueryId([ query_id ])
    .then(events => {
        response.status(200).json(events.rows);
    }).catch((error) => {
        console.log(error);
        response.status(400).json({ error: error.message });
    });
};

// save new query, fetch events for this query from API
const fetchAndReturnNewEvents = (response, q, loc) => {
    insertQuery([ q, loc ])
    .then((result) => {
        // select query
        selectQuery([ q, loc ])
        .then((new_queries) => {
            // use search to fetch data
            const search = new SerpApi.GoogleSearch(process.env.EVENTS_API_KEY);
            const query_id = new_queries.rows[0].id;
            // use callback to save events
            const params = {
                'q': q,
                'location': loc,
                'engine': constants.ENGINE,
            };
            try {
                search.json(params, (data) => searchOneCallback(data, response, query_id));
            } catch (error) {
                response.status(400).json({ error: error.message });
            }
        });
    });
}

// save new events, return new events
const searchOneCallback = function(data, response, query_id) {
    try {
        if (data.search_metadata.status == 'Success') {
            Array.prototype.forEach.call(data.events_results, (event) => {
                if (isValidResponse(event)) {
                    const values = getValues(event, query_id);
                    insertEvent(values);
                }
            });
            // return new events
            selectEventsByQueryId([ query_id ])
            .then(events => {
                response.status(200).json(events.rows);
            }).catch((error) => {
                console.log(error);
                response.status(400).json({ error: error.message });
            });
        } else {
            response.status(400).json({ error: "error searching for events" });
        }
    } catch (error) {
        throw error;
    }
};

const validateFetch = (method) => {
    switch (method) {
        case 'findEventsForQuery': {
         return [ 
            body('q', 'q is empty').exists(),
            body('loc', 'loc is empty').exists(),
           ]   
        }
    }
};

module.exports = { updateAllSavedQueries, findEventsForQuery, validateFetch };
