# 프로젝트 구조

```
roommate-matching-service/
├── README.md                           # 프로젝트 개요 및 기능 설명
├── API_GUIDE.md                        # API 엔드포인트 사용 가이드
├── INSTALLATION.md                     # 설치 및 실행 가이드
├── FRONTEND_INTEGRATION.md             # 프론트엔드 연동 예제
├── package.json                        # 프로젝트 의존성 및 스크립트
├── tsconfig.json                       # TypeScript 설정
├── .env.example                        # 환경 변수 예제
├── create-modules.sh                   # 모듈 생성 스크립트
│
├── src/
│   ├── main.ts                         # 애플리케이션 진입점
│   ├── app.module.ts                   # 루트 모듈
│   │
│   ├── auth/                           # 인증/인가 모듈
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts             # 회원가입, 로그인, JWT 관리
│   │   ├── auth.controller.ts          # 인증 API 엔드포인트
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts         # JWT 인증 전략
│   │   │   └── local.strategy.ts       # Local 인증 전략
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts       # JWT 인증 가드
│   │   │   └── local-auth.guard.ts     # Local 인증 가드
│   │   ├── decorators/
│   │   │   └── public.decorator.ts     # Public API 데코레이터
│   │   └── dto/
│   │       ├── register.dto.ts         # 회원가입 DTO
│   │       ├── login.dto.ts            # 로그인 DTO
│   │       └── refresh-token.dto.ts    # 토큰 갱신 DTO
│   │
│   ├── users/                          # 회원 관리 모듈
│   │   ├── users.module.ts
│   │   ├── users.service.ts            # 회원 CRUD 서비스
│   │   ├── users.controller.ts         # 회원 API 엔드포인트 (예정)
│   │   └── schemas/
│   │       └── user.schema.ts          # 회원 데이터 스키마
│   │
│   ├── posts/                          # 커뮤니티 게시글 모듈
│   │   ├── posts.module.ts
│   │   ├── posts.service.ts            # 게시글 CRUD, 좋아요
│   │   ├── posts.controller.ts         # 게시글 API 엔드포인트
│   │   └── schemas/
│   │       └── post.schema.ts          # 게시글 데이터 스키마
│   │
│   ├── comments/                       # 댓글 모듈 (구현 예정)
│   │   └── comments.module.ts
│   │
│   ├── properties/                     # 매물 관리 모듈
│   │   ├── properties.module.ts
│   │   ├── properties.service.ts       # 매물 CRUD, 검색, 찜하기
│   │   ├── properties.controller.ts    # 매물 API 엔드포인트
│   │   ├── schemas/
│   │   │   └── property.schema.ts      # 매물 데이터 스키마
│   │   └── dto/
│   │       ├── create-property.dto.ts  # 매물 등록 DTO
│   │       ├── update-property.dto.ts  # 매물 수정 DTO
│   │       └── filter-property.dto.ts  # 매물 필터 DTO
│   │
│   ├── reservations/                   # 예약 관리 모듈 (구현 예정)
│   │   ├── reservations.module.ts
│   │   └── schemas/
│   │       └── reservation.schema.ts   # 예약 데이터 스키마
│   │
│   ├── payments/                       # 결제 모듈 (구현 예정)
│   │   └── payments.module.ts
│   │
│   ├── chat/                           # 실시간 채팅 모듈
│   │   ├── chat.module.ts
│   │   ├── chat.service.ts             # 채팅방, 메시지 관리
│   │   ├── chat.controller.ts          # 채팅 REST API
│   │   ├── chat.gateway.ts             # WebSocket 게이트웨이
│   │   ├── guards/
│   │   │   └── ws-jwt.guard.ts         # WebSocket JWT 인증 가드
│   │   └── schemas/
│   │       └── chat.schema.ts          # 채팅방, 메시지 스키마
│   │
│   ├── notifications/                  # 알림 모듈 (구현 예정)
│   │   └── notifications.module.ts
│   │
│   └── uploads/                        # 파일 업로드 모듈
│       ├── uploads.module.ts
│       ├── uploads.service.ts          # 파일 업로드 처리
│       └── uploads.controller.ts       # 파일 업로드 API
│
└── uploads/                            # 업로드된 파일 저장 디렉토리
```

## 주요 모듈 설명

