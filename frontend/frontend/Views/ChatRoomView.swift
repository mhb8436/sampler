import SwiftUI

struct ChatRoomView: View {
    let chatRoomId: Int
    @ObservedObject var socketService: WebSocketService
    @State private var input = ""

    init(chatRoomId: Int) {
        self.chatRoomId = chatRoomId
        self._socketService = ObservedObject(wrappedValue: WebSocketService(chatRoomId: chatRoomId))
    }

    var body: some View {
        VStack {
            List(socketService.messages) { msg in
                HStack {
                    Text(msg.user?.nickname ?? "").bold()
                    Text(msg.content ?? "")
                }
            }
            HStack {
                TextField("메시지 입력", text: $input)
                Button("보내기") {
                    socketService.sendMessage(content: input)
                    input = ""
                }
            }.padding()
        }
        .navigationTitle("채팅방")
        .onDisappear {
            print("ChatRoomView disappeared - disconnecting WebSocket")
            socketService.leaveRoom()  // 방을 나가고
            socketService.disconnect() // 웹소켓 연결을 끊음
        }
    }
}


#Preview {
    NavigationView {
        ChatRoomView(chatRoomId: 1)
    }
}
