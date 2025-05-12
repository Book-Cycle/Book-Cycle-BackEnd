// app.js
const express = require('express');
const getConnection = require('./db');

const app = express();  // Express 앱 인스턴스 생성

app.use(express.json());

// 기본 라우터 예시
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// 책 목록 불러오기
app.get('/books', async (req, res) => {
  const conn = await getConnection();
  try {
    const result = await conn.execute('SELECT * FROM books');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    await conn.close();
  }
});

// 책 등록
app.post('/books', async (req, res) => {
  const { title, author, price, seller_id } = req.body;
  const conn = await getConnection();
  try {
    await conn.execute(
      `INSERT INTO books (book_id, title, author, price, seller_id, status)
       VALUES (books_seq.NEXTVAL, :title, :author, :price, :seller_id, '판매중')`,
      { title, author, price, seller_id },
      { autoCommit: true }
    );
    res.send('책 등록 성공');
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    await conn.close();
  }
});

module.exports = app;
