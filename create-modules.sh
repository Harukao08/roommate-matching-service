#!/bin/bash

# 이 스크립트는 나머지 필요한 모듈들의 기본 구조를 생성합니다

echo "기본 모듈 구조 생성 중..."

# Comments Module
mkdir -p src/comments/dto
touch src/comments/comments.module.ts
touch src/comments/comments.service.ts
touch src/comments/comments.controller.ts
touch src/comments/schemas/comment.schema.ts

# Reservations Module
mkdir -p src/reservations/dto
touch src/reservations/reservations.module.ts
touch src/reservations/reservations.service.ts
touch src/reservations/reservations.controller.ts

# Payments Module
mkdir -p src/payments/dto
touch src/payments/payments.module.ts
touch src/payments/payments.service.ts
touch src/payments/payments.controller.ts
touch src/payments/schemas/payment.schema.ts

# Notifications Module
mkdir -p src/notifications/dto
touch src/notifications/notifications.module.ts
touch src/notifications/notifications.service.ts
touch src/notifications/notifications.controller.ts
touch src/notifications/schemas/notification.schema.ts

# Uploads Module
mkdir -p src/uploads
touch src/uploads/uploads.module.ts
touch src/uploads/uploads.service.ts
touch src/uploads/uploads.controller.ts

# Posts Module
mkdir -p src/posts/dto
touch src/posts/posts.module.ts
touch src/posts/posts.service.ts
touch src/posts/posts.controller.ts

# Common Guards
mkdir -p src/chat/guards
touch src/chat/guards/ws-jwt.guard.ts

echo "기본 모듈 구조 생성 완료!"
