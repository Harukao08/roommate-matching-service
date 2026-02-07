# 빠른 시작 가이드 (Quick Start)

이 가이드는 5분 안에 프로젝트를 실행할 수 있도록 도와줍니다.

## 필수 요구사항

- Node.js 18+ 설치
- MongoDB 실행 중

## 1단계: 프로젝트 설정

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env

# .env 파일을 편집기로 열어 MongoDB URI 설정
# MONGODB_URI=mongodb://localhost:27017/roommate-matching
```

## 2단계: MongoDB 실행

### macOS
```bash
brew services start mongodb-community
```

### Ubuntu/Debian
```bash
sudo systemctl start mongod
```

### Windows
MongoDB Compass 또는 서비스에서 시작

## 3단계: 업로드 디렉토리 생성

```bash
mkdir uploads
```

## 4단계: 서버 실행

```bash
npm run start:dev
```

서버가 실행되면 다음 메시지가 표시됩니다:
```
🚀 Application is running on: http://localhost:3000/api
📁 Uploads directory: http://localhost:3000/uploads
```

## 5단계: API 테스트

### 1) 회원가입
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@university.ac.kr",
    "password": "password123",
    "name": "테스트 유저",
    "phoneNumber": "010-1234-5678",
    "university": "서울대학교"
  }'
```

### 2) 로그인
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@university.ac.kr",
    "password": "password123"
  }'
```

응답에서 `accessToken`을 복사하세요.

### 3) 매물 목록 조회 (비회원 가능)
```bash
curl http://localhost:3000/api/properties
```

### 4) 게시글 작성 (회원 전용)
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "룸메이트 구합니다",
    "content": "깔끔하고 조용한 룸메이트를 찾습니다.",
    "category": "FIND_ROOMMATE"
  }'
```

## 다음 단계

### 프론트엔드 개발
`FRONTEND_INTEGRATION.md` 참고

### API 문서 확인
`API_GUIDE.md` 참고

### 자세한 설치 가이드
`INSTALLATION.md` 참고

## 문제 해결

### MongoDB 연결 오류
```bash
# MongoDB 상태 확인
brew services list  # macOS
sudo systemctl status mongod  # Linux

# MongoDB 재시작
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod  # Linux
```

### 포트 충돌 (3000 포트 사용 중)
`.env` 파일에서 포트 변경:
```
PORT=3001
```

### 의존성 설치 오류
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

## 주요 기능 테스트

### 1. 매물 등록
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "서울대입구역 원룸",
    "description": "깨끗한 원룸입니다",
    "propertyType": "ONE_ROOM",
    "rentType": "MONTHLY",
    "address": "서울특별시 관악구",
    "city": "서울",
    "district": "관악구",
    "deposit": 5000000,
    "monthlyRent": 500000,
    "area": 20,
    "roomCount": 1,
    "bathroomCount": 1
  }'
```

### 2. 파일 업로드
```bash
curl -X POST http://localhost:3000/api/uploads/single \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

### 3. WebSocket 채팅 테스트
브라우저 콘솔에서:
```javascript
const socket = io('http://localhost:3000', {
  auth: { token: 'YOUR_ACCESS_TOKEN' }
});

socket.on('connect', () => {
  console.log('Connected!');
  socket.emit('join', { userId: 'YOUR_USER_ID', roomId: 'ROOM_ID' });
});

socket.on('newMessage', (message) => {
  console.log('New message:', message);
});
```

## 개발 팁

### 코드 자동 재시작 (nodemon)
이미 `start:dev`에서 자동 재시작이 활성화되어 있습니다.

### 로그 확인
개발 모드에서는 모든 로그가 콘솔에 출력됩니다.

### 데이터베이스 확인
MongoDB Compass를 사용하여 데이터를 시각적으로 확인할 수 있습니다:
```
mongodb://localhost:27017/roommate-matching
```

## 프로덕션 배포

### PM2로 배포
```bash
npm run build
pm2 start dist/main.js --name roommate-service
```

### Docker로 배포
```bash
docker build -t roommate-service .
docker run -d -p 3000:3000 --env-file .env roommate-service
```

## 추가 리소스

- [API 가이드](API_GUIDE.md) - 모든 API 엔드포인트
- [설치 가이드](INSTALLATION.md) - 상세한 설치 및 설정
- [프론트엔드 연동](FRONTEND_INTEGRATION.md) - React/React Native 연동
- [프로젝트 구조](PROJECT_STRUCTURE.md) - 전체 구조 설명

## 도움이 필요하신가요?

- GitHub Issues 등록
- 문서 확인
- 로그 분석

즐거운 개발 되세요! 🚀
