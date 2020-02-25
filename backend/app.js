const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const categoriesRoutes = require('./routes/category');
const usersRoutes = require('./routes/user');
const cardsRoutes = require('./routes/card');
const commentRoutes = require('./routes/comment');
const voteRoutes = require('./routes/vote');
const likeRoutes = require('./routes/like');


const app = express();
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

app.use('/category', categoriesRoutes);
app.use('/user', usersRoutes);
app.use('/card', cardsRoutes);
app.use('/comment', commentRoutes);
app.use('/vote', voteRoutes);
app.use('/like', likeRoutes);

module.exports = app;
