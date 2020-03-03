const express = require('express');
const checkAuth = require('../middleware/check-auth');
// const passport = require('passport');
// require('../passport.js')(passport)

const router = express.Router();
const UserController = require('../controllers/user');


router.post('/register', UserController.createUser);

router.post('/login', UserController.userLogin);

// router.get('/auth/google', passport.authenticate('google', {
//     scope: ['profile', 'email']
// }))

// router.get('/google/callback', passport.authenticate('google'), (req, res) => {
//     res.redirect('http://localhost:4200/');
// });

router.get('/auth/google', (req, res) => {
    console.log(req.body);
});

router.get('/:id', UserController.getUserById);

router.get('', UserController.getAllUser);

router.put('/:id', checkAuth, UserController.editUser);

router.delete('/:id', checkAuth, UserController.deleteUser);

module.exports = router;