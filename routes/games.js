// Load the express package and create a router
const express = require('express');
const router = express.Router();

// Import globals file
const globals = require('../config/globals')

// Require Moment.js, an npm package used to process dates
const moment = require('moment');

// Reference the Game model and the passport Module for Auth
const passport = require('passport');
const Game = require('../models/game');

// This function will check if the user is authenticated in the app
function checkAuthUser(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

// GET: '/games' => load the index view of 'games"
router.get('/', (req, res, next) => {
    // We fetch the documents using the Game model
    Game.find({}, null, { sort: 'releaseDate' }, (err, games) => {
        if(err) {
            console.log(err);
            res.end(err);
        } else{
            res.render('games/index', {
                title: 'All Games | PlayCalendar',
                games: games,
                user: req.user
            });
        }
    });
});

//The '/mine' route exists so that users can see, update, add to, and remove grames from their personal collection.

// GET: '/games/mine' => load the index view of 'games"
router.get('/mine', (req, res, next) => {
    // We fetch the documents using the Game model
    Game.find({ user: req.user }, null, { sort: 'releaseDate' }, (err, games) => {
        if(err) {
            console.log(err);
            res.end(err);
        } else{
            res.render('games/mine', {
                title: 'My Games | PlayCalendar',
                games: games,
                user: req.user
            });
        }
    });
});

// GET:'/games/create' => load the view for creating a new game
router.get('/create', checkAuthUser, (req, res, next) => {
    res.render('games/create', {
        title: 'New Game | PlayCalendar',
        user: req.user
    });
});

// POST: '/games/create' => Process the form and create a Game document
router.post('/create', checkAuthUser, (req, res, next) => {
    // Use the moment object to process the date received and format it
    const formattedRelease = moment(req.body.releaseDate).format('YYYY-MM-DD')

    // Use the model to create the game doc
    Game.create({
        name: req.body.name,
        dev: req.body.dev,
        platform: req.body.platform,
        releaseDate: formattedRelease,
        user: req.user._id
    }, (err, newGame) => {
        if(err) {
            // If the save passes an error, log it out
            console.log(err);
            res.end(err);
        } else {
            // If the save completes, redirect to the index view
            res.redirect('/games');
        }
    });
});

// GET: '/games/edit/(_id)' => load the view for editing a chosen game in the DB
router.get('/edit/:_id', checkAuthUser, (req, res, next) => {
    // Get the ID from the url
    const _id = req.params._id;

    // Search the DB by _id to find the document
    Game.findById(_id, (err, game) => {
        if(err) {
            console.log(err);
            res.end(err);
        } else {
            res.render('games/edit', {
                title: 'Edit a Game | PlayCalendar',
                game: game,
                user: req.user
            });
        }
    });
});

// POST: '/games/edit/(_id)' => submit the edited document
router.post('/edit/:_id', checkAuthUser, (req, res, next) => {

    // This function handles Youtube links, grabbing the Video ID, concept was on StackOverflow (linked in README.md)
    const getTrailerID = (trailerLink) => {
        // This RegEx parses a youtube url to grab the video ID
        const trailerRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        // We match the link ot the RegEx, getting the ID
        const trailerUrlMatch = trailerLink.match(trailerRegExp);

        // After ID is pulled from link, return a ternary operator to check ID is populated AND correct length, if so, returns the ID
        return (trailerUrlMatch && trailerUrlMatch[2].length === 11) ? trailerUrlMatch[2] : null;
    }

    // Use function run on the trailer link in the req, store the result for when model is updated
    const trailerID = getTrailerID(req.body.trailer);

    // Get the ID out of the url
    const _id = req.params._id;

    // Locate the correct document in the DB and Update it
    Game.findByIdAndUpdate(
        {
            _id: _id
        },
        {
            name: req.body.name,
            dev: req.body.dev,
            platform: req.body.platform,
            trailer: trailerID,
            releaseDate: req.body.releaseDate,
            purchased: req.body.purchased,
            timePlayed: req.body.timePlayed
        },
        (err, game) => {
            if(err) {
                console.log(err);
                res.end(err);
            } else {
                res.redirect('/games');
            }
        }
    );
});

// GET:'/games/delete/(id)' => fetch the requested document and delete it
router.get('/delete/:_id', checkAuthUser, (req, res, next) => {
    // Store the _id from the request body in a constant
    const _id = req.params._id;

    Game.remove({ _id: _id }, (err) => {
        if(err) {
            console.log(err);
            res.end(err);
        } else {
            res.redirect('/games');
        }
    });
});

module.exports = router;