const { selectAllQueries, selectQuery, insertQuery, deleteQuery } = require('../db.methods');
const { validationResult } = require('express-validator');
const { body } = require('express-validator');

// Return all queries from QUERY table
const getAllQueries = (request, response, next) => {
    try {
      selectAllQueries().then(results => response.status(200).json(results.rows));
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
    selectQuery([q_lower, loc_lower]).then(results => response.status(200).json(results.rows[0]));
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
    insertQuery([q_lower, loc_lower]).then(response.status(201).json({ status: 'success', message: 'Query created.' }));
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
    deleteQuery([id]).then(response.status(201).json({ status: 'success', message: 'Query deleted.' }));
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
