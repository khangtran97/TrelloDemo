const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    content: { type: String, require: true },
    card: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', require: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true }
});

module.exports = mongoose.model('Comment', commentSchema);