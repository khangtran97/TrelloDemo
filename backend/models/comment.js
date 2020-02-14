const mongoose = require('mongoose');

const Likes = mongoose.Schema({
    card: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', require: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true }
});

const commentSchema = mongoose.Schema({
    content: { type: String, require: true },
    creator: { type: String, require: true },
    card: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', require: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    likes: [Likes]
});

module.exports = mongoose.model('Comment', commentSchema);