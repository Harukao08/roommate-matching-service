# API 사용 가이드

## Base URL
```
http://localhost:3000/api
```

## 인증

모든 보호된 엔드포인트는 Authorization 헤더에 JWT 토큰이 필요합니다.

```
Authorization: Bearer <your_jwt_token>
```

## API 엔드포인트

### 1. 인증 (Auth)

#### 회원가입
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@university.ac.kr",
  "password": "password123",
  "name": "홍길동",
  "phoneNumber": "010-1234-5678",
  "university": "서울대학교",
  "studentId": "2020123456",
  "gender": "MALE"
}
```

#### 로그인
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@university.ac.kr",
  "password": "password123"
}

Response:
{
  "user": {
    "id": "...",
    "email": "student@university.ac.kr",
    "name": "홍길동",
    "role": "STUDENT"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 토큰 갱신
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

#### 로그아웃
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### 2. 커뮤니티 (Posts)

#### 게시글 목록 조회 (비회원 가능)
```http
GET /api/posts?page=1&limit=20&category=FIND_ROOMMATE
```

#### 게시글 상세 조회 (비회원 가능)
```http
GET /api/posts/:id
```

#### 게시글 작성 (회원 전용)
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "같이 살 룸메이트 구합니다",
  "content": "서울대 근처에서 같이 살 룸메이트를 찾습니다...",
  "category": "FIND_ROOMMATE",
  "preferredGender": "FEMALE",
  "budget": 500000,
  "moveInDate": "2025-03-01",
  "tags": ["깔끔", "조용", "비흡연"]
}
```

#### 게시글 수정 (회원 전용)
```http
PATCH /api/posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "수정된 제목",
  "content": "수정된 내용"
}
```

#### 게시글 삭제 (회원 전용)
```http
DELETE /api/posts/:id
Authorization: Bearer <token>
```

#### 게시글 좋아요 (회원 전용)
```http
POST /api/posts/:id/like
Authorization: Bearer <token>
```

### 3. 매물 (Properties)

#### 매물 목록 조회 (비회원 가능)
```http
GET /api/properties?page=1&limit=20&city=서울&district=관악구&minPrice=300000&maxPrice=700000
```

Parameters:
- page: 페이지 번호 (기본값: 1)
- limit: 페이지당 항목 수 (기본값: 20)
- city: 도시
- district: 구/군
- propertyType: 매물 유형 (ONE_ROOM, TWO_ROOM, SHARE_HOUSE, OFFICETEL, APARTMENT)
- minPrice: 최소 월세
- maxPrice: 최대 월세
- minArea: 최소 면적
- maxArea: 최대 면적
- sortBy: 정렬 기준 (기본값: createdAt)
- sortOrder: 정렬 순서 (asc, desc - 기본값: desc)

#### 매물 상세 조회 (비회원 가능)
```http
GET /api/properties/:id
```

#### 매물 검색 (비회원 가능)
```http
GET /api/properties/search?q=서울대입구역
```

#### 매물 등록 (회원 전용)
```http
POST /api/properties
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "서울대입구역 도보 5분 원룸",
  "description": "깨끗하고 조용한 원룸입니다...",
  "propertyType": "ONE_ROOM",
  "rentType": "MONTHLY",
  "address": "서울특별시 관악구 봉천동",
  "city": "서울",
  "district": "관악구",
  "detailAddress": "123-45",
  "coordinates": {
    "lat": 37.4813,
    "lng": 126.9522
  },
  "deposit": 5000000,
  "monthlyRent": 500000,
  "maintenanceFee": 50000,
  "area": 20,
  "roomCount": 1,
  "bathroomCount": 1,
  "floor": 3,
  "totalFloor": 5,
  "availableFrom": "2025-03-01",
  "options": ["에어컨", "세탁기", "냉장고", "인터넷"],
  "images": ["/uploads/image1.jpg", "/uploads/image2.jpg"],
  "isPetAllowed": false,
  "isSmokingAllowed": false,
  "maxOccupants": 1,
  "nearbyUniversities": ["서울대학교"],
  "nearbySubways": ["서울대입구역"]
}
```

