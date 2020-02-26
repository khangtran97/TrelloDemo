const express = require('express');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const CardController = require('../controllers/card');


router.post('', checkAuth, CardController.createCard);

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

router.get('', CardController.getCards);

router.put('/:id', checkAuth, CardController.editCard);

router.delete('/:id', checkAuth, CardController.deleteCard);

module.exports = router;