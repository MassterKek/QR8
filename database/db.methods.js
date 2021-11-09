const { pool } = require('./db.config');

// PostgreSQL Queries for QUERY table
const selectAllQueries = () => {
    return pool.query('SELECT * FROM QUERY');
}

const selectQuery = (values) => {
    return pool.query('SELECT * FROM QUERY WHERE q = $1 AND loc = $2', values);
};

const insertQuery = (values) => {
    return pool.query('INSERT INTO QUERY (q, loc) VALUES ($1, $2)', values)
}

const deleteQuery = (values) => {
    return pool.query('DELETE FROM QUERY WHERE id = $1', values);
}
// PostgreSQL Queries for EVENTS table
const selectAllEvents = () => {
    return pool.query('SELECT * FROM EVENTS');
}

const insertEvent = (values) => {
    return pool.query(`INSERT INTO EVENTS (
        title, description, date_start, date_when, address, venue_name,
        venue_rating, venue_reviews, thumbnail, query_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, values);
}

const selectEvent = (values) => {
    return pool.query('SELECT * FROM EVENTS WHERE query_id = (SELECT ID FROM QUERY WHERE q = $1 AND loc = $2)', values);
}

const selectEventsByQueryId = (values) => {
    return pool.query('SELECT * FROM EVENTS WHERE query_id = $1', values);
}

const truncateEvents = () => {
    return pool.query('TRUNCATE EVENTS');
}

module.exports = { selectAllQueries, selectQuery, insertQuery, deleteQuery, selectAllEvents, insertEvent, selectEvent, selectEventsByQueryId, truncateEvents };
