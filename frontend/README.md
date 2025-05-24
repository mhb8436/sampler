# Sampler Frontend

SwiftUI 기반의 iOS/macOS 네이티브 앱 프론트엔드 프로젝트입니다. 게시판과 채팅 기능을 통합 제공하며, REST API와 WebSocket을 모두 활용합니다.

## 주요 기능
- **회원가입/로그인**: JWT 토큰 기반 인증
- **게시판**: 글 목록 조회, 글 상세, 글 작성, 댓글(답변) 기능
- **채팅**: 채팅방 목록, 채팅방 생성, 실시간 메시지 송수신 (WebSocket)

## 개발 환경 요구사항
- Xcode 14.x 이상
- iOS 15.0 이상 / macOS 12.0 이상
- Swift 5.5 이상
- CocoaPods 또는 Swift Package Manager

## 프로젝트 구조
```
frontend/
├── Models/            # 데이터 모델 정의 (User, Post, ChatRoom 등)
├── Services/          # API 및 WebSocket 서비스
│   ├── APIService.swift      # REST API 통신
│   └── WebSocketService.swift # WebSocket 관리
├── ViewModels/        # MVVM 패턴의 ViewModel들
│   ├── AuthViewModel.swift   # 인증 관련 로직
│   ├── PostViewModel.swift   # 게시판 관련 로직
│   └── ChatViewModel.swift   # 채팅 관련 로직
├── Views/             # SwiftUI View
│   ├── Auth/          # 인증 관련 뷰
│   ├── Board/         # 게시판 관련 뷰
│   └── Chat/          # 채팅 관련 뷰
├── Utils/             # 유틸리티 함수 및 확장
├── Resources/         # 리소스 파일
│   ├── Assets.xcassets
│   └── Localizable.strings
├── App/               # 앱 설정 및 진입점
│   ├── frontendApp.swift
│   └── ContentView.swift
└── frontend.xcodeproj # Xcode 프로젝트 파일
```

## 주요 파일 설명
- `App/frontendApp.swift`: 앱의 진입점, 인증 상태에 따라 메인 탭 또는 로그인 뷰로 분기
- `Models/`: User, Post, Message, ChatRoom 등 데이터 구조 정의
- `Services/APIService.swift`: REST API 통신(Alamofire 사용)
- `Services/WebSocketService.swift`: 실시간 채팅용 WebSocket 관리(Socket.IO)
- `ViewModels/`: 각 기능별 상태 및 로직 관리
- `Views/`: 인증, 게시판, 채팅 UI 구현
- `Utils/`: 공통으로 사용되는 유틸리티 함수 및 확장

## 사용 라이브러리
- [SwiftUI](https://developer.apple.com/xcode/swiftui/) - UI 프레임워크
- [Alamofire](https://github.com/Alamofire/Alamofire) - HTTP 통신
- [Socket.IO-Client-Swift](https://github.com/socketio/socket.io-client-swift) - WebSocket 통신
- [Swift Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/) - 비동기 처리

## 아키텍처
- MVVM (Model-View-ViewModel) 패턴 적용
- Swift Concurrency(`async/await`)를 활용한 비동기 처리
- 의존성 주입을 통한 느슨한 결합
- Repository 패턴을 통한 데이터 접근 추상화

## 실행 방법
1. 프로젝트 클론
```bash
git clone [repository-url]
cd sampler/frontend
```

2. 의존성 설치 (CocoaPods 사용 시)
```bash
pod install
```

3. Xcode로 프로젝트 열기
- CocoaPods 사용 시: `frontend.xcworkspace` 열기
- SPM 사용 시: `frontend.xcodeproj` 열기

4. 시뮬레이터 또는 실제 기기에서 실행
5. 백엔드 서버(`http://localhost:3000`) 실행 확인

## 개발 가이드라인
- Swift 코딩 컨벤션 준수
- MVVM 패턴 철저히 준수
- 비동기 작업은 Swift Concurrency 활용
- UI 컴포넌트는 재사용 가능하도록 설계
- 다크 모드 지원
- 접근성 고려

## 테스트
- 단위 테스트: ViewModel, Service 계층
- UI 테스트: 주요 사용자 시나리오
- 테스트 실행: `Cmd + U` 또는 Xcode의 Test Navigator 사용

## 배포
- TestFlight를 통한 베타 테스트
- App Store Connect를 통한 앱스토어 배포
- 버전 관리는 Semantic Versioning 준수

## 문제 해결
- 빌드 오류: `Product > Clean Build Folder` 후 재시도
- 의존성 문제: `pod deintegrate` 후 `pod install` 재실행
- 시뮬레이터 문제: 시뮬레이터 리셋 또는 재설치

## 라이선스
이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 기여하기
1. 이슈 생성
2. 브랜치 생성 (`feature/your-feature-name`)
3. 변경사항 커밋
4. Pull Request 생성

## 문의
프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.
