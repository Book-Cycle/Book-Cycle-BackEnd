const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', require('./routes/users'));
app.use('/api/product_posts', require('./routes/product_posts'));
app.use('/api/login', require('./routes/login'));
app.use('/api/register', require('./routes/register'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/upload/banner', require('./routes/banner'));

// 에러 핸들링
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: '파일 크기가 10MB를 초과했습니다.' });
    }
    next(err);
});

module.exports = app;