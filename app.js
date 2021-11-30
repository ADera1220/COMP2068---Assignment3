var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// Import global variables (used for DB connection, Authentication, and more)
const globals = require('./config/globals');


// Require passport for Authentication and express-session for session management
const passport = require('passport');
const session = require('express-session');

/* CONFIGURE PASSPORT */
// Configure sessions with some required options
app.use(session({
  secret:'playcalendar326!',
  resave: true,
  saveUninitialized: false
}));

// Add session support to passport
app.use(passport.initialize());
app.use(passport.session());

// Connect the User model with passport (User has the plm module in it)
const User = require('./models/user');
passport.use(User.createStrategy());

// Enable read/write on session object
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

/* ADD EXTERNAL AUTH PROVIDERS */
const gitHub = require('passport-github').Strategy;
const google = require('passport-google-oauth20').Strategy;

// GitHub OAuth
passport.use(new gitHub({
  clientID: globals.gitHub.clientID,
  clientSecret: globals.gitHub.clientSecret,
  callbackURL: globals.gitHub.callbackURL
}, async (accessToken, refreshToken, profile, callback) => {
  try {
    // Ensure the GitHub user is not in our database
    const user = await User.findOne({ oauthId: profile.id });

    if(user) {
      // If the user exists, send the object from the db
      return callback(null, user);
    } else {
      // No user, create a new user with GitHub credentials
      const newUser = new User({
        username: profile.username,
        oauthProvider: 'GitHub',
        oauthId: profile.id
      });
      
      // Save the new user and return the user object
      const savedUser = await newUser.save();
      callback(null, savedUser);
    }
  } catch(e) {
    callback(e);
  }
}));

// Google OAuth
passport.use(new google({
  clientID: globals.google.clientID,
  clientSecret: globals.google.clientSecret,
  callbackURL: globals.google.callbackURL
}, async (accessToken, refreshToken, profile, callback) => {
  try {
    const user = await User.findOne({ googleId: profile.id });

    if(user) {
      return callback(null, user);
    } else {
      const newUser = new User({
        username: profile.username,
        oauthProvider: 'Google',
        googleId: profile.id
      });

      const savedUser = await newUser.save();
      callback(null, savedUser);
    }
  } catch(e) {
    callback(e);
  }
}))

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gamesRouter = require('./routes/games');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/games', gamesRouter);

/* Mongo DB Connection */

// Require the mongoose package
const mongoose = require('mongoose');

// Connect to the database
mongoose.connect(globals.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(
  // If query is successful...
  (res) => {
    console.log('PlayCalendar catabase connected');
  }
).catch(
  // If there is an error...
  () => {
    console.error('Could not establish a connection');
  }
)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
