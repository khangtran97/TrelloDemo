const Card = require('../schema/card');

exports.createVote = (req, res) => {
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
}

exports.removeVote = (req, res) => {
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
}