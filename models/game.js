// Link to the mongoose package
const mongoose = require('mongoose');

// Create a Schema for the Games using the mongoose package
const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    dev: {
        type: String,
        required: false,
        trim: true
    },
    platform: {
        type: String,
        required: false,
        trim: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    trailer: String,
    purchased: String,
    timePlayed: Number
});

// Export the model with the name 'Games', so it is public
module.exports = mongoose.model('Games', gameSchema);