### 1. Auth Module (인증/인가)
- JWT 기반 인증 시스템
- 회원가입, 로그인, 로그아웃
- Access Token & Refresh Token
- Public API 지원 (비회원 접근 가능)

### 2. Users Module (회원 관리)
- 회원 정보 CRUD
- 대학생 인증
- 프로필 관리

### 3. Posts Module (커뮤니티)
- 게시글 작성, 조회, 수정, 삭제
- 카테고리별 분류 (룸메이트 찾기, 정보 공유 등)
- 좋아요 기능
- 비회원 조회 가능

### 4. Properties Module (매물)
- 매물 등록, 조회, 수정, 삭제
- 필터링 및 검색
- 찜하기 기능
- 지도 기반 검색 지원
- 비회원 조회 가능

### 5. Chat Module (실시간 채팅)
- Socket.IO 기반 실시간 채팅
- 1:1 채팅 및 그룹 채팅
- 메시지 읽음 처리
- 타이핑 상태 표시
- 매물 관련 채팅 연동

### 6. Uploads Module (파일 업로드)
- 이미지 파일 업로드
- 로컬 저장 또는 AWS S3 연동 가능
- 파일 크기 및 형식 검증

### 7. Reservations Module (예약 관리) - 구현 예정
- 매물 예약 신청
- 예약 상태 관리
- 결제 연동

### 8. Payments Module (결제) - 구현 예정
- 토스페이먼츠/아임포트 연동
- 예약금 결제
- 결제 내역 관리

### 9. Notifications Module (알림) - 구현 예정
- 실시간 알림 (새 매물, 메시지, 예약 상태)
- 푸시 알림
- 이메일 알림

## 데이터베이스 스키마

### User (회원)
- 기본 정보: 이메일, 비밀번호, 이름, 전화번호
- 대학 정보: 학교명, 학번, 인증 상태
- 프로필: 성별, 생년월일, 생활 패턴, 관심사 등

### Post (게시글)
- 제목, 내용, 작성자, 카테고리
- 조회수, 좋아요, 댓글 수
- 룸메이트 찾기 관련 추가 정보

### Property (매물)
- 기본 정보: 제목, 설명, 주소, 가격
- 매물 유형 및 옵션
- 이미지, 지도 좌표
- 찜하기 목록

### ChatRoom (채팅방)
- 참여자 목록
- 메시지 내역
- 읽지 않은 메시지 수

### Reservation (예약)
- 매물, 예약자, 예약 기간
- 예약 상태 및 결제 정보

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/logout` - 로그아웃

### 커뮤니티
- `GET /api/posts` - 게시글 목록 (비회원 가능)
- `POST /api/posts` - 게시글 작성 (회원 전용)

### 매물
- `GET /api/properties` - 매물 목록 (비회원 가능)
- `POST /api/properties` - 매물 등록 (회원 전용)

### 채팅
- `GET /api/chat/rooms` - 채팅방 목록
- `POST /api/chat/rooms` - 채팅방 생성

### 파일 업로드
- `POST /api/uploads/single` - 단일 파일 업로드
- `POST /api/uploads/multiple` - 다중 파일 업로드

## 실시간 기능 (WebSocket)

### Socket.IO 이벤트
- `join` - 채팅방 입장
- `sendMessage` - 메시지 전송
- `newMessage` - 새 메시지 수신
- `typing` - 타이핑 상태
- `notification` - 알림 수신

## 보안

- JWT 인증
- bcrypt 비밀번호 해싱
- CORS 설정
- Rate Limiting
- Input Validation (class-validator)

## 향후 확장 계획

1. **결제 시스템 완성**
   - 토스페이먼츠/아임포트 연동
   - 예약금 결제 및 환불

2. **알림 시스템 구현**
   - 실시간 푸시 알림
   - 이메일 알림
   - SMS 알림

3. **검색 최적화**
   - Elasticsearch 도입
   - 지도 기반 검색 고도화

4. **성능 최적화**
   - Redis 캐싱
   - CDN 연동
   - 데이터베이스 인덱싱

5. **모바일 앱**
   - React Native 앱 개발
   - 동일한 백엔드 API 사용

6. **관리자 기능**
   - 관리자 대시보드
   - 신고 시스템
   - 통계 및 분석