#### 매물 수정 (회원 전용)
```http
PATCH /api/properties/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "monthlyRent": 480000,
  "status": "AVAILABLE"
}
```

#### 매물 삭제 (회원 전용)
```http
DELETE /api/properties/:id
Authorization: Bearer <token>
```

#### 내 매물 조회 (회원 전용)
```http
GET /api/properties/my
Authorization: Bearer <token>
```

#### 찜하기/찜 취소 (회원 전용)
```http
POST /api/properties/:id/wishlist
Authorization: Bearer <token>
```

#### 찜 목록 조회 (회원 전용)
```http
GET /api/properties/wishlist
Authorization: Bearer <token>
```

### 4. 채팅 (Chat)

#### 채팅방 생성 (회원 전용)
```http
POST /api/chat/rooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "participants": ["userId1", "userId2"],
  "propertyId": "propertyId" // 선택사항
}
```

#### 채팅방 목록 조회 (회원 전용)
```http
GET /api/chat/rooms
Authorization: Bearer <token>
```

#### 채팅방 상세 조회 (회원 전용)
```http
GET /api/chat/rooms/:id
Authorization: Bearer <token>
```

#### 메시지 내역 조회 (회원 전용)
```http
GET /api/chat/rooms/:id/messages?page=1&limit=50
Authorization: Bearer <token>
```

#### 모두 읽음 처리 (회원 전용)
```http
POST /api/chat/rooms/:id/read
Authorization: Bearer <token>
```

### 5. 파일 업로드 (Uploads)

#### 단일 파일 업로드 (회원 전용)
```http
POST /api/uploads/single
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <image_file>

Response:
{
  "filename": "uuid.jpg",
  "url": "/uploads/uuid.jpg",
  "size": 123456,
  "mimetype": "image/jpeg"
}
```

#### 다중 파일 업로드 (회원 전용)
```http
POST /api/uploads/multiple
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: [<image_file1>, <image_file2>, ...]

Response:
[
  {
    "filename": "uuid1.jpg",
    "url": "/uploads/uuid1.jpg",
    "size": 123456,
    "mimetype": "image/jpeg"
  },
  {
    "filename": "uuid2.jpg",
    "url": "/uploads/uuid2.jpg",
    "size": 234567,
    "mimetype": "image/jpeg"
  }
]
```

## WebSocket (실시간 채팅)

### 연결
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### 이벤트

#### 채팅방 입장
```javascript
socket.emit('join', {
  userId: 'your_user_id',
  roomId: 'room_id'
});
```

#### 메시지 전송
```javascript
socket.emit('sendMessage', {
  roomId: 'room_id',
  userId: 'your_user_id',
  content: '안녕하세요',
  type: 'TEXT'
});
```

#### 메시지 수신
```javascript
socket.on('newMessage', (message) => {
  console.log('새 메시지:', message);
});
```

#### 읽음 처리
```javascript
socket.emit('markAsRead', {
  roomId: 'room_id',
  userId: 'your_user_id',
  messageId: 'message_id'
});
```

#### 타이핑 상태
```javascript
socket.emit('typing', {
  roomId: 'room_id',
  userId: 'your_user_id',
  isTyping: true
});

socket.on('userTyping', (data) => {
  console.log('타이핑 중:', data.userId);
});
```

#### 알림 수신
```javascript
socket.on('notification', (notification) => {
  console.log('새 알림:', notification);
});
```

## 에러 응답

```json
{
  "statusCode": 400,
  "message": "에러 메시지",
  "error": "Bad Request"
}
```

일반적인 상태 코드:
- 200: 성공
- 201: 생성 성공
- 400: 잘못된 요청
- 401: 인증 필요
- 403: 권한 없음
- 404: 찾을 수 없음
- 500: 서버 오류
