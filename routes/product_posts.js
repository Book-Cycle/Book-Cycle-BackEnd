const express = require('express');
const router = express.Router();
const pool = require('../DB/db');

const handleError = (res, error, message = '서버 오류가 발생했습니다.', status = 500) => {
    console.error(message, error);
    res.status(status).json({ message });
};

// 상품 전체 조회 API
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM product_posts');
        res.json(rows);
    } catch (error) {
        handleError(res, error, '상품 조회 실패');
    }
});

// 상품 다중 등록 API (병렬 처리)
router.post('/bulk', async (req, res) => {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: '유효한 상품 배열이 필요합니다.' });
    }

    let connection;
    try {
        connection = await pool.promise().getConnection();
        await connection.beginTransaction();

        const insertQuery = `
            INSERT INTO product_posts (title, price, img, user_id, date, text)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        // 입력 검증 함수
        const validateProduct = (product) => {
            const requiredFields = ['title', 'price', 'img', 'user_id', 'date', 'text'];
            for (const field of requiredFields) {
                // price는 0도 유효하므로 null/undefined 체크
                if (field === 'price' ? product[field] == null : !product[field]) {
                    return field;
                }
            }
            return null;
        };

        // 각 상품별 유효성 체크
        for (const [idx, product] of products.entries()) {
            const missingField = validateProduct(product);
            if (missingField) {
                throw new Error(`상품 ${idx + 1}의 '${missingField}' 값이 누락되었습니다.`);
            }
        }

        // 병렬 insert 실행 (속도 개선)
        await Promise.all(
            products.map(product =>
                connection.query(insertQuery, [
                    product.title,
                    product.price,
                    product.img,
                    product.user_id,
                    product.date,
                    product.text
                ])
            )
        );

        await connection.commit();
        res.status(201).json({ message: `${products.length}개의 상품이 등록되었습니다.` });
    } catch (error) {
        if (connection) await connection.rollback();
        handleError(res, error, '상품 다중 등록 실패');
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;
