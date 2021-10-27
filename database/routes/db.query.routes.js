const express = require("express");
const router = express.Router();

const { getAllQueries, findQuery, createQuery, deleteQueryById, validateQuery } = require('../controller/queries.controller');

// Get all saved queries
router.get('/all', async (req, res, next) => {
    await getAllQueries(req, res, next);
});

// Find all saved queries with mathing q and loc
router.get('/find', validateQuery('findQuery'), async (req, res, next) => {
    await findQuery(req, res);
});

// Create new query with given q and loc 
router.post('/new', validateQuery('createQuery'), async (req, res, next) => {
    await createQuery(req, res, next);
});

// Delete query by id
router.delete('/delete', validateQuery('deleteQueryById'), async (req, res, next) => {
    await deleteQueryById(req, res, next);
});

module.exports = router;