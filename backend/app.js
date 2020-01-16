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
const Comment = require('./models/comment');
const UserSchema = new mongoose.Schema({
    userName: { type: String, require: true },
    password: { type: String, require: true }
});

const UserModel = new mongoose.model("user", UserSchema);

const app = express();
const db = mongoose.connection;
mongoose.connect("mongodb+srv://khang_1:5HyIHdbXVJp5eCYp@cluster0-8f4qo.mongodb.net/trello-angular?retryWrites=true&w=majority")
.then(() => {
    console.log('Connected to database');
})
.catch(() => {
    console.log('Connection failed!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTION"
    );
    next();
});


// Authentication
app.post("/register", async (req, res) => {
    UserModel.findOne({userName: req.body.userName}, (err, user) => {
        if(user == null) {
            bcrypt.hash(req.body.password, 10, function(err, hash){
                if(err) { return next(err);}
                const user = new UserModel(req.body)
                user.password = hash;
                user.save((err, result) => {
                    if(err) { return res.json({err})}
                    res.status(200).json({user: result})
                })
            })
        } else {
            res.status(401).json({
                err: {message: 'Email has been used'}
            })
        }
    })
})

app.route('/login/:id').get((req, res) => {
    UserModel.findOne({_id: req.body.userId}).then(user => {
        if(!user) {
            return res.status(401).json({
                message: 'Account not exist!'
            });
        } else {
            return res.status(200).json({
                message: 'Account founded',
                user: user
            })
        }
    })
})

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
        if(!result) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        const token = jwt.sign(
            {email: fetchedUser.userName, userId: fetchedUser._id},
            "secret_this_should_be_longer",
            {expiresIn: "1h"}
        );
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id,
            userName: fetchedUser.userName
        });
    })
    .catch(err => {
        return res.status(401).json({
            message: 'Auth failed'
        });
    });
});


// Category
app.route('/category').get((req, res, next) => {
    Category.find().then(data => {
      res.status(200).json({
        message: "Categories retrieved successfully!",
        categories: data
      });
    });
})

app.route('/category').post((req, res, next) => {
    const category = new Category({
        title: req.body.title
    });
    category.save().then(createdCategory => {
        res.status(201).json({
          message: "Category added successfully",
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
    })
})

app.route('/category/:id').delete((req, res, next) => {
    Category.deleteOne({ _id: req.params.id}).then(result => {
        if(!result) {
            return res.status(404).json({
                message: "card not found with id " + req.body.id
            });
        }
        res.status(200).json({message: "card deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
                message: "card not found with id " + req.body.id
            });                
        }
        return res.status(500).json({
            message: "Could not delete card with id " + req.body.id
        });
    });
})

app.route('/category/:id').put((req, res) => {
    Category.findByIdAndUpdate(req.params.id, req.body).then(result => {
        if(!result) {
            return res.status(404).json({
                message: "Category not found with id " + req.body.id
            });
        }
        res.status(200).json({message: "Category updated succeccfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
                message: "Category not found with id " + req.body.id
            });                
        }
        return res.status(500).json({
            message: "Could not update category with id " + req.body.id
        });
    })
})



//Card
app.route('/card').post((req, res) => {
    const card = new Card({
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        comment: req.body.comment
    });
    card.save().then(createdCard => {
        res.status(201).json({
            message: "Card added succesfully!",
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
    })
})

app.route('/card').get((req, res) => {
    Card.find().then(data => {
        res.status(200).json({
            message: "Card retrieved succesfully!",
            cards: data
        });
    });
})

app.route('/card/:id').put((req, res) => {
    Card.findByIdAndUpdate(req.params.id, req.body).then(result => {
        if(!result) {
            return res.status(404).json({
                message: "Card not found with id " + req.body.id
            });
        }
        res.status(200).json({message: "Card updated succeccfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
                message: "Card not found with id " + req.body.id
            });                
        }
        return res.status(500).json({
            message: "Could not update Card with id " + req.body.id
        });
    })
})

app.route('/card/:id').delete((req, res, next) => {
    Card.deleteOne({ _id: req.params.id}).then(result => {
        if(!result) {
            return res.status(404).json({
                message: "category not found with id " + req.body.id
            });
        }
        res.status(200).json({message: "category deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
                message: "Category not found with id " + req.body.id
            });                
        }
        return res.status(500).json({
            message: "Could not delete category with id " + req.body.id
        });
    });
})


// Comment
app.route('/comment').get((req, res) => {
    Comment.find().then(data => {
        res.status(200).json({
            message: "Card retrieved succesfully!",
            comments: data
        });
    });
})

app.route('/comment').post((req, res, next) => {
    const comment = new Comment({
        content: req.body.content,
        card: req.body.card,
        user: req.body.user
    });
    comment.save().then(createdComment => {
        res.status(201).json({
            message: "Comment added succesfully!",
            card: {
                id: createdComment._id,
                content: createdComment.content,
                card: createdComment.card,
                user: createdComment.user
            }
        });
    }).catch(err => {
        console.log(err),
        res.status(500).json({
            error: err
        });
    })
})

app.route('/comment/:id').delete(checkAuth, (req, res, next) => {
    Comment.deleteOne({ _id: req.params.id, user: req.userData.userId }).then(result => {
        if(result.n > 0) {
            res.status(200).json({ message: "Deletion successful!"});
        } else {
            res.status(401).json({ message: "Not authorized!"});
        }
    })
})

app.route('/comment/:id').put(checkAuth, (req, res) => {
    const comment = new Comment({
        _id: req.body.id,
        content: req.body.content,
        card: req.body.card,
        user: req.userData.userId
    });
    Comment.updateOne({ _id: req.params.id, user: req.userData.userId }, comment).then(result => {
        if(result.nModified > 0) {
            res.status(200).json({ message: "Update successfull!" });
        } else {
            res.status(401).json({ message: "Not Authorized!"});
        }
    })
})

module.exports = app;