# 설치 및 실행 가이드

## 시스템 요구사항

- Node.js 18.x 이상
- MongoDB 6.x 이상
- npm 또는 yarn

## 1. 프로젝트 설정

### 1.1 저장소 클론
```bash
git clone <repository-url>
cd roommate-matching-service
```

### 1.2 의존성 설치
```bash
npm install
```

### 1.3 환경 변수 설정
`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 필요한 값을 설정합니다.

```bash
cp .env.example .env
```

`.env` 파일 예시:
```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Database
MONGODB_URI=mongodb://localhost:27017/roommate-matching

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_REFRESH_EXPIRES_IN=30d

# File Upload
UPLOAD_LOCATION=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp

# CORS
CORS_ORIGIN=http://localhost:3001

# Socket.IO
SOCKET_CORS_ORIGIN=http://localhost:3001
```

## 2. MongoDB 설정

### 2.1 로컬 MongoDB 설치 및 실행

#### macOS (Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Ubuntu/Debian
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Windows
MongoDB 공식 사이트에서 설치 프로그램 다운로드
https://www.mongodb.com/try/download/community

### 2.2 MongoDB Atlas (클라우드) 사용

1. https://www.mongodb.com/cloud/atlas 접속
2. 무료 클러스터 생성
3. 데이터베이스 사용자 생성
4. Network Access에서 IP 주소 허용
5. Connection String 복사하여 `.env`의 `MONGODB_URI`에 설정

예시:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/roommate-matching?retryWrites=true&w=majority
```

## 3. 업로드 디렉토리 생성

```bash
mkdir uploads
```

## 4. 애플리케이션 실행

### 4.1 개발 모드
```bash
npm run start:dev
```

서버가 실행되면 다음 주소로 접속 가능:
- API: http://localhost:3000/api
- WebSocket: ws://localhost:3000

### 4.2 프로덕션 빌드
```bash
npm run build
npm run start:prod
```

### 4.3 디버그 모드
```bash
npm run start:debug
```

## 5. 데이터베이스 초기 데이터 설정 (선택사항)

### 5.1 MongoDB Compass 사용
1. MongoDB Compass 설치: https://www.mongodb.com/products/compass
2. MongoDB에 연결
3. `roommate-matching` 데이터베이스 생성
4. 필요한 컬렉션 생성 (users, posts, properties 등)

### 5.2 MongoDB Shell 사용
```bash
mongosh

use roommate-matching

# 인덱스 생성 예시
db.users.createIndex({ email: 1 }, { unique: true })
db.properties.createIndex({ city: 1, district: 1 })
db.posts.createIndex({ createdAt: -1 })
```

## 6. 테스트

### 6.1 단위 테스트
```bash
npm run test
```

### 6.2 E2E 테스트
```bash
npm run test:e2e
```

### 6.3 테스트 커버리지
```bash
npm run test:cov
```

## 7. API 테스트

### 7.1 Postman 사용
1. Postman 설치: https://www.postman.com/downloads/
2. API_GUIDE.md를 참고하여 요청 테스트

### 7.2 cURL 사용

#### 회원가입 테스트
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@university.ac.kr",
    "password": "password123",
    "name": "테스트",
    "phoneNumber": "010-1234-5678",
    "university": "서울대학교"
  }'
```

#### 로그인 테스트
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@university.ac.kr",
    "password": "password123"
  }'
```

## 8. 프론트엔드 연동

### 8.1 React 예시
```javascript
// API 클라이언트 설정
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// 인터셉터로 토큰 자동 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 로그인 함수
async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('accessToken', response.data.accessToken);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  return response.data;
}

// 매물 목록 조회
async function getProperties(filters) {
  const response = await api.get('/properties', { params: filters });
  return response.data;
}
```

### 8.2 Socket.IO 클라이언트 연동
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: localStorage.getItem('accessToken')
  }
});

socket.on('connect', () => {
  console.log('Connected to chat server');
  
  // 채팅방 입장
  socket.emit('join', {
    userId: currentUserId,
    roomId: chatRoomId
  });
});

socket.on('newMessage', (message) => {
  // 새 메시지 처리
  console.log('New message:', message);
});

// 메시지 전송
function sendMessage(content) {
  socket.emit('sendMessage', {
    roomId: chatRoomId,
    userId: currentUserId,
    content: content,
    type: 'TEXT'
  });
}
```

## 9. 배포

### 9.1 PM2로 배포 (권장)
```bash
# PM2 설치
npm install -g pm2

# 프로덕션 빌드
npm run build

# PM2로 실행
pm2 start dist/main.js --name roommate-service

# 자동 재시작 설정
pm2 startup
pm2 save

# 로그 확인
pm2 logs roommate-service

# 재시작
pm2 restart roommate-service

# 중지
pm2 stop roommate-service
```

### 9.2 Docker로 배포
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

```bash
# Docker 이미지 빌드
docker build -t roommate-service .

# Docker 컨테이너 실행
docker run -d -p 3000:3000 --env-file .env roommate-service
```

### 9.3 Nginx 리버스 프록시 설정
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    location /uploads {
        proxy_pass http://localhost:3000;
    }
}
```

## 10. 문제 해결

### MongoDB 연결 오류
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
해결: MongoDB가 실행 중인지 확인
```bash
# macOS
brew services list

# Linux
sudo systemctl status mongod

# 재시작
sudo systemctl restart mongod
```

### 포트 충돌
```
Error: listen EADDRINUSE: address already in use :::3000
```
해결: 포트 변경 또는 기존 프로세스 종료
```bash
# 포트 사용 중인 프로세스 확인
lsof -i :3000

# 프로세스 종료
kill -9 <PID>
```

### 업로드 디렉토리 권한 오류
```bash
chmod 755 uploads
```

## 11. 개발 팁

### 11.1 자동 재시작 (Nodemon)
```bash
npm install -g nodemon
nodemon --watch src --exec "npm run start:dev"
```

### 11.2 코드 포맷팅
```bash
npm run format
```

### 11.3 Linting
```bash
npm run lint
```

### 11.4 로깅
개발 환경에서는 자세한 로그가 콘솔에 출력됩니다.
프로덕션 환경에서는 Winston 등의 로거를 추가하는 것을 권장합니다.

## 12. 추가 기능 구현 가이드

### 12.1 이메일 발송 (Nodemailer)
```bash
npm install nodemailer
```

### 12.2 SMS 발송 (Twilio 또는 국내 서비스)
```bash
npm install twilio
```

### 12.3 결제 연동 (토스페이먼츠)
```bash
npm install @tosspayments/payment-sdk
```

### 12.4 Redis 캐싱
```bash
npm install @nestjs/redis redis
```

## 도움이 필요하신가요?

문제가 발생하면:
1. 로그 확인: `pm2 logs` 또는 콘솔 출력
2. MongoDB 연결 상태 확인
3. 환경 변수 설정 확인
4. API_GUIDE.md 참고
5. Issue 등록
