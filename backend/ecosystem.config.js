module.exports = {
  apps: [
    {
      name: 'sampler-backend',
      script: 'dist/main.js',
      instances: 'max', // CPU 코어 수만큼 인스턴스 생성
      exec_mode: 'cluster', // 클러스터 모드 사용
      watch: false, // 파일 변경 감지 비활성화 (Docker 환경에서는 불필요)
      max_memory_restart: '1G', // 메모리 제한
      env: {
        NODE_ENV: 'production',
      },
      // 로그 설정
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/app/logs/error.log',
      out_file: '/app/logs/out.log',
      merge_logs: true,
      // Socket.IO를 위한 설정
      wait_ready: true, // 앱이 ready 신호를 보낼 때까지 대기
      listen_timeout: 10000, // ready 신호 대기 시간
    },
  ],
};
