const express = require('express');
const app = express();

const usersRouter = require('./routes/users');  // users 라우터 불러오기
const productRouter = require('./routes/product_posts');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

app.use(express.json());

// /api/users 경로에 usersRouter 연결
app.use('/api/users', usersRouter);
app.use('/api/product_posts', productRouter);
app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);



app.use(express.static('public'));

app.get('/api/data', (req, res) => {
    res.json({message: '데이터 응답'});
});

module.exports = app;
