# Sampler Frontend

SwiftUI 기반의 iOS/맥 앱 프론트엔드 프로젝트입니다. 게시판과 채팅 기능을 통합 제공하며, REST API와 WebSocket을 모두 활용합니다.

## 주요 기능
- **회원가입/로그인**: JWT 토큰 기반 인증
- **게시판**: 글 목록 조회, 글 상세, 글 작성, 댓글(답변) 기능
- **채팅**: 채팅방 목록, 채팅방 생성, 실시간 메시지 송수신 (WebSocket)

## 폴더 구조
```
frontend/
├── Models/        # 데이터 모델 정의 (User, Post, ChatRoom 등)
├── Services/      # API 및 WebSocket 서비스
├── ViewModels/    # MVVM 패턴의 ViewModel들
├── Views/         # SwiftUI View
├── Assets.xcassets/ # 리소스
├── ContentView.swift
├── frontendApp.swift
...
```

## 주요 파일 설명
- `frontendApp.swift`: 앱의 진입점, 인증 상태에 따라 메인 탭 또는 로그인 뷰로 분기
- `Models/`: User, Post, Message, ChatRoom 등 데이터 구조 정의
- `Services/APIService.swift`: REST API 통신(Alamofire 사용)
- `Services/WebSocketService.swift`: 실시간 채팅용 WebSocket 관리(Socket.IO)
- `ViewModels/`: 각 기능별 상태 및 로직 관리
- `Views/`: 인증, 게시판, 채팅 UI 구현

## 사용 라이브러리
- [SwiftUI](https://developer.apple.com/xcode/swiftui/)
- [Alamofire](https://github.com/Alamofire/Alamofire)
- [Socket.IO-Client-Swift](https://github.com/socketio/socket.io-client-swift)

## 실행 방법
1. Xcode로 `frontend.xcodeproj` 열기
2. 시뮬레이터 또는 실제 기기에서 실행
3. 백엔드 서버(`http://localhost:3000`)가 필요합니다.

## 참고
- MVVM 패턴 기반으로 설계됨
- Swift Concurrency(`async/await`) 적극 활용
