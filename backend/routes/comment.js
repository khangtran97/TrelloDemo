const express = require('express');
const CommentController = require('../controllers/comment');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('', CommentController.getComments);

router.post('', checkAuth, CommentController.createComment);

router.delete('/:id', checkAuth, CommentController.deleteComment);

router.put('/:id', checkAuth, CommentController.editComment);

module.exports = router;