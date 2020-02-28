const mongoose = require('mongoose');

const socialUserSchema = mongoose.Schema({
    provider: { type: String, require: true },
    email: { type: String, require: true },
    name: { type: String, require: true },
    image: { type: String, require: true },
    token: { type: String },
    idToken: { type: String }
});

module.exports = mongoose.model('SocialUser', socialUserSchema);