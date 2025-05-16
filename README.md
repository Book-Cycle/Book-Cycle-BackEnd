# BackEnd
연암공과대학교 중고서적 백엔드

Book-Cycle-BackEnd
중고서적 거래 웹 서비스의 백엔드 API 서버입니다.
Node.js, Express, MySQL을 기반으로 사용자 관리 및 데이터베이스 연동 기능을 제공합니다.

주요 기능
사용자 목록 조회 (GET /users)

사용자 데이터 여러 개 또는 단일 등록 (POST /users)

특정 사용자 삭제 (DELETE /users/:user_id)

MySQL 연결 풀(Pool) 관리 및 효율적 쿼리 처리

기술 스택
Node.js

Express.js

MySQL (mysql2)

dotenv (환경 변수 관리)

설치 및 실행
bash
복사
편집
# 저장소 클론
git clone https://github.com/yourusername/Book-Cycle-BackEnd.git
cd Book-Cycle-BackEnd

# 의존성 설치
npm install

# 환경 변수 설정
# .env 파일 생성 후 MySQL 접속 정보 작성
# USER=your_mysql_user
# PASSWORD=your_mysql_password

# 서버 실행
npm start
API 명세
사용자 조회
URL: /users

Method: GET

Response: 사용자 배열 JSON

사용자 등록
URL: /users

Method: POST

Request Body:

단일 객체 또는 배열 형태로 사용자 데이터

json
복사
편집
[
  {
    "name": "홍길동",
    "id": "hong",
    "password": "password123"
  },
  ...
]
Response: 등록 성공 메시지 및 등록 건수

사용자 삭제
URL: /users/:user_id

Method: DELETE

Response: 삭제 성공 메시지

환경 변수 (.env)
변수명	설명
USER	MySQL 사용자 이름
PASSWORD	MySQL 비밀번호

프로젝트 구조
bash
복사
편집
Book-Cycle-BackEnd/
├── DB/
│   └── db.js               # MySQL 연결 및 풀 설정
├── routes/
│   └── users.js            # 사용자 API 라우터
├── app.js                  # Express 앱 설정
├── index.js                # 서버 실행 파일
├── package.json
└── README.md
참고 사항
데이터베이스 BookCycle과 users 테이블이 사전에 생성되어 있어야 합니다.

사용자 테이블 예시:

sql
복사
편집
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  id VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);
