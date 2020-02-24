const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const checkAuth = require('./middleware/check-auth');
const MongoStore = require('connect-mongo')(session);

const Category = require('./models/category');
const Card = require('./models/card');
const CardComment = require('./models/comment');
const Vote = require('./models/vote');
const admin = 'ADMIN';
const member = 'MEMBER';
const UserSchema = new mongoose.Schema({
    userName: { type: String, require: true },
    password: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    address: { type: String, require: true },
    role: { type: String, require: true }
});

const UserModel = new mongoose.model('user', UserSchema);

const app = express();
const db = mongoose.connection;
const connectStr = 'mongodb+srv://khang_1:5HyIHdbXVJp5eCYp@cluster0-8f4qo.mongodb.net/trello-angular?retryWrites=true&w=majority'
mongoose.connect(connectStr)
    .then(() => {
        console.log('Connected to database');
    })
    .catch(() => {
        console.log('Connection failed!');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, PATCH, DELETE, OPTION'
    );
    next();
});


// Authentication
app.post('/register', async (req, res, next) => {
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
});

app.route('/login').post((req, res) => {
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
                'secret_this_should_be_longer',
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
});

app.get('/user/:id', (req, res) => {
    UserModel.findOne({ '_id': req.params.id }).then(user => {
        if (user) {
            res.status(200).json(user)
        } else {
            return res.status(404).json({
                message: 'User not found with id ' + req.params.id
            });
        }
    })
});

app.get('/user', (req, res) => {
    UserModel.find().then(data => {
        res.status(200).json({
            message: 'Users retrieved successfully!',
            users: data
        })
    })
})

app.put('/user/:id', checkAuth, (req, res) => {
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

})

app.delete('/user/:id', checkAuth, (req, res) => {
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
    
})


// Category
app.route('/category').get((req, res, next) => {
    Category.find().then(data => {
        res.status(200).json({
            message: 'Categories retrieved successfully!',
            categories: data
        });
    });
});

app.route('/category').post((req, res, next) => {
    const category = new Category({
        title: req.body.title
    });
    category.save().then(createdCategory => {
        res.status(201).json({
            message: 'Category added successfully',
            category: {
                id: createdCategory._id,
                title: createdCategory.title
            }
        });
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    });
});

app.route('/category/:id').delete((req, res, next) => {
    Category.deleteOne({ _id: req.params.id }).then(result => {
        if (!result) {
            return res.status(404).json({
                message: 'card not found with id ' + req.body.id
            });
        }
        res.status(200).json({ message: 'card deleted successfully!' });
    }).catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
                message: 'card not found with id ' + req.body.id
            });
        }
        return res.status(500).json({
            message: 'Could not delete card with id ' + req.body.id
        });
    });
});

app.route('/category/:id').put(checkAuth, (req, res) => {
    if (req.userData.role === admin || req.userData.role === member) {
        Category.findByIdAndUpdate(req.params.id, req.body).then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'Category not found with id ' + req.body.id
                });
            }
            res.status(200).json({ message: 'Category updated succeccfully!' });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).json({
                    message: 'Category not found with id ' + req.body.id
                });
            }
            return res.status(500).json({
                message: 'Could not update category with id ' + req.body.id
            });
        });
    } else {
        return res.status(403).json({ message: 'Not Authorized!' });
    }    
});



// Card
app.route('/card').post(checkAuth, (req, res) => {
    const card = new Card({
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        comment: req.body.comment
    });
    console.log(req.userData.role);
    return res.status(200).json({});
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

app.route('/card').get((req, res) => {
    Card.find().then(data => {
        res.status(200).json({
            message: 'Vote retrieved succesfully!',
            cards: data
        });
    });
});

app.route('/card/:id').put(checkAuth, (req, res) => {
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

app.route('/card/:id').delete(checkAuth, (req, res, next) => {
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


// Comment
function getCommentList() {
    return Comment.find();
}

function getUserNameByCommentId(userId) {
    return User.find({ user: userId });
}

app.route('/comment').get((req, res) => {
    CardComment.find().then(data => {
        res.status(200).json({
            message: 'Card retrieved succesfully!',
            comments: data
        });
    });
});

app.route('/comment').post(checkAuth, (req, res, next) => {
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
});

app.route('/comment/:id').delete(checkAuth, (req, res, next) => {
    CardComment.deleteOne({ _id: req.params.id, user: req.userData.userId }).then(result => {
        if (result.n > 0) {
            res.status(200).json({ message: 'Deletion successful!' });
        } else {
            res.status(401).json({ message: 'Not authorized!' });
        }
    });
});

app.route('/comment/:id').put(checkAuth, (req, res) => {
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
});


//------------------VOTE---------------------------
app.route('/vote').post((req, res) => {
    Card.findOneAndUpdate(
        { "_id": req.body.id },
        { $push: { votes: { user: req.body.user } } }
    ).then(result => {
        if (!result) {
            return res.status(404).json({
                message: 'Card not found with id ' + req.body.id
            });
        }
        res.status(200).json({ message: 'Add vote succeccfully!' });
    })
});

app.route('/vote/:id').put((req, res) => {
    Card.update(
        { "_id": req.body.id },
        { $pull: { 'votes': { 'user': req.body.user } } }
    ).then(result => {
        if (!result) {
            return res.status(404).json({
                message: 'Card not found with id ' + req.body.id
            });
        }
        res.status(200).json({ message: 'Remove vote succeccfully!' });
    })
})

//---------------LIKE--------------------------
app.route('/like').post((req, res) => {
    CardComment.findOneAndUpdate(
        { "_id": req.body.id },
        { $push: { likes: { card: req.body.card, user: req.body.user } } }
    ).then(result => {
        if (!result) {
            return res.status(404).json({
                message: 'Comment not found with id ' + req.body.id
            });
        }
        res.status(200).json({ message: 'Add like succeccfully!' });
    })
});

app.route('/like/:id').put((req, res) => {
    CardComment.update(
        { "_id": req.body.id },
        { $pull: { 'likes': { 'user': req.body.user } } }
    ).then(result => {
        if (!result) {
            return res.status(404).json({
                message: 'Comment not found with id ' + req.body.id
            });
        }
        res.status(200).json({ message: 'Remove like succeccfully!' });
    })
})

module.exports = app;
// export { app, mongoose, jwt };
