var express = require('express');

var apiHelper = require('../utils/api');
var consts = require('../utils/consts');

var router = express.Router();

/* GET events page. */
router.get('/', function(req, res, next) {
    apiHelper.make_API_call(`${consts.EVENT_SEARCH_BASE_URL}?engine=${consts.EVENT_SEARCH_ENGINE}&q=Coffee&api_key=${consts.EVENT_API_KEY}`)
    .then(response => {
        res.json(response)
    })
    .catch(error => {
        res.send(error)
    })
});
  
module.exports = router;
