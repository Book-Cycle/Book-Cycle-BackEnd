-- 회원 테이블 생성
CREATE TABLE users (
  user_id    NUMBER PRIMARY KEY,
  username   VARCHAR2(50) UNIQUE NOT NULL,
  password   VARCHAR2(100) NOT NULL,
  email      VARCHAR2(100),
  created_at DATE DEFAULT SYSDATE
);

-- 책 테이블 생성 (외래 키 제약 조건 수정)
CREATE TABLE books (
  book_id     NUMBER PRIMARY KEY,
  title       VARCHAR2(100),
  author      VARCHAR2(100),
  price       NUMBER,
  seller_id   NUMBER,
  status      VARCHAR2(20),
  posted_at   DATE DEFAULT SYSDATE,
  CONSTRAINT fk_books_seller_id FOREIGN KEY (seller_id) REFERENCES users(user_id)
);

-- 거래 테이블 생성 (외래 키 제약 조건 수정)
CREATE TABLE transactions (
  transaction_id   NUMBER PRIMARY KEY,
  book_id          NUMBER,
  buyer_id         NUMBER,
  transaction_date DATE DEFAULT SYSDATE,
  CONSTRAINT fk_transactions_book_id FOREIGN KEY (book_id) REFERENCES books(book_id),
  CONSTRAINT fk_transactions_buyer_id FOREIGN KEY (buyer_id) REFERENCES users(user_id)
);
