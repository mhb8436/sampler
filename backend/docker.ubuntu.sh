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

# 컨테이너 실행
docker compose up

# 백그라운드에서 실행
docker compose up -d

# 컨테이너 중지
docker compose down

# 이미지 삭제
docker rmi -f $(docker images -a -q)

# 컨테이너 삭제
docker rm -f $(docker ps -a -q)

# 빌드 재실행 
docker compose build --no-cache

# 컨테이너 내부의 PM2 모니터링
docker compose exec backend pm2 monit

# 로그 보기
docker compose exec backend pm2 logs


