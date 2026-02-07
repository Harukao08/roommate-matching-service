# 대학생 룸메이트 매칭 부동산 서비스

## 📋 프로젝트 개요
대학생들이 룸메이트를 찾고 동시에 매물을 확인할 수 있는 통합 플랫폼

## 🎯 주요 기능

### 1. 커뮤니티
- 룸메이트 찾기 게시판
- 게시글 조회 (비회원 가능)
- 게시글 작성/수정/삭제 (회원 전용)
- 댓글 기능
- 실시간 채팅

### 2. 매물 관리
- 매물 목록 조회 (비회원 가능)
- 매물 등록/수정/삭제 (회원 전용)
- 매물 상세 정보 및 이미지
- 매물 예약 및 결제 (회원 전용)
- 찜하기 기능

### 3. 회원 관리
- 회원가입/로그인 (JWT)
- 프로필 관리
- 대학생 인증

### 4. 실시간 기능
- Socket.IO 기반 실시간 채팅
- 실시간 알림 (새 매물, 메시지, 예약 상태)

### 5. 결제 시스템
- 예약금 결제
- 결제 내역 관리

## 🛠 기술 스택

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + Passport
- **Real-time**: Socket.IO
- **File Upload**: Multer + AWS S3 (or local storage)
- **Payment**: 토스페이먼츠 / 아임포트
- **Validation**: class-validator, class-transformer

### Frontend (추후 앱 확장 고려)
- React.js / React Native
- Redux Toolkit / Zustand
- Socket.IO Client
- Axios

## 📁 프로젝트 구조

```
roommate-matching-service/
├── src/
│   ├── auth/                    # 인증/인가
│   ├── users/                   # 회원 관리
│   ├── posts/                   # 커뮤니티 게시글
│   ├── comments/                # 댓글
│   ├── properties/              # 매물 관리
│   ├── reservations/            # 예약 관리
│   ├── payments/                # 결제
│   ├── chat/                    # 실시간 채팅
│   ├── notifications/           # 알림
│   ├── uploads/                 # 파일 업로드
│   ├── common/                  # 공통 유틸리티
│   │   ├── guards/              # 가드 (인증, 권한)
│   │   ├── decorators/          # 커스텀 데코레이터
│   │   ├── filters/             # 예외 필터
│   │   └── interceptors/        # 인터셉터
│   ├── config/                  # 설정 파일
│   ├── app.module.ts
│   └── main.ts
├── test/
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## 🚀 시작하기

### 1. 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.example`을 복사하여 `.env` 파일 생성

### 3. MongoDB 연결
로컬 MongoDB 또는 MongoDB Atlas 설정

### 4. 실행
```bash
# 개발 모드
npm run start:dev

# 프로덕션 모드
npm run build
npm run start:prod
```

## 📊 데이터베이스 스키마

### User (회원)
- 기본 정보 (이메일, 비밀번호, 이름, 전화번호)
- 대학 정보 (학교명, 학번, 인증 상태)
- 프로필 (성별, 생년월일, 흡연 여부, 생활 패턴 등)

### Post (커뮤니티 게시글)
- 제목, 내용, 작성자
- 카테고리 (룸메이트 찾기, 정보 공유 등)
- 조회수, 좋아요

### Property (매물)
- 기본 정보 (제목, 설명, 주소, 가격)
- 매물 유형 (원룸, 투룸, 쉐어하우스 등)
- 옵션 (에어컨, 세탁기, 인터넷 등)
- 이미지 URL 배열
- 예약 가능 여부

### Reservation (예약)
- 매물, 예약자, 예약 기간
- 예약 상태 (대기, 승인, 거절, 취소)
- 결제 정보

### Chat (채팅)
- 채팅방, 참여자, 메시지 목록

### Notification (알림)
- 수신자, 알림 유형, 내용
- 읽음 여부

## 🔐 API 엔드포인트

### 인증
- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인
- `POST /auth/refresh` - 토큰 갱신

### 커뮤니티
- `GET /posts` - 게시글 목록 (비회원 가능)
- `GET /posts/:id` - 게시글 상세 (비회원 가능)
- `POST /posts` - 게시글 작성 (회원 전용)
- `PATCH /posts/:id` - 게시글 수정 (회원 전용)
- `DELETE /posts/:id` - 게시글 삭제 (회원 전용)

### 매물
- `GET /properties` - 매물 목록 (비회원 가능)
- `GET /properties/:id` - 매물 상세 (비회원 가능)
- `POST /properties` - 매물 등록 (회원 전용)
- `PATCH /properties/:id` - 매물 수정 (회원 전용)
- `DELETE /properties/:id` - 매물 삭제 (회원 전용)

### 예약
- `POST /reservations` - 예약 신청 (회원 전용)
- `GET /reservations/my` - 내 예약 목록 (회원 전용)
- `PATCH /reservations/:id/status` - 예약 상태 변경 (회원 전용)

### 채팅
- `GET /chat/rooms` - 채팅방 목록 (회원 전용)
- `POST /chat/rooms` - 채팅방 생성 (회원 전용)
- `GET /chat/rooms/:id/messages` - 메시지 내역 (회원 전용)

## 📱 앱 확장 계획
- React Native로 크로스 플랫폼 앱 개발
- 동일한 백엔드 API 사용
- Socket.IO를 통한 실시간 기능 유지

## 🔒 보안
- JWT 기반 인증
- bcrypt 비밀번호 암호화
- CORS 설정
- Rate Limiting
- Input Validation
- XSS, CSRF 방지

## 📈 향후 개선 사항
- Redis 캐싱
- Elasticsearch 검색 최적화
- CI/CD 파이프라인
- 테스트 코드 작성
- API 문서 자동화 (Swagger)
