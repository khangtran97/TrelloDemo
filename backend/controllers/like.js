const CardComment = require('../schema/comment');

exports.createLike = (req, res) => {
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
}

exports.removeLike = (req, res) => {
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
}