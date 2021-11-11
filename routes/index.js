var express = require('express');
const axios = require('axios');
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
router.get('/', async function(req, res, next) {
  // probably need to call this when submit button is clicked
  axios.post('http://localhost:5000/scraper/v1/event/fetch_one', { q: 'events', loc: 'massachusetts' })
    .then((result) => {
      // now result.data is an array of our events 
      console.log(result.data[0].title)
      res.render('pages/home', { title: 'QR8 - Home' , items:events});
    }).catch((error) => {
      console.log(error);
    });
});

module.exports = router;
