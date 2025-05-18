const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../DB/db');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
    const { id, password } = req.body;

    try {
        const [rows] = await pool.promise().query(`SELECT * FROM users WHERE id = ?`, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: '사용자 없음' });
        }

        const user = rows[0];
        console.log('DB 비밀번호 해시:', user.password);  // 필드명 맞는지 꼭 확인
        console.log('입력한 비밀번호:', password);

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: '비밀번호 틀림' });

        const token = jwt.sign(
            { USER_ID: user.USER_ID, NAME: user.NAME },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: '로그인 성공', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류' });
    }
});



module.exports = router;