const express = require('express');

const app = express();

app.use('/api/register', (req, res, next) => {
    const user = [
        { 
          id: 'fsadfw4324', 
          userName: 'khang@gmail.com', 
          password: 'khang9999'
        }
    ];
    res.status(200).json({
        message: 'User fetched succesfully!',
        user: user
    });
});

module.exports = app;