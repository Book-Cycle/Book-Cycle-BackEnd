const express = require('express');
const app = express();
const path = require('path');
const authMiddleware = require('./middleware/authMidleware');  // 경로 및 이름 수정

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 인증 필요 없는 라우트들
app.use('/api/users', require('./routes/users'));
app.use('/api/product_posts', require('./routes/product_posts'));
app.use('/api/login', require('./routes/login'));
app.use('/api/register', require('./routes/register'));

// 인증 미들웨어 적용한 업로드 라우트
app.use('/api/upload', authMiddleware, require('./routes/upload'));
app.use('/api/upload/banner', authMiddleware, require('./routes/banner'));

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: '파일 크기가 10MB를 초과했습니다.' });
    }
    next(err);
});

module.exports = app;
