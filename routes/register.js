const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../DB/db');
const router = express.Router();

router.post('/', async (req, res) => {
    let users = req.body;

    // 단일 객체인 경우 배열로 변환
    if (!Array.isArray(users)) {
        users = [users];
    }

    const results = [];

    for (const user of users) {
        const { name, id, password } = user;

        // 필수 항목 확인
        if (!name || !id || !password) {
            results.push({ id: id || null, status: 'error', message: '필수 항목 누락: name, id, password가 필요합니다.' });
            continue;
        }

        try {
            // ID 중복 확인
            const [rows] = await pool.promise().query('SELECT * FROM users WHERE id = ?', [id]);
            if (rows.length > 0) {
                results.push({ id, status: 'error', message: '이미 존재하는 ID입니다.' });
                continue;
            }

            // 비밀번호 해싱
            const hashed = await bcrypt.hash(password, 10);

            // 사용자 정보 삽입
            await pool.promise().query(
                'INSERT INTO users (name, id, password) VALUES (?, ?, ?)',
                [name, id, hashed]
            );

            results.push({ id, status: 'success' });
        } catch (err) {
            console.error(`Error for ID ${id}:`, err);
            results.push({ id, status: 'error', message: '서버 오류' });
        }
    }

    // 모든 결과 반환
    res.status(207).json(results); // 207: Multi-Status
});

module.exports = router;
