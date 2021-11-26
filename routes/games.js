// Load the express package and create a router
const express = require('express');
const router = express.Router();

// Reference the Game model
const Game = require('../models/game');

// GET: '/games' => load the index view of 'games"
router.get('/', (req, res, next) => {
    // We fetch the documents using the Game model
    Game.find((err, games) => {
        if(err) {
            console.log(err);
            res.end(err);
        } else{
            res.render('games/index', {
                title: 'Games | PlayCalendar',
                games: games,
            });
        }
    })
})

// GET:'/games/create' => load the view for creating a new game
router.get('/create', (req, res, next) => {
    res.render('games/create', {
        title: 'New Game | PlayCalendar'
    });
});

// POST: '/games/create' => Process the form and create a Game document
router.post('/create', (req, res, next) => {
    // Use the model to create the game doc
    Game.create({
        name: req.body.name,
        dev: req.body.dev,
        platform: req.body.platform,
        releaseDate: req.body.releaseDate
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
router.get('/edit/:_id', (req, res, next) => {
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
                game: game
            });
        }
    });
});

// POST: '/games/edit/(_id)' => submit the edited document
router.post('/edit/:_id', (req, res, next) => {
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
            trailer: req.body.trailer,
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

router.post
module.exports = router;