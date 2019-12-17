const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const User = require('./models/user');

const app = express();

mongoose.connect("mongodb+srv://khang_1:5HyIHdbXVJp5eCYp@cluster0-8f4qo.mongodb.net/node-angular?retryWrites=true&w=majority")
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
app.post("/register", (req, res, next) => {
    const user = new User({
        userName: req.body.userName,
        password: req.body.password
    });
    user.save().then(createdUser => {
        res.status(201).json({
            message: 'User added successfully',
            userId: createdUser._id
        });
    });    
});

app.get('/register', (req, res, next) => {
    User.find().then(documents => {
        res.status(200).json({
            message: 'User fetched successfully!',
            users: documents
        });
    });    
});

module.exports = app;