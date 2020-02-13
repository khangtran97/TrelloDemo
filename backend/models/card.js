const mongoose = require('mongoose');

const Votes = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true }
})

const cardSchema = mongoose.Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    comment: { type: String, require: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', require: true },
    votes: [Votes]
});

module.exports = mongoose.model('Card', cardSchema);