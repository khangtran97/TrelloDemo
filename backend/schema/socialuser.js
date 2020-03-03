const mongoose = require('mongoose');

const socialUserSchema = mongoose.Schema({
    googleId: String,
    email: String,
    name: String,
    role: String
});

module.exports = mongoose.model('SocialUser', socialUserSchema);