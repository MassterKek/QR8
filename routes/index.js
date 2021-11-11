var express = require('express');
const axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  // probably need to call this when submit button is clicked
  axios.post('http://localhost:5000/scraper/v1/event/fetch_one', { q: 'events', loc: 'massachusetts' })
    .then((result) => {
      // now result.data is an array of our events 
      if (result && result.data && result.data.length > 0) {
        res.render('pages/home', { title: 'QR8 - Home' , items: result.data});
      } else {
        response.status(400).json({ error: "didn't find any events" });
      }
    }).catch((error) => {
      console.log(error);
    });
});

module.exports = router;
