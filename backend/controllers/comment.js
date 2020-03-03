const CardComment = require('../schema/comment');
const admin = 'ADMIN';
const member = 'MEMBER';

exports.getComments = (req, res) => {
    CardComment.find().then(data => {
        res.status(200).json({
            message: 'Card retrieved succesfully!',
            comments: data
        });
    });
}

exports.createComment = (req, res, next) => {
    const comment = new CardComment({
        content: req.body.content,
        creator: req.body.creator,
        card: req.body.card,
        user: req.body.user
    });
    if (req.userData.role === admin || req.userData.role === member) {
        comment.save().then(createdComment => {
            res.status(201).json({
                message: 'Comment added succesfully!',
                card: {
                    id: createdComment._id,
                    content: createdComment.content,
                    creator: createdComment.creator,
                    card: createdComment.card,
                    user: createdComment.user
                }
            });
        }).catch(err => {
            console.log(err),
                res.status(500).json({
                    error: err
                });
        });
    } else {
        return res.status(403).json({ message: 'Not Authorized!' });
    }
}

exports.deleteComment = (req, res, next) => {
    CardComment.deleteOne({ _id: req.params.id, user: req.userData.userId }).then(result => {
        if (result.n > 0) {
            res.status(200).json({ message: 'Deletion successful!' });
        } else {
            res.status(401).json({ message: 'Not authorized!' });
        }
    });
}

exports.editComment = (req, res) => {
    const comment = new CardComment({
        _id: req.body.id,
        content: req.body.content,
        creator: req.body.creator,
        card: req.body.card,
        user: req.userData.userId
    });
    CardComment.updateOne({ _id: req.params.id, user: req.userData.userId }, comment).then(result => {
        if (result.nModified > 0) {
            res.status(200).json({ message: 'Update successfull!' });
        } else {
            res.status(401).json({ message: 'Not Authorized!' });
        }
    });
}