const express = require('express');
const app = express();

const usersRouter = require('./routes/users');  // users 라우터 불러오기
const productRouter = require('./routes/product_posts');

app.use(express.json());
app.use('/api/users', usersRouter);  // /api/users 경로에 usersRouter 연결
app.use('/api/product_posts', productRouter);


app.use(express.static('public'));

app.get('/api/data', (req, res) => {
    res.json({message: '데이터 응답'});
});

module.exports = app;
