const express = require('express');
const LikeController = require('../controllers/like');

const router = express.Router();

router.post('', LikeController.createLike);

router.put('/:id', LikeController.removeLike);

module.exports = router;