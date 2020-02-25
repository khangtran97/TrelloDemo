const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName: { type: String, require: true },
    password: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    address: { type: String, require: true },
    role: { type: String, require: true }
});

module.exports = mongoose.model('User', userSchema);