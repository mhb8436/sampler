import Foundation
import SocketIO

class WebSocketService: ObservableObject {
    @Published var messages: [Message] = []
    private var manager: SocketManager?
    private var socket: SocketIOClient?
    private var chatRoomId: Int
    enum APIError: Error {
          case missingToken
      }
    
    init(chatRoomId: Int) {
        guard let token = APIService.shared.getToken() else {
            fatalError("No token available for WebSocket connection")
        }
        print("WebSocketService : init \(chatRoomId)")
        self.chatRoomId = chatRoomId
        let url = URL(string: "http://localhost:3000")! // ws 대신 http, 포트/도메인 맞게 수정
        manager = SocketManager(socketURL: url, config: [
                    .log(true),
                    .compress,                
                    .extraHeaders(["Authorization": "Bearer \(token)"])
                ])
        socket = manager?.defaultSocket
        addHandlers()
        socket?.connect()
    }

    private func addHandlers() {
        socket?.on(clientEvent: .connect) { [weak self] data, ack in
            print("Socket connected \(data)")
            self?.joinRoom()
        }
        socket?.on("message") { [weak self] data, ack in
            guard let arr = data as? [Any], let dict = arr.first as? [String: Any],
                  let jsonData = try? JSONSerialization.data(withJSONObject: dict),
                  let message = try? JSONDecoder().decode(Message.self, from: jsonData) else { return }
            DispatchQueue.main.async {
                self?.messages.append(message)
            }
        }
        socket?.on("notice") { data, ack in
            print("Notice: ", data)
        }
        socket?.on(clientEvent: .disconnect) { data, ack in
            print("Socket disconnected")
        }
    }

    func joinRoom() {
        socket?.emit("joinRoom", ["chatRoomId": chatRoomId])
    }
    func leaveRoom() {
        socket?.emit("leaveRoom", ["chatRoomId": chatRoomId])
    }
    func sendMessage(content: String) {
        socket?.emit("sendMessage", ["chatRoomId": chatRoomId, "content": content])
    }
    func disconnect() {
        socket?.disconnect()
    }
}
