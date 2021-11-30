// Import mongoose and passport-local-mongoose packages, plm is required so that the model can be use for authenticaiton
const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

// Create a Schema for the user model
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    oauthProvider: String,
    oauthId: String
});

// Extend the model's functions with plm to include user management and Auth
userSchema.plugin(plm);
// Adding a 'findOrCreate' plugin to allow for easier processing of the Google Auth
userSchema.plugin(findOrCreate)

module.exports = mongoose.model('User', userSchema);