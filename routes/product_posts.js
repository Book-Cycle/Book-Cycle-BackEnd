const express = require('express');
const router = express.Router();
const pool = require('../DB/db');


const handleError = (res, error, message = '서버 오류가 발생했습니다.', status = 500) => {
    console.error(message, error);
    res.status(status).json({message});
};

// 상품 전체 조회 API
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM product_posts');  // product_posts 테이블 전체 조회
        res.json(rows);  // 조회 결과 반환
    } catch (error) {
        handleError(res, error, '상품 조회 실패');
    }
});


module.exports = router;