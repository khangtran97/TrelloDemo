const express = require('express');
const Card = require('../models/card');

const router = express.Router();

router.post('', (req, res) => {
    Card.findOneAndUpdate(
        { "_id": req.body.id },
        { $push: { votes: { user: req.body.user } } }
    ).then(result => {
        if (!result) {
            return res.status(404).json({
                message: 'Card not found with id ' + req.body.id
            });
        }
        res.status(200).json({ message: 'Add vote succeccfully!' });
    })
});

router.put('/:id', (req, res) => {
    Card.update(
        { "_id": req.body.id },
        { $pull: { 'votes': { 'user': req.body.user } } }
    ).then(result => {
        if (!result) {
            return res.status(404).json({
                message: 'Card not found with id ' + req.body.id
            });
        }
        res.status(200).json({ message: 'Remove vote succeccfully!' });
    })
})

module.exports = router;