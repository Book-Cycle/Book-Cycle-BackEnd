# BackEnd
연암공과대학교 중고서적 백엔드

# Book-Cycle-BackEnd

중고서적 거래 웹 서비스의 백엔드 API 서버입니다.  
Node.js, Express, MySQL을 기반으로 사용자 관리 및 데이터베이스 연동 기능을 제공합니다.

##

## 주요 기능

- 사용자 목록 조회 (GET `/users`)
- 사용자 데이터 여러 개 또는 단일 등록 (POST `/users`)
- 특정 사용자 삭제 (DELETE `/users/:user_id`)
- MySQL 연결 풀(Pool) 관리 및 효율적 쿼리 처리

##

## 기술 스택

- Node.js
- Express.js
- MySQL (mysql2)
- dotenv (환경 변수 관리)

##

## 설치 및 실행

```bash
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

