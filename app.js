const express = require('express');
const app = express();

const usersRouter = require('./routes/users');

app.use(express.json());
app.use('/api/users', usersRouter);

app.use(express.static('public'));

app.get('/api/data', (req, res) => {
    res.json({message: '데이터 응답'});
});

module.exports = app;
