var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("index route");
  res.render('main', { title: 'QR8 - Home'});
});

module.exports = router;
