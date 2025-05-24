import Foundation

struct Message: Codable, Identifiable {
    let id: Int
    let chatRoomId: Int
    let user: User?
    let content: String?
    let createdAt: String?
}
