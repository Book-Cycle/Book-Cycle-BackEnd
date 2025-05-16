const express = require('express');
const router = express.Router();
const pool = require('../DB/db');

const handleError = (res, error, message = '서버 오류가 발생했습니다.', status = 500) => {
  console.error(message, error);
  res.status(status).json({ message });
};

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    handleError(res, error, '사용자 조회 실패');
  }
});

router.post('/', async (req, res) => {
  let users = req.body;
  if (!users || (Array.isArray(users) && users.length === 0)) {
    return res.status(400).json({ message: '사용자 데이터가 필요합니다.' });
  }
  if (!Array.isArray(users)) users = [users];

  const values = users.map(({ name, id, password }) => [name, id, password]);

  try {
    const [result] = await pool.promise().query(
        'INSERT INTO users (name, id, password) VALUES ?',
        [values]
    );

    res.status(201).json({
      message: `${result.affectedRows}명의 사용자가 등록되었습니다.`,
      insertedCount: result.affectedRows,
      insertedFirstId: result.insertId,
    });
  } catch (error) {
    handleError(res, error, '사용자 등록 실패');
  }
});

router.delete('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const [result] = await pool.promise().query(
        'DELETE FROM users WHERE user_id = ?',
        [user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '삭제할 사용자가 없습니다.' });
    }

    res.json({ message: `${result.affectedRows}명의 사용자가 삭제되었습니다.` });
  } catch (error) {
    handleError(res, error, '사용자 삭제 실패');
  }
});

module.exports = router;
