const express = require('express');
const CardComment = require('../models/comment');

const router = express.Router();

router.post('', (req, res) => {
    CardComment.findOneAndUpdate(
        { "_id": req.body.id },
        { $push: { likes: { card: req.body.card, user: req.body.user } } }
    ).then(result => {
        if (!result) {
            return res.status(404).json({
                message: 'Comment not found with id ' + req.body.id
            });
        }
        res.status(200).json({ message: 'Add like succeccfully!' });
    })
});

router.put('/:id', (req, res) => {
    CardComment.update(
        { "_id": req.body.id },
        { $pull: { 'likes': { 'user': req.body.user } } }
    ).then(result => {
        if (!result) {
            return res.status(404).json({
                message: 'Comment not found with id ' + req.body.id
            });
        }
        res.status(200).json({ message: 'Remove like succeccfully!' });
    })
})

module.exports = router;