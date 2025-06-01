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
- 이미지 및 배너 업로드 기능 (Multer 사용, 최대 10MB, 로컬 저장)

## 🛠 기술 스택

- **Node.js** – 런타임
- **Express.js** – RESTful API 서버 프레임워크
- **MySQL + mysql2** – 데이터베이스 및 쿼리 실행
- **bcrypt** – 비밀번호 해시 처리
- **WebSocket (ws)** – 실시간 양방향 통신
- **Multer** – 이미지/배너 파일 업로드 미들웨어
- **dotenv** – 환경 변수 설정

## 이미지/배너 업로드

- Multer 미들웨어를 사용해 로컬 서버의 `uploads/` 폴더에 저장합니다.  
- 업로드 가능한 파일은 JPEG, JPG, PNG, GIF 형식의 이미지입니다.  
- 파일 크기 제한은 최대 10MB로 설정되어 있습니다.  
- 업로드된 파일명은 타임스탬프를 붙여 중복을 방지합니다.  
- `uploads/` 폴더는 버전 관리에서 제외됩니다 (`.gitignore` 적용).

## ⚙️ 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/yourusername/Book-Cycle-BackEnd.git
cd Book-Cycle-BackEnd

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
# 루트 디렉터리에 .env 파일 생성
