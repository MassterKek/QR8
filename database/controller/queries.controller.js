const { pool } = require('../db.config');
const { validationResult } = require('express-validator/check');
const { body } = require('express-validator/check');

// Return all queries from QUERY table
const getAllQueries = (request, response, next) => {
    try {
      pool.query('SELECT * FROM QUERY').then(results => response.status(200).json(results.rows));
    } catch (error) {
      return next(error);
    }
}

// Return all queries from QUERY table with matching q and loc
const findQuery = (request, response, next) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(422).json({ errors: errors.array() });
        return;
    }
    
    const { q, loc } = request.body;
    const q_lower = q.toLowerCase();
    const loc_lower = loc.toLowerCase();

    pool.query('SELECT * FROM QUERY WHERE q = $1 AND loc = $2',[q_lower, loc_lower])
    .then(results => response.status(200).json(results.rows[0]));
  } catch (error) {
    return next(error);
  }
  
}

// Create new query with given q and loc
const createQuery = (request, response, next) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(422).json({ errors: errors.array() });
        return;
    }

    const { q, loc } = request.body;
    const q_lower = q.toLowerCase();
    const loc_lower = loc.toLowerCase();
  
    pool.query('INSERT INTO QUERY (q, loc) VALUES ($1, $2)',[q_lower, loc_lower])
    .then(response.status(201).json({ status: 'success', message: 'Query created.' }));
  } catch (error) {
    return next(error);
  }
}

// Delete query by id
const deleteQueryById = (request, response, next) => {
  try {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(422).json({ errors: errors.array() });
        return;
    }
    const { id } = request.body;
    pool.query('DELETE FROM QUERY WHERE id = $1',[id])
    .then(response.status(201).json({ status: 'success', message: 'Query deleted.' }));
  } catch (error) {
    return next(error);
  }
}

const validateQuery = (method) => {
  switch (method) {
      case 'createQuery': {
        return [ 
          body('q', 'q is empty').exists(),
          body('loc', 'loc is empty').exists(),
        ]   
      }
      case 'findQuery': {
        return [ 
          body('q', 'q is empty').exists(),
          body('loc', 'loc is empty').exists(),
        ]   
      }
      case 'deleteQueryById': {
        return [ 
          body('id', 'id is empty').exists(),
        ]   
      }
  }
}

module.exports = { getAllQueries, createQuery, findQuery, deleteQueryById, validateQuery }
