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
    return pool.query('SELECT * FROM EVENTS LEFT JOIN COVID_DATA ON EVENTS.id = COVID_DATA.event_id');
}

const insertEvent = (values) => {
    return pool.query(`INSERT INTO EVENTS (
        title, description, date_start, date_when, address, venue_name,
        venue_rating, venue_reviews, thumbnail, query_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, values);
}

const selectEvent = (values) => {
    return pool.query('SELECT * FROM EVENTS WHERE query_id = (SELECT ID FROM QUERY WHERE q = $1 AND loc = $2)', values);
}

const selectEventByTitle = (title) => {
    return pool.query(`SELECT * FROM EVENTS WHERE title LIKE %${title}% OR description LIKE `)
}


const selectEventsByQueryId = (id, orderBy) => {
    return pool.query(`SELECT * FROM EVENTS e LEFT JOIN COVID_DATA c ON e.id = c.event_id WHERE e.query_id = ${id} ORDER BY ${orderBy} ASC`);
}


const selectEventsByKeyword = (title, orderBy) => {
    return pool.query(`SELECT * FROM EVENTS e LEFT JOIN COVID_DATA c ON e.id = c.event_id WHERE e.title LIKE '%${title}%' OR e.description LIKE '%${title}%' ORDER BY ${orderBy} ASC`);
}

const truncateCovidData = () => {
    return pool.query('TRUNCATE COVID_DATA CASCADE');
}

const truncateEvents = () => {
    return pool.query('TRUNCATE EVENTS CASCADE');
}

const insertCovidData = (values) => {
    return pool.query(`INSERT INTO COVID_DATA (
        address_line_one, address_line_two, zip, zip4, city, state,
        covid_cases, event_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`, values);
}

module.exports = { selectEventsByQueryId, selectAllQueries, selectQuery, insertQuery, deleteQuery, selectAllEvents, insertEvent, selectEvent, selectEventsByKeyword, truncateEvents, insertCovidData, truncateCovidData };
