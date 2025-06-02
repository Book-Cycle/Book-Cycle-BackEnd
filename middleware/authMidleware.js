const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
    console.log('[authMiddleware] 실행됨');
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.warn('인증 실패: 토큰이 없습니다.');
        return res.status(401).json({ message: '인증 토큰이 없습니다. 로그인이 필요합니다.' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        console.warn('인증 실패: 잘못된 토큰 형식');
        return res.status(401).json({ message: '토큰 형식이 잘못되었습니다. "Bearer 토큰" 형식으로 보내주세요.' });
    }

    const token = parts[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // 인증 정보 저장
        next();
    } catch (err) {
        console.error('토큰 검증 오류:', err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: '토큰이 만료되었습니다. 다시 로그인해주세요.' });
        }
        return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
}

module.exports = authMiddleware;