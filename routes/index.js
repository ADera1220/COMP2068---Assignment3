// Load the express package and create a router
var express = require('express');
var router = express.Router();

// Require Passport module and User model
const passport = require('passport');
const User = require('../models/user')

// GET: '/' => Home Page
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'PlayCalendar',
    user: req.user
  });
});

// POST: '/register' => Create a new User
router.post('/register', (req, res, next) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, newUser) => {
    if(err) {
      console.log(err);
      res.render('register', {
        message: err
      });
    } else {
      req.login(newUser, (err) => {
        res.redirect('/games')
      });
    }
  });
});

// GET: '/register' => Registration page
router.get('/register', (req, res, next) => {
  res.render('register', {
    title: 'Register | PlayCalendar',
  });
});

// GET: '/login' => User Login Page
router.get('/login', (req, res, next) => {
  res.render('login', {
    title: 'Login | PlayCalendar',
  });
});

// POST: '/login' => Log the user into PlayCalendar
router.post('/login', passport.authenticate('local', {
  successRedirect: '/games',
  failureRedirect: '/login',
  failureMessage: 'Credentials invalid, Please try again'
}));

// GET: '/logout' => log the user out of PlayCalendar
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login');
});

// GET: '/github' => Send out a request for GitHub login
router.get('/github', passport.authenticate('github', {
  scope: ['user:email']
}));

// GET: '/github/callback' => route the user through gitHub
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/games')
});

// GET: '/google' => Send out a request for Google login
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

// GET: '/google/callback' => route the user through Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/games');
});

module.exports = router;
