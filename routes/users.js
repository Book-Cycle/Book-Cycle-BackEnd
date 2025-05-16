const express = require('express');
const router = express.Router();
const pool = require('../DB/db');

//에러 로그 출력 후 클라이언트에 에러 메시지 응답
const handleError = (res, error, message = '서버 오류가 발생했습니다.', status = 500) => {
    console.error(message, error);
    res.status(status).json({message});
};


// 사용자 전체 조회 API
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM users');  // users 테이블 전체 조회
        res.json(rows);  // 조회 결과 반환
    } catch (error) {
        handleError(res, error, '사용자 조회 실패');
    }
});


// 사용자 여러 명 등록 API
router.post('/', async (req, res) => {
    let users = req.body;  // 요청 본문에 사용자 정보 배열 또는 객체를 받음
    if (!users || (Array.isArray(users) && users.length === 0)) {
        return res.status(400).json({message: '사용자 데이터가 필요합니다.'});
    }
    if (!Array.isArray(users)) users = [users];  // 단일 객체도 배열로 변환

    // 사용자 정보 중 name, id, password만 뽑아 이차원 배열 생성
    const values = users.map(({name, id, password}) => [name, id, password]);

    try {
        // 다중 행 INSERT 쿼리 실행
        const [result] = await pool.promise().query('INSERT INTO users (name, id, password) VALUES ?', [values]);

        res.status(201).json({
            message: `${result.affectedRows}명의 사용자가 등록되었습니다.`,
            insertedCount: result.affectedRows,
            insertedFirstId: result.insertId,
        });
    } catch (error) {
        handleError(res, error, '사용자 등록 실패');
    }
});


// 특정 사용자 삭제 API
router.delete('/:user_id', async (req, res) => {
    const {user_id} = req.params;

    try {
        const [result] = await pool.promise().query('DELETE FROM users WHERE user_id = ?', [user_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: '삭제할 사용자가 없습니다.'});
        }

        res.json({message: `${result.affectedRows}명의 사용자가 삭제되었습니다.`});
    } catch (error) {
        handleError(res, error, '사용자 삭제 실패');
    }
});

// 특정 사용자 정보 수정 API
router.put('/:user_id', async (req, res) => {
    const {user_id} = req.params;
    const {name, id, password} = req.body;

    if (!name && !id && !password) {
        return res.status(400).json({message: '수정할 데이터가 필요합니다.'});
    }

    const fields = [];
    const values = [];

    if (name) {
        fields.push('name = ?');
        values.push(name);
    }
    if (id) {
        fields.push('id = ?');
        values.push(id);
    }
    if (password) {
        fields.push('password = ?');
        values.push(password);
    }

    values.push(user_id);

    const sql = `UPDATE users
                 SET ${fields.join(', ')}
                 WHERE user_id = ?`;

    try {
        const [result] = await pool.promise().query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: '수정할 사용자가 없습니다.'});
        }

        res.json({message: '사용자 정보가 수정되었습니다.'});
    } catch (error) {
        handleError(res, error, '사용자 정보 수정 실패');
    }
});

module.exports = router;
