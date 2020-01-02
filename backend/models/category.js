const mongoose = require('mongoose');

const categSchema = mongoose.Schema({
    title: { type: String, require: true }
});

module.exports = mongoose.model('Category', categSchema);