const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    comment: { type: String, require: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', require: true }
});

module.exports = mongoose.model('Card', cardSchema);