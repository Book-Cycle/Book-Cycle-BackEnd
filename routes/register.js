const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../DB/db');
const router = express.Router();

router.post('/', async (req, res) => {
    const {name, id, password} = req.body;  // 소문자로 통일

    try {
        // ID 중복 확인
        const [rows] = await pool.promise().query('SELECT * FROM users WHERE id = ?', [id]);
        if (rows.length > 0) {
            return res.status(400).send('이미 존재하는 ID입니다.');
        }

        // 비밀번호 해싱
        const hashed = await bcrypt.hash(password, 10);  // 배열 X, 그냥 문자열

        // 사용자 정보 DB 저장
        await pool.promise().query(
            'INSERT INTO users (name, id, password) VALUES (?, ?, ?)',
            [name, id, hashed]
        );

        res.status(201).send('회원가입 성공');
    } catch (err) {
        console.error(err);
        res.status(500).send('서버 오류');
    }
});

module.exports = router;
