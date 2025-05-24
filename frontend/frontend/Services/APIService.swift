import Foundation
import Alamofire

class APIService {
    static let shared = APIService()
    let baseURL = "http://localhost:3000" // 실제 서버 주소로 변경

    // 회원가입
    func signup(email: String, password: String, nickname: String) async throws -> Bool {
        let params = ["email": email, "password": password, "nickname": nickname]
        let response = try await AF.request("\(baseURL)/auth/signup", method: .post, parameters: params, encoding: JSONEncoding.default)
            .validate()
            .serializingData()
            .response
        return response.error == nil
    }

    // 로그인
    func login(email: String, password: String) async throws -> String? {
        let params = ["email": email, "password": password]
        let response = try await AF.request("\(baseURL)/auth/login", method: .post, parameters: params, encoding: JSONEncoding.default)
            .validate()
            .serializingDecodable(LoginResponse.self)
            .value
        return response.access_token
    }

    // 게시판 글 목록
    func fetchPosts() async throws -> [Post] {
        let response = try await AF.request("\(baseURL)/board/posts")
            .serializingDecodable([Post].self)
            .value
        return response
    }

    // 게시글 상세
    func fetchPostDetail(postId: Int) async throws -> Post? {
        let response = try await AF.request("\(baseURL)/board/posts/\(postId)")
            .serializingDecodable(Post.self)
            .value
        return response
    }

    // 글 작성
    func createPost(title: String, content: String, token: String) async throws -> Bool {
        let params = ["title": title, "content": content]
        let headers: HTTPHeaders = ["Authorization": "Bearer \(token)"]
        let response = try await AF.request("\(baseURL)/board/posts", method: .post, parameters: params, encoding: JSONEncoding.default, headers: headers)
            .validate()
            .serializingData()
            .response
        return response.error == nil
    }

    // 댓글 작성
    func createAnswer(postId: Int, content: String, token: String) async throws -> Bool {
        let params = ["content": content]
        let headers: HTTPHeaders = ["Authorization": "Bearer \(token)"]
        let response = try await AF.request("\(baseURL)/board/posts/\(postId)/answers", method: .post, parameters: params, encoding: JSONEncoding.default, headers: headers)
            .validate()
            .serializingData()
            .response
        return response.error == nil
    }

    // 채팅방 목록
    func fetchChatRooms() async throws -> [ChatRoom] {
        let response = try await AF.request("\(baseURL)/chat/rooms")
            .serializingDecodable([ChatRoom].self)
            .value
        return response
    }

    // 채팅방 생성
    func createChatRoom(name: String, token: String) async throws -> Bool {
        let params = ["name": name]
        let headers: HTTPHeaders = ["Authorization": "Bearer \(token)"]
        let response = try await AF.request("\(baseURL)/chat/rooms", method: .post, parameters: params, encoding: JSONEncoding.default, headers: headers)
            .validate()
            .serializingData()
            .response
        return response.error == nil
    }

    // 메시지 목록
    func fetchMessages(chatRoomId: Int) async throws -> [Message] {
        let response = try await AF.request("\(baseURL)/chat/rooms/\(chatRoomId)/messages")
            .serializingDecodable([Message].self)
            .value
        return response
    }
}

struct LoginResponse: Codable {
    let access_token: String
}
