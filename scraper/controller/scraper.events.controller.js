require('dotenv').config();
const constants = require('../scraper.events.config');
const SerpApi = require('google-search-results-nodejs');
const { selectAllQueries, truncateEvents, insertEvent, selectQuery, selectEventsByKeyword, insertCovidData, truncateCovidData, selectEventsByQueryId } = require('../../database/db.methods');
const { isValidResponse, getValues, getCovidValues, parseAddress, parseCovidRes, parseOrderBy, EVENT_PAGE_STEPS } = require('../scraper.utils');
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
        truncateCovidData();
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
    if (data.search_metadata.status == 'Success') {
        Array.prototype.forEach.call(data.events_results, (event) => {
            if (isValidResponse(event)) {
                const values = getValues(event, query_id);
                insertEvent(values).then((events) => {
                    if (events.rows.length > 0) {
                        const address = parseAddress(values[4]);
                        getExtendedEventInfo(events.rows[0].id, address);
                    }
                }).catch((error) => {
                    console.log(error);
                    console.log("error inserting event");
                });
            }
        });
    } else {
        console.log("error");
    }
};

// Get extended address information for event and get covid data for event using it's zipcode
const getExtendedEventInfo = async (event_id, eventAddress) => {
    axios({
        method: 'get',
        url: constants.YADDRESS_URL,
        params: {'AddressLine1': `${eventAddress[2]}`, 'AddressLine2': `${eventAddress[3]}, ${eventAddress[4]}`},
        headers: {'Accept': 'application/json'}
    }).then((addr_res) => {
        getCovidDataForEvent(event_id, addr_res);
    }).catch((error) => {
        console.log(error.message);
        console.log('failed at getting address');
    });
};

// Get amount of positive covid cases for event zipcode
const getCovidDataForEvent = async (event_id, addr_res) => {
    if (addr_res && addr_res.data) {
        axios({
            method: 'get',
            url: `${constants.COVID_DATA_URL}${addr_res.data.Zip}`,
            headers: {'Accept': 'application/json'}
        }).then((covid_res) => {
            const positive_cases = parseCovidRes(covid_res);
            const values = getCovidValues(addr_res.data, positive_cases, event_id);
            insertCovidData(values);
        }).catch((error) => {
            console.log(error.message);
            console.log('failed at getting covid data');
        })
    }
};

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
    const { q, loc, orderBy } = request.body;
    const q_lower = q.toLowerCase();
    const loc_lower = loc.toLowerCase();
    selectQuery([ q_lower, loc_lower ])
    .then(queries => {
        if (queries.rows.length > 0) {
            const id = queries.rows[0].id;
            const parsedOrderBy = parseOrderBy(orderBy);
            returnExistingEvents(response, id, parsedOrderBy);
        } else {
            response.status(200).json([]);
        }
    }).catch((error) => {
        console.log(error);
        response.status(400).json({ error: error.message });
    });
};

// returns existing events as a list of json objects
const returnExistingEvents = (response, id, orderBy) => {
    selectEventsByQueryId(id, orderBy)
    .then(events => {
        response.status(200).json(events.rows);
    }).catch((error) => {
        console.log(error);
        response.status(400).json({ error: error.message });
    });
};

const validateFetch = (method) => {
    switch (method) {
        case 'findEventsForQuery': {
         return [ 
            body('q', 'q is empty').exists(),
            body('loc', 'loc is empty').exists(),
            body('orderBy', 'orderBy is empty').exists(),
           ]   
        }
    }
};

module.exports = { updateAllSavedQueries, findEventsForQuery, validateFetch };
