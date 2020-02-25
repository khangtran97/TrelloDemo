const express = require('express');
const Card = require('../models/card');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const admin = 'ADMIN';
const member = 'MEMBER';

router.post('', checkAuth, (req, res) => {
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

});

function getCardList() {
    return Card.find();
}

function getVoteListByCardId(cardId) {
    return Vote.find({ card: cardId });
}

// app.get('/card', (req, res) => {
//     function process() {
//         return getCardList().then((cards) => {
//             return Promise.all(cards.map(async card => {
//                 const votes = await getVoteListByCardId(card._id);
//                 if (votes && votes.length > 0) {
//                     // card.set('votes', votes, { strict: false });
//                     card = card.toObject();
//                     card.votes = votes;
//                 }
//                 return card;
//             }));
//         });
//     }

//     process().then((result) => {
//         res.status(200).json({
//             message: 'Card retrieved succesfully!',
//             cards: result
//         });
//     });
// });

router.get('', (req, res) => {
    Card.find().then(data => {
        res.status(200).json({
            message: 'Vote retrieved succesfully!',
            cards: data
        });
    });
});

router.put('/:id', checkAuth, (req, res) => {
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

});

router.delete('/:id', checkAuth, (req, res, next) => {
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
});

module.exports = router;