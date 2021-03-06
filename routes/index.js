var express = require('express');
const axios = require('axios');
var router = express.Router();

/* GET DEFAULT home page. */
router.get('/', async function(req, res, next) {
  // probably need to call this when submit button is clicked
  axios.post('http://localhost:5000/scraper/v1/event/fetch_one', { q: 'food', loc: 'ma', orderBy: 'date_start' })
    .then((result) => {
      // now result.data is an array of our events 
      if (result && result.data && result.data.length > 0) {
        res.render('pages/home', { title: 'QR8 - Home' , items: result.data});
      } else {
        res.status(400).json({ error: "didn't find any events" });
      }
    }).catch((error) => {
      console.log(error);
    });
});

/* POST Re-rendered home page. */
router.post('/home_events', async function(req, res, next) {
  //console.log(req);
  const { q, sortBy } = req.body;
  const q_lower = q.toLowerCase();
  console.log(sortBy)
  // probably need to call this when submit button is clicked
  axios.post('http://localhost:5000/scraper/v1/event/fetch_one', { q: `${q_lower}`, loc: 'ma', orderBy: `${sortBy}` })
    .then((result) => {
      // now result.data is an array of our events 
      if (result && result.data && result.data.length > 0) {
        res.render('pages/home', { title: 'QR8 - Home' , items: result.data});
      } else {
        res.status(400).json({ error: "didn't find any events" });
      }
    }).catch((error) => {
      console.log(error);
    });
});

module.exports = router;
