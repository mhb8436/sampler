import Foundation
import Combine

class ChatListViewModel: ObservableObject {
    @Published var rooms: [ChatRoom] = []
//    var token: String = ""

    func fetchRooms() {
        Task {
            do {
                let fetchedRooms = try await APIService.shared.fetchChatRooms()
                await MainActor.run {
                    self.rooms = fetchedRooms
                }
            } catch {
                print("Error fetching chat rooms: \(error)")
            }
        }
    }
}
