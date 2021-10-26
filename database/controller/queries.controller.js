const { pool } = require('../db.config')

// Return all queries from QUERY table
const getAllQueries = (request, response) => {
    pool.query(
      'SELECT * FROM QUERY', 
      (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

// Return all queries from QUERY table with matching q and loc
const findQuery = (request, response) => {
  const { q, loc } = request.body

  const q_lower = q.toLowerCase()
  const loc_lower = loc.toLowerCase()

  pool.query(
    'SELECT * FROM QUERY WHERE q = $1 AND loc = $2',
    [q_lower, loc_lower],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows[0])
    }
  )
}

// Create new query with given q and loc
const createQuery = (request, response) => {
    const { q, loc } = request.body

    const q_lower = q.toLowerCase()
    const loc_lower = loc.toLowerCase()
  
    pool.query(
    'INSERT INTO QUERY (q, loc) VALUES ($1, $2)',
    [q_lower, loc_lower],
    (error) => {
      if (error) {
        throw error
      }
      response.status(201).json({ status: 'success', message: 'Query created.' })
    }
  )
}

// Delete query by id
const deleteQueryById = (request, response) => {
  const { id } = request.body
  pool.query(
    'DELETE FROM QUERY WHERE id = $1',
    [id],
    (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json({ status: 'success', message: 'Query deleted.' })
  })
}

module.exports = { getAllQueries, createQuery, findQuery, deleteQueryById }
