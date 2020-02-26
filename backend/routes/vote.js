const express = require('express');
const VoteController = require('../controllers/vote')

const router = express.Router();

router.post('', VoteController.createVote);

router.put('/:id', VoteController.removeVote);

module.exports = router;