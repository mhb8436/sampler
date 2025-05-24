# Node.js/NestJS 기반 실시간 커뮤니티 백엔드

이 프로젝트는 실시간 채팅, 게시판, 사용자 인증 기능을 제공하는 커뮤니티 백엔드 서버입니다.

## 주요 기능

- 회원가입/로그인(JWT 인증)
- 게시판(글 작성, 목록, 상세, 댓글)
- 실시간 채팅방 생성 및 메시지 교환(WebSocket)
- PostgreSQL 기반 데이터 관리(Prisma ORM)

## 기술 스택

- Node.js, TypeScript
- NestJS (웹 서버/REST API/소켓)
- PostgreSQL (DB)
- Prisma (ORM)
- Passport, JWT (인증)
- Socket.IO (실시간 통신)

## 폴더 구조 예시

```
backend/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── chats/           # 채팅 관련 모듈
│   ├── posts/          # 게시판 관련 모듈
│   ├── users/          # 사용자 관련 모듈
│   └── auth/           # 인증 관련 모듈
├── prisma/
│   └── schema.prisma
├── package.json
└── README.md
```

## API 개요

- 인증: `/auth/signup`, `/auth/login`
- 게시판: `/board/posts` (CRUD), `/board/posts/:id/answers`
- 채팅: `/chat/rooms`, `/chat/rooms/:roomId/messages` (REST), 실시간 메시지(Socket.IO)

---

# 🛠️ 프로젝트 준비/설치 명령어 모음

아래 명령어들은 이 프로젝트를 처음 세팅할 때 사용한 주요 명령어입니다. 직접 따라하며 환경을 재현할 수 있습니다.

```bash
# 1. Node 프로젝트 초기화
npm init -y

# 2. NestJS CLI 설치 (글로벌)
npm install @nestjs/cli -g

# 3. NestJS 프로젝트 생성 (backend 폴더)
nest new backend --package-manager npm --skip-git

# 4. 필수 패키지 설치 (backend 디렉토리에서 실행)
npm install @nestjs/websockets @nestjs/platform-socket.io @nestjs/passport passport passport-local passport-jwt @nestjs/jwt bcrypt prisma @prisma/client @nestjs/config pg class-validator class-transformer

npm install --save @nestjs/swagger swagger-ui-express

# 5. Prisma 초기화 (backend 디렉토리에서 실행)
npx prisma init

# CREATE DATABASE
psql postgres
CREATE DATABASE sampler;
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE sampler TO myuser;
ALTER USER myuser CREATEDB;
\q

# 6. Prisma 마이그레이션 및 DB 테이블 생성 (backend 디렉토리에서 실행)
npx prisma migrate dev --name init

# (문제해결) DB 계정에 CREATE DATABASE 권한 부여
# 만약 아래와 같은 에러가 발생한다면:
#   ERROR: permission denied to create database
# Postgres 슈퍼유저로 접속해서 아래 명령어를 실행하세요.
psql postgres
ALTER USER myuser CREATEDB;
\q

# 리소스 생성
nest g resource users
nest g resource posts
nest g resource chats
nest g module prisma
nest g module auth
nest g service auth
nest g controller auth

# add jwt constants to .env
JWT_SECRET = "secret-jwt-development"

# eslint 제거
npm uninstall eslint @eslint/eslintrc @eslint/js eslint-config-prettier eslint-plugin-prettier typescript-eslint


# package.json에서
#    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix", 삭제

```

---
