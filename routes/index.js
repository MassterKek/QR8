var express = require('express');
var router = express.Router();

const events = [{
  title: "Event 1",
  date: 147183472384,
  location: "Boston, MA",
  covid: "Yes",
  weather: "Cloudy"
}];

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("index route");
  res.render('pages/home', { title: 'QR8 - Home', events });
});

module.exports = router;
