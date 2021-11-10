var express = require('express');
var router = express.Router();


const event = {
  title: "Event 1",
  date: 147183472384,
  location: "Boston, MA",
  covid: "Yes",
  weather: "Cloudy"
};
const events = [
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event,
  event
];

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("index route");
  res.render('pages/home', { title: 'QR8 - Home' , items:events});
});

module.exports = router;
