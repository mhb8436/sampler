# Sampler 백엔드

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
- 게시판: `/posts/posts` (CRUD), `/posts/posts/:id/answers`
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
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/sampler?schema=public"

# eslint 제거
npm uninstall eslint @eslint/eslintrc @eslint/js eslint-config-prettier eslint-plugin-prettier typescript-eslint



nest g resource crawling

npm i @nest/schedule



# package.json에서
#    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix", 삭제

```

---

## socket.io

1. websocket : raw level , client <----> server : 전용 클라이언트가 x ,
2. socket.io : client <-------> server 1. websocket -> http long polling 전환 (끊김이 없게 ), 전용 클라이언트 O, 방

## langchain

```bash
npm install @langchain/core @langchain/community ollama-node @langchain/ollama
npm install @langchain/community pgvector pg

psql postgres
\c sampler
CREATE EXTENSION IF NOT EXISTS vector;
\q
```

## add data

```bash
curl -X POST http://localhost:3030/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "content": "스시히로는 오마카세 전문점으로, 신선한 제철 생선을 사용한 정통 일식을 선보입니다. 숙련된 셰프의 섬세한 칼질과 정성스러운 서비스가 특징입니다.",
    "metadata": {
      "category": "레스토랑",
      "cuisine": "일식",
      "type": "restaurant",
      "priceRange": "$$$$",
      "location": {
        "city": "서울",
        "district": "강남구"
      },
      "features": ["오마카세", "예약필수", "데이트"]
    }
  }'

  curl -X POST http://localhost:3030/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "content": "오스테리아 문은 나폴리 출신 셰프가 선보이는 정통 이탈리안 레스토랑입니다. 수제 파스타와 피자가 대표 메뉴이며, 이탈리아 현지에서 직수입한 와인 페어링이 가능합니다.",
    "metadata": {
      "category": "레스토랑",
      "cuisine": "이탈리안",
      "type": "restaurant",
      "priceRange": "$$$",
      "location": {
        "city": "서울",
        "district": "마포구"
      },
      "features": ["와인페어링", "수제파스타", "피자", "데이트"],
      "signature": ["트러플 파스타", "나폴리 피자", "티라미수"]
    }
  }'

  curl -X POST http://localhost:3030/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "content": "모던한은 전통 한식을 현대적으로 재해석한 퓨전 한식당입니다. 제철 식재료를 활용한 코스 요리가 특징이며, 한식과 어울리는 칵테일 페어링이 인기 있습니다.",
    "metadata": {
      "category": "레스토랑",
      "cuisine": "한식",
      "type": "restaurant",
      "priceRange": "$$$$",
      "location": {
        "city": "서울",
        "district": "용산구"
      },
      "features": ["코스요리", "칵테일페어링", "모던한식", "분위기좋은"],
      "signature": ["한우 타르타르", "전복 미역국 리조또", "깻잎 막걸리"]
    }
  }'

  curl -X POST http://localhost:3030/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "content": "포레스트는 베트남 현지 셰프가 운영하는 정통 베트남 음식점입니다. 하노이식 쌀국수와 반미가 대표 메뉴이며, 베트남 커피와 에그커피도 인기가 많습니다.",
    "metadata": {
      "category": "레스토랑",
      "cuisine": "베트남",
      "type": "restaurant",
      "priceRange": "$$",
      "location": {
        "city": "서울",
        "district": "서초구"
      },
      "features": ["현지맛", "캐주얼", "테이크아웃"],
      "signature": ["하노이 쌀국수", "반미", "에그커피"],
      "parking": true
    }
  }'

  curl -X POST http://localhost:3030/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "content": "라 보케리아는 스페인 바르셀로나의 시장을 연상케하는 타파스 바입니다. 다양한 핀초스와 타파스를 즐길 수 있으며, 스페인 와인과 상그리아가 준비되어 있습니다.",
    "metadata": {
      "category": "레스토랑",
      "cuisine": "스페인",
      "type": "restaurant",
      "priceRange": "$$$",
      "location": {
        "city": "서울",
        "district": "성수동"
      },
      "features": ["타파스", "와인바", "분위기좋은", "단체가능"],
      "signature": ["하몽", "감바스", "파에야"],
      "businessHours": {
        "dinner": "17:00-23:00",
        "closed": "월요일"
      }
    }
  }'

# search
curl "http://localhost:3030/recommendations?query=강남구에서%20고급스러운%20일식당%20추천해주세요"

```

## Docker Install on Ubuntu 22

```bash
# 이전 버전 제거 (이미 설치되어 있다면)
sudo apt-get remove docker docker-engine docker.io containerd runc

# 필요한 패키지 설치
sudo apt-get update
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Docker의 공식 GPG 키 추가
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Docker 리포지토리 설정
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker 엔진 설치
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Docker Compose V2 설치
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Docker 버전 확인
docker --version

# Docker Compose 버전 확인
docker compose version

# 현재 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# 변경사항 적용을 위해 로그아웃 후 다시 로그인하거나 다음 명령어 실행
newgrp docker
```

## Docker Deploy

```bash
cp docker-compose.yml .
cp Dockerfile .
cp ecosystem.config.js .
cp nginx.conf .
cp start.sh .

########################################################
# 빌드 실행 및 재실행
docker compose build --no-cache

docker compose down

# 소스 재배포
git pull origin main

# 강제로 로컬에 덮어쓰기
git fetch origin
git reset --hard origin/main

# docker-compose 파일 복사
cp docker-compose.example.yml docker-compose.yml

# 빌드 재실행
docker compose build --no-cache

# 컨테이너 실행
docker compose up -d

# 컨테이너 내부의 PM2 모니터링
docker compose exec backend pm2 monit

# 로그 보기
docker compose exec backend pm2 logs


########################################################
# 빌드 재실행 해도 해도 안되는 경우

# 컨테이너 삭제
docker rm -f $(docker ps -a -q)

# 이미지 삭제
docker rmi -f $(docker images -a -q)

# 빌드 재실행
docker compose build --no-cache

# 컨테이너 실행
docker compose up -d

# 컨테이너 내부의 PM2 모니터링
docker compose exec backend pm2 monit

# 로그 보기
docker compose exec backend pm2 logs

# 데이터베이스 데이터 삭제
docker volume rm backend_postgres_data

# 컨테이너 중지 후 데이터 삭제
docker compose down -v

```

## ollama install in ubuntu

```
# ollama install
curl -fsSL https://ollama.com/install.sh | sh

# ollama qwen3:1.7b download
ollama pull qwen3:1.7b

# edit ollama service
sudo vi /etc/systemd/system/ollama.service

# [service] bottom add
Environment="OLLAMA_HOST=0.0.0.0:11434"

# ollama daemon-restart
sudo systemctl daemon-reload
sudo systemctl restart ollama.service


```
