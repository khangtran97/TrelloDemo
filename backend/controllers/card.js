const Card = require('../schema/card');
const admin = 'ADMIN';
const member = 'MEMBER';

exports.createCard = (req, res) => {
    const card = new Card({
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        comment: req.body.comment
    });
    if (req.userData.role === admin || req.userData.role === member) {
        card.save().then(createdCard => {
            res.status(201).json({
                message: 'Card added succesfully!',
                card: {
                    id: createdCard._id,
                    title: createdCard.title,
                    description: createdCard.description,
                    comment: createdCard.comment
                }
            });
        }).catch(err => {
            console.log(err),
                res.status(500).json({
                    error: err
                });
        });
    } else {
        return res.status(403).json({ message: 'Not authorized!' });
    }
}

exports.getCards = (req, res) => {
    Card.find().then(data => {
        res.status(200).json({
            message: 'Vote retrieved succesfully!',
            cards: data
        });
    });
}

exports.editCard = (req, res) => {
    if (req.userData.role === admin || req.userData.role === member) {
        Card.findByIdAndUpdate(req.params.id, req.body).then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'Card not found with id ' + req.body.id
                });
            }
            res.status(200).json({ message: 'Card updated succeccfully!' });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).json({
                    message: 'Card not found with id ' + req.body.id
                });
            }
            return res.status(500).json({
                message: 'Could not update Card with id ' + req.body.id
            });
        });
    } else {
        return res.status(403).json({ message: 'Not Authorized!' });
    }
}

exports.deleteCard = (req, res, next) => {
    if (req.userData.role === admin || req.userData.role === member) {
        Card.deleteOne({ _id: req.params.id }).then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'category not found with id ' + req.body.id
                });
            }
            res.status(200).json({ message: 'category deleted successfully!' });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).json({
                    message: 'Category not found with id ' + req.body.id
                });
            }
            return res.status(500).json({
                message: 'Could not delete category with id ' + req.body.id
            });
        });
    } else {
        return res.status(403).json({ message: 'Not Authorized!' });
    }
}