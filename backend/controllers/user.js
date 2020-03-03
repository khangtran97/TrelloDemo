const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: { type: String, require: true },
    password: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    address: { type: String, require: true },
    role: { type: String, require: true }
});

const UserModel = new mongoose.model('user', UserSchema);
const admin = 'ADMIN';
const member = 'MEMBER';

exports.createUser = async (req, res, next) => {
    UserModel.findOne({ userName: req.body.userName }, (err, user) => {
        if (user == null) {
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) { return next(err); }
                const user = new UserModel(req.body);
                user.password = hash;
                if (user.userName === 'admin@gmail.com') { user.role = 'ADMIN' }
                user.save((err, result) => {
                    if (err) { return res.json({ err }); }
                    res.status(200).json({ user: result });
                });
            });
        } else {
            res.status(401).json({
                err: { message: 'Email has been used' }
            });
        }
    });
}



exports.userLogin = (req, res) => {
    let fetchedUser;
    UserModel.findOne({ userName: req.body.userName }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            const token = jwt.sign(
                { email: fetchedUser.userName, userId: fetchedUser._id, role: fetchedUser.role },
                process.env.JWT_KEY,
                { expiresIn: '1h' }
            );
            res.status(200).json({
                token,
                expiresIn: 3600,
                userId: fetchedUser._id,
                userName: fetchedUser.userName,
                firstName: fetchedUser.firstName,
                lastName: fetchedUser.lastName,
                address: fetchedUser.address,
                role: fetchedUser.role
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Auth failed'
            });
        });
}

exports.getUserById = (req, res) => {
    UserModel.findOne({ '_id': req.params.id }).then(user => {
        if (user) {
            res.status(200).json(user)
        } else {
            return res.status(404).json({
                message: 'User not found with id ' + req.params.id
            });
        }
    })
}

exports.getAllUser = (req, res) => {
    UserModel.find().then(data => {
        res.status(200).json({
            message: 'Users retrieved successfully!',
            users: data
        })
    })
}

exports.editUser = (req, res) => {
    if (req.userData.role === admin || req.userData.role === member) {
        UserModel.findByIdAndUpdate(req.params.id, req.body).then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'User not found with id ' + req.body.id
                });
            }
            res.status(200).json({ message: 'User updated succeccfully!' });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).json({
                    message: 'User not found with id ' + req.body.id
                });
            }
            return res.status(500).json({
                message: 'Could not update User with id ' + req.body.id
            });
        });
    } else {
        return res.status(403).json({ message: 'Not Authorized!' });
    }
}

exports.deleteUser = (req, res) => {
    if (req.userData.role === admin) {
        UserModel.deleteOne({ _id: req.params.id }).then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'card not found with id ' + req.body.id
                });
            }
            res.status(200).json({ message: 'User deleted successfully!' });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).json({
                    message: 'User not found with id ' + req.body.id
                });
            }
            return res.status(500).json({
                message: 'Could not delete User with id ' + req.body.id
            });
        });
    } else {
        return res.status(403).json({ message: 'Not Authorized!' });
    }
}