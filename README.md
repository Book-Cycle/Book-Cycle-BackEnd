# 📚 Book-Cycle-BackEnd

**연암공과대학교 중고서적 거래 웹 서비스의 백엔드 API 서버입니다.**  
Node.js, Express, MySQL, WebSocket 기반으로 사용자 관리와 실시간 채팅 기능을 제공합니다.


## 주요 기능

- 사용자 목록 조회: `GET /api/users`
- 사용자 등록 (단일/다중): `POST /api/users`
- 사용자 정보 수정: `PUT /api/users/:user_id`
- 특정 사용자 삭제: `DELETE /api/users/:user_id`
- 비밀번호 해시 처리 (bcrypt 적용)
- WebSocket 기반 실시간 메시지 송수신
- MySQL 연결 풀을 통한 효율적 DB 접근


## 🛠 기술 스택

- **Node.js** – 런타임
- **Express.js** – RESTful API 서버 프레임워크
- **MySQL + mysql2** – 데이터베이스 및 쿼리 실행
- **bcrypt** – 비밀번호 해시 처리
- **WebSocket (ws)** – 실시간 양방향 통신
- **dotenv** – 환경 변수 설정


## ⚙️ 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/yourusername/Book-Cycle-BackEnd.git
cd Book-Cycle-BackEnd

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
# 루트 디렉터리에 .env 파일 생성
```


## .env 예시

```bash
USER=your_mysql_user
PASSWORD=your_mysql_password
HOST=localhost
PORT=3306
SERVER_PORT=3001
```


## 향후 추가 예정

- 중고서적 등록/검색/거래 기능
- 사용자 인증(JWT 로그인 등)
- 거래 내역/리뷰 기능
- 관리자 페이지 및 로그 기록


