// Load the express package and create a router
var express = require('express');
var router = express.Router();

// GET: '/' => Home Page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PlayCalendar' });
});

module.exports = router;
