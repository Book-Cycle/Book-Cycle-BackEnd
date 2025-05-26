const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../DB/db');
const router = express.Router();

router.post('/', async (req, res) => {
    const users = req.body; // 배열로 받음

    if (!Array.isArray(users)) {
        return res.status(400).send('배열 형식의 사용자 데이터가 필요합니다.');
    }

    try {
        for (const user of users) {
            const { name, id, password } = user;

            // 필수값 확인
            if (!name || !id || !password) {
                return res.status(400).send(`필수 항목 누락: name, id, password가 필요합니다.`);
            }

            // ID 중복 확인
            const [rows] = await pool.promise().query('SELECT * FROM users WHERE id = ?', [id]);
            if (rows.length > 0) {
                return res.status(400).send(`이미 존재하는 ID입니다: ${id}`);
            }

            // 비밀번호 해싱
            const hashed = await bcrypt.hash(password, 10);

            // 사용자 정보 삽입
            await pool.promise().query(
                'INSERT INTO users (name, id, password) VALUES (?, ?, ?)',
                [name, id, hashed]
            );
        }

        res.status(201).send('모든 사용자 등록 성공');
    } catch (err) {
        console.error(err);
        res.status(500).send('서버 오류');
    }
});

module.exports = router;
