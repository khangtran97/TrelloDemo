const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const MongoStore = require('connect-mongo')(session);

const CategSchema = require('./models/category');
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
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTION"
    );
    next();
});

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}))

UserSchema.methods.comparePassword = function(plaintext, callback) {
    return callback(null, bcrypt.compareSync(plaintext, this.password));
};

app.post("/register", async (req, res) => {
    UserModel.findOne({userName: req.body.password}, (err, user) => {
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

app.route('/login').post((req, res) => {
    UserModel.findOne({userName: req.body.userName}).exec((err, user) => {
        if(!user) {
            return res.status(400).send({ 
                message: "The username does not exist" 
            });
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(result === true) {
                req.session.user = user;
                return res.status(201).json({
                    user: user,
                    message: 'Login succesfull!'
                })                
            }
            if(result === false) {
                return res.status(400).send({
                    message: 'Password are incorrect'
                })
            }
        });
    });
});

module.exports = app;