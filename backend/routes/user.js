const express = require('express');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const UserController = require('../controllers/user');


router.post('/register', UserController.createUser);

router.post('/sociallogin', )

router.post('/login', UserController.userLogin);

router.get('/:id', UserController.getUserById);

router.get('', UserController.getAllUser);

router.put('/:id', checkAuth,  UserController.editUser);

router.delete('/:id', checkAuth, UserController.deleteUser);

module.exports = router;