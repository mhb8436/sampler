import Foundation
import Combine

class ChatRoomViewModel: ObservableObject {
    @Published var messages: [Message] = []
    var token: String = ""
    var chatRoomId: Int = 0

    func fetchMessages() {
        Task {
            do {
                let fetchedMessages = try await APIService.shared.fetchMessages(chatRoomId: chatRoomId)
                await MainActor.run {
                    self.messages = fetchedMessages
                }
            } catch {
                print("Error fetching messages: \(error)")
            }
        }
    }
}
