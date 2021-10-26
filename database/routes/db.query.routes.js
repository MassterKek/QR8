const express = require("express");
const router = express.Router();

const { getAllQueries, findQuery, createQuery, deleteQueryById } = require('../controller/queries.controller')

// Get all saved queries
router.get('/all', function(req, res) {
    getAllQueries(req, res);
});

// Find all saved queries with mathing q and loc
router.get('/find', function(req, res) {
    findQuery(req, res);
});

// Create new query with given q and loc 
router.post('/new', function(req, res) {
    createQuery(req, res);
});

// Delete queryy by id
router.delete('/delete', function(req, res) {
    deleteQueryById(req, res);
});

module.exports = router